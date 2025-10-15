import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection, InsertResult } from '@/lib/db/utils';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { getAllProviders } from '@/lib/db/providers';
import { JucySitesResponse, JucySite, SiteSetting, DayHours, DefaultTimes, JucyRentalCatalogResponse, JucyProduct, JucyTripAvailabilityResponse, Holiday } from '@/types/jucy'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { FieldPacket } from 'mysql2/promise';
import { Station } from '@/types/station';
import { getCamperByExtId, updateCamperStation } from '@/lib/db/campers';

const JUCY_SITES_API_URL = process.env.JUCY_SITES_API_URL || 'http://localhost:3000/de/api/partner/jucy/v3/sites'; // Adjust as needed
const JUCY_RENTAL_CATALOG_API_URL = process.env.JUCY_RENTAL_CATALOG_API_URL || 'http://localhost:3000/de/api/partner/jucy/v3/rental-catalog';
const JUCY_AVAILABILITY_API_BASE_URL = process.env.JUCY_AVAILABILITY_API_BASE_URL || 'http://localhost:3000/de/api/partner/jucy/v3/trip/availability';

// Helper function to calculate a valid pickup and dropoff date
async function calculateValidDates(siteHolidays: Holiday[], initialDate: Date, siteCode: string, fleetTypeCode: string, connection: Connection, changesApplied: string[]): Promise<{ pickUpDate: string; dropOffDate: string } | null> {
  let currentDate = new Date(initialDate); // eslint-disable-line prefer-const
  let attempts = 0;
  const MAX_ATTEMPTS = 10; // Limit attempts to avoid infinite loops

  while (attempts < MAX_ATTEMPTS) {
    // Ensure it's a Tuesday
    while (currentDate.getDay() !== 2) { // 2 represents Tuesday
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if it's a holiday
    const isHoliday = siteHolidays.some(holiday => {
      const holidayStart = new Date(holiday.startDateTime);
      const holidayEnd = new Date(holiday.endDateTime);
      return currentDate >= holidayStart && currentDate <= holidayEnd;
    });

    if (!isHoliday) {
      const pickUpDate = new Date(currentDate);
      const dropOffDate = new Date(currentDate);
      dropOffDate.setDate(dropOffDate.getDate() + 14); // 2 weeks later

      const formattedPickUpDate = pickUpDate.toISOString().split('.')[0];
      const formattedDropOffDate = dropOffDate.toISOString().split('.')[0];

      // Verify with Jucy Availability API
      const availabilityUrl = `${JUCY_AVAILABILITY_API_BASE_URL}?pickUpLocation=${siteCode}&dropOffLocation=${siteCode}&pickUpDate=${encodeURIComponent(formattedPickUpDate)}&dropOffDate=${encodeURIComponent(formattedDropOffDate)}&fleetTypeCode=${fleetTypeCode}`;
      try {
        const availabilityResponse = await fetch(availabilityUrl);
        if (availabilityResponse.ok) {
          const availabilityData: JucyTripAvailabilityResponse = await availabilityResponse.json();
          const isAvailable = availabilityData.fleetCategories.some(fc => fc.availability === 'FreeSell');
          if (isAvailable) {
            return { pickUpDate: formattedPickUpDate, dropOffDate: formattedDropOffDate };
          }
        } else if (availabilityResponse.status === 404) {
          changesApplied.push(`Availability API returned 404 for ${fleetTypeCode} at ${siteCode} on ${formattedPickUpDate}. Adjusting date.`);
          currentDate.setDate(currentDate.getDate() + 15); // Move 2 weeks and 1 day forward
          attempts++;
          continue;
        } else {
          changesApplied.push(`Availability API error for ${fleetTypeCode} at ${siteCode} on ${formattedPickUpDate}: ${availabilityResponse.statusText}`);
        }
      } catch (apiError) {
        changesApplied.push(`Error calling Availability API for ${fleetTypeCode} at ${siteCode} on ${formattedPickUpDate}: ${(apiError as Error).message}`);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to next day if not valid
    attempts++;
  }
  changesApplied.push(`Could not find a valid availability date for ${fleetTypeCode} at ${siteCode} after ${MAX_ATTEMPTS} attempts.`);
  return null;
}

export async function POST(request: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  let connection;
  try {
    const response = await fetch(JUCY_SITES_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Jucy Sites API: ${response.statusText}`);
    }
    const jucySites: JucySitesResponse = await response.json();

    // Fetch Jucy Products (Campers) once
    const rentalCatalogResponse = await fetch(JUCY_RENTAL_CATALOG_API_URL);
    if (!rentalCatalogResponse.ok) {
      throw new Error(`Failed to fetch data from Jucy Rental Catalog API: ${rentalCatalogResponse.statusText}`);
    }
    const jucyRentalCatalog: JucyRentalCatalogResponse = await rentalCatalogResponse.json();
    const allJucyProducts = jucyRentalCatalog.products;

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // Ensure 'Jucy' provider exists
    let jucyProviderId: number | null = null;
    const existingProviders = await getAllProviders(connection);
    const jucyProvider = existingProviders.find(p => p.company_name?.toLowerCase() === 'jucy');

    if (jucyProvider) {
      jucyProviderId = jucyProvider.id;
    } else {
      const newProviderData = {
        company_name: 'Jucy',
        ext_id: 'jucy', // Using 'jucy' as ext_id for Jucy provider
        is_active: true,
      };
      const insertFields = Object.keys(newProviderData).map(key => `"${key}"`).join(', ');
      const insertValues = Object.values(newProviderData);
      const placeholders = Array(insertValues.length).fill('?').join(', ');
      const [result] = await connection.execute(`INSERT INTO providers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
      jucyProviderId = result.insertId;
      changesApplied.push(`Created new provider: Jucy (Internal ID: ${jucyProviderId})`);
    }

    if (!jucyProviderId) {
      throw new Error('Failed to create or find Jucy provider.');
    }

    for (const jucySite of jucySites) {
      // Filter out sites that only include siteSettings with one object that has fleetTypeSlug set as "car"
      const hasNonCarFleet = jucySite.siteSettings.some(setting => setting.fleetTypeSlug !== 'car');
      if (!hasNonCarFleet && jucySite.siteSettings.length > 0) {
        changesApplied.push(`Skipping Jucy site ${jucySite.name} (ID: ${jucySite.id}) - only contains 'car' fleetTypeSlug.`);
        continue;
      }

      const formatTime = (time: string) => {
        if (!time || time === '0000') return null;
        const hours = time.substring(0, 2);
        const minutes = time.substring(2, 4);
        return `${hours}:${minutes}`;
      };

      const mapServiceHours = (serviceHours: Record<string, DayHours>) => {
        const mappedHours: Record<string, { open: string | null; close: string | null }> = {};
        for (const day in serviceHours) {
          mappedHours[day] = {
            open: formatTime(serviceHours[day].open),
            close: formatTime(serviceHours[day].close),
          };
        }
        return mappedHours;
      };

      const mapDefaultTimes = (defaultTimes: DefaultTimes) => {
        const mappedTimes: Record<string, { pickUp: string | null; dropOff: string | null }> = {};
        for (const day in defaultTimes) {
          mappedTimes[day] = {
            pickUp: formatTime(defaultTimes[day as keyof DefaultTimes].pickUp),
            dropOff: formatTime(defaultTimes[day as keyof DefaultTimes].dropOff),
          };
        }
        return mappedTimes;
      };

      const stationData: Partial<Station> = {
        ext_id: jucySite.id,
        provider_id: jucyProviderId,
        rental_company_id: jucySite.businessUnit, // Assuming businessUnit is the rental_company_id
        active: true, // Jucy API doesn't have a direct 'active' field for sites, defaulting to true
        name: jucySite.name,
        iata: jucySite.siteCode || null,
        country_code: jucySite.countryCode || null,
        country: jucySite.country || null,
        city: jucySite.address1.city || null,
        administrative_area_level_2: jucySite.address1.state || null, // Assuming state maps to admin_area_level_2
        administrative_area_level_1: jucySite.address1.state || null, // Assuming state maps to admin_area_level_1
        postal_code: jucySite.address1.postCode || null,
        street: jucySite.address1.line1 || null,
        street_number: null, // Jucy API doesn't provide street number separately
        address: [
          jucySite.address1.line1,
          jucySite.address1.city,
          jucySite.address1.postCode,
          jucySite.address1.country,
        ].filter(Boolean).join(', ') || null,
        description: null, // Jucy API doesn't have a direct description for sites
        lat: jucySite.geoLocation.lat || null,
        lng: jucySite.geoLocation.lng || null,
        phone_number: jucySite.phone || null,
        fax_number: null, // Not available in Jucy API
        hotline_number: jucySite.reservationsPhone || null,
        // Weekday open booleans - need to derive from serviceHours
        weekday_open_monday: jucySite.siteSettings[0]?.serviceHours?.monday?.open !== '0000',
        weekday_open_tuesday: jucySite.siteSettings[0]?.serviceHours?.tuesday?.open !== '0000',
        weekday_open_wednesday: jucySite.siteSettings[0]?.serviceHours?.wednesday?.open !== '0000',
        weekday_open_thursday: jucySite.siteSettings[0]?.serviceHours?.thursday?.open !== '0000',
        weekday_open_friday: jucySite.siteSettings[0]?.serviceHours?.friday?.open !== '0000',
        weekday_open_saturday: jucySite.siteSettings[0]?.serviceHours?.saturday?.open !== '0000',
        weekday_open_sunday: jucySite.siteSettings[0]?.serviceHours?.sunday?.open !== '0000',
        weekday_open_holiday: false, // Not directly available
        // Weekday text - can be generated from serviceHours or left null
        weekday_text_monday: null,
        weekday_text_tuesday: null,
        weekday_text_wednesday: null,
        weekday_text_thursday: null,
        weekday_text_friday: null,
        weekday_text_saturday: null,
        weekday_text_sunday: null,
        weekday_text_holiday: null,
        weekday_text_info: null,
        image: null, // Not directly available
        vehiclecount: null, // Not directly available
        email: null, // Not directly available
        payment_options: null, // Not directly available
        opening_hours: JSON.stringify(mapServiceHours(jucySite.siteSettings[0]?.serviceHours)),
        distance_motorway_km: null,
        distance_airport_km: null,
        distance_train_station_km: null,
        distance_bus_stop_km: null,
        parking_info: null,
        shopping_info: null,
        fuel_station_info: null,
        guest_toilet: null,
        lounge_area: null,
        greywater_disposal_info: null,
        pickup_hours: JSON.stringify(mapDefaultTimes(jucySite.defaultTimes)),
        return_hours: JSON.stringify(mapDefaultTimes(jucySite.defaultTimes)),
      };

      const internalStationId = await getInternalIdByExternalIdAndPartner(connection, 'jucy', 'station', jucySite.id);

      if (internalStationId) {
        // Update existing station
        const updateFields = Object.keys(stationData).map(key => `"${key}" = ?`).join(', ');
        const updateValues = Object.values(stationData).map(value => value === undefined ? null : value);
        await connection.execute(`UPDATE stations SET ${updateFields} WHERE id = ?`, [...updateValues, internalStationId]);
        changesApplied.push(`Updated station: ${jucySite.name} (External ID: ${jucySite.id}, Internal ID: ${internalStationId})`);
      } else {
        // Insert new station
        const insertFields = Object.keys(stationData).map(key => `"${key}"`).join(', ');
        const insertValues = Object.values(stationData).map(value => value === undefined ? null : value);
        const placeholders = Array(insertValues.length).fill('?').join(', ');
        const [result] = await connection.execute(`INSERT INTO stations (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
        const newStationId = result.insertId;
        await createPartnerMapping(connection, 'jucy', 'station', newStationId, jucySite.id);
        changesApplied.push(`Inserted new station: ${jucySite.name} (External ID: ${jucySite.id}, Internal ID: ${newStationId})`);
      }
    }

    return NextResponse.json({ message: 'Jucy stations imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing Jucy stations:', error);
    return NextResponse.json({ error: 'Failed to import Jucy stations.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
