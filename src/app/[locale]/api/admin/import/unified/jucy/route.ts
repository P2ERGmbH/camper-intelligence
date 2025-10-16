'use server';

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createDbConnection, InsertResult } from '@/lib/db/utils';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { getAllProviders } from '@/lib/db/providers';
import {
  JucyProduct,
  JucySite,
  DayHours,
  DefaultTimes,
  JucyTripAvailabilityResponse,
  JucyRentalCatalogResponse, JucyTripAvailability
} from '@/types/jucy';
import { FieldPacket, Connection } from 'mysql2/promise';
import { Station } from '@/types/station';
import { Camper } from '@/types/camper';
import { upsertImage, linkCamperImage } from '@/lib/db/images';
import {getJucyRentalCatalog} from "@/app/[locale]/api/partner/jucy/v3/rental-catalog/route";

import {getJucySites} from "@/app/[locale]/api/partner/jucy/v3/sites/route";
import {getJucyTripAvailability} from "@/app/[locale]/api/partner/jucy/v3/trip/availability/route";

// Helper function to format time strings
const formatTime = (time: string) => {
  if (!time || time === '0000') return null;
  const hours = time.substring(0, 2);
  const minutes = time.substring(2, 4);
  return `${hours}:${minutes}`;
};

// Helper function to map service hours
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

// Helper function to map default times
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

// Helper to upsert provider
async function upsertProvider(connection: Connection, brandName: string, changesApplied: string[]): Promise<number> {
  let providerId: number | null = null;
  const existingProviders = await getAllProviders(connection);
  const existingProvider = existingProviders.find(p => p.company_name?.toLowerCase() === brandName.toLowerCase());

  if (existingProvider) {
    providerId = existingProvider.id;
  } else {
    const newProviderData = {
      company_name: brandName,
      ext_id: brandName.toLowerCase(),
      is_active: true,
      website: `https://www.${brandName.toLowerCase()}.com`,
      logo: `https://www.${brandName.toLowerCase()}.com/favicon.ico`,
    };
    const insertFields = Object.keys(newProviderData).map(key => `\`${key}\``).join(', ');
    const insertValues = Object.values(newProviderData);
    const placeholders = Array(insertValues.length).fill('?').join(', ');
    const [result] = await connection.execute(`INSERT INTO providers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
    providerId = result.insertId;
    changesApplied.push(`Created new provider: ${brandName} (Internal ID: ${providerId})`);
  }
  if (!providerId) {
    throw new Error(`Failed to create or find provider: ${brandName}`);
  }
  return providerId;
}

// Helper to upsert station
async function upsertStation(connection: Connection, jucySite: JucySite, jucyProviderId: number, changesApplied: string[]) {
  const hasNonCarFleet = jucySite.siteSettings.some(setting => setting.fleetTypeSlug !== 'car');
  if (!hasNonCarFleet && jucySite.siteSettings.length > 0) {
    changesApplied.push(`Skipping Jucy site ${jucySite.name} (ID: ${jucySite.id}) - only contains 'car' fleetTypeSlug.`);
    return;
  }

  const stationData: Partial<Station> = {
    ext_id: jucySite.id,
    provider_id: jucyProviderId,
    rental_company_id: jucySite.businessUnit,
    active: true,
    name: jucySite.name,
    iata: jucySite.siteCode || null,
    country_code: jucySite.countryCode || null,
    country: jucySite.country || null,
    city: jucySite.address1.city || null,
    administrative_area_level_2: jucySite.address1.state || null,
    administrative_area_level_1: jucySite.address1.state || null,
    postal_code: jucySite.address1.postCode || null,
    street: jucySite.address1.line1 || null,
    street_number: null,
    address: [
      jucySite.address1.line1,
      jucySite.address1.city,
      jucySite.address1.postCode,
      jucySite.address1.country,
    ].filter(Boolean).join(', ') || null,
    description: null,
    lat: jucySite.geoLocation.lat || null,
    lng: jucySite.geoLocation.lng || null,
    phone_number: jucySite.phone || null,
    fax_number: null,
    hotline_number: jucySite.reservationsPhone || null,
    weekday_open_monday: jucySite.siteSettings[0]?.serviceHours?.monday?.open !== '0000',
    weekday_open_tuesday: jucySite.siteSettings[0]?.serviceHours?.tuesday?.open !== '0000',
    weekday_open_wednesday: jucySite.siteSettings[0]?.serviceHours?.wednesday?.open !== '0000',
    weekday_open_thursday: jucySite.siteSettings[0]?.serviceHours?.thursday?.open !== '0000',
    weekday_open_friday: jucySite.siteSettings[0]?.serviceHours?.friday?.open !== '0000',
    weekday_open_saturday: jucySite.siteSettings[0]?.serviceHours?.saturday?.open !== '0000',
    weekday_open_sunday: jucySite.siteSettings[0]?.serviceHours?.sunday?.open !== '0000',
    weekday_open_holiday: false,
    weekday_text_monday: null,
    weekday_text_tuesday: null,
    weekday_text_wednesday: null,
    weekday_text_thursday: null,
    weekday_text_friday: null,
    weekday_text_saturday: null,
    weekday_text_sunday: null,
    weekday_text_holiday: null,
    weekday_text_info: null,
    image: null,
    vehiclecount: null,
    email: null,
    payment_options: null,
    opening_hours: JSON.stringify(mapServiceHours(jucySite.siteSettings[0]?.serviceHours as unknown as Record<string, DayHours>)),
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

  let internalStationId = await getInternalIdByExternalIdAndPartner(connection, 'jucy', 'station', jucySite.id);

  if (internalStationId) {
    const updateFields = Object.keys(stationData).map(key => `\`${key}\` = ?`).join(', ');
    const updateValues = Object.values(stationData).map(value => value === undefined ? null : value);
    await connection.execute(`UPDATE stations SET ${updateFields} WHERE id = ?`, [...updateValues, internalStationId]);
    changesApplied.push(`Updated station: ${jucySite.name} (External ID: ${jucySite.id}, Internal ID: ${internalStationId})`);
  } else {
    const insertFields = Object.keys(stationData).map(key => `\`${key}\``).join(', ');
    const insertValues = Object.values(stationData).map(value => value === undefined ? null : value);
    const placeholders = Array(insertValues.length).fill('?').join(', ');
    const [result] = await connection.execute(`INSERT INTO stations (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
    internalStationId = result.insertId;
    await createPartnerMapping(connection, 'jucy', 'station', internalStationId, jucySite.id);
    changesApplied.push(`Inserted new station: ${jucySite.name} (External ID: ${jucySite.id}, Internal ID: ${internalStationId})`);
  }

  // Make availability calls for "motorhome" and "campervan"
  const fleetTypes = ['motorhome', 'campervan'];
  for (const fleetType of fleetTypes) {
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    const formattedPickUpDate = today.toISOString().split('.')[0];
    const formattedDropOffDate = twoWeeksLater.toISOString().split('.')[0];

    try {
      const availabilityResponse: JucyTripAvailabilityResponse = await getJucyTripAvailability({pickUpLocation: jucySite.siteCode, dropOffLocation: jucySite.siteCode, pickUpDate: encodeURIComponent(formattedPickUpDate), dropOffDate: encodeURIComponent(formattedDropOffDate), fleetTypeCode:fleetType});
      if (availabilityResponse.availability) {
        const availabilityData: JucyTripAvailability = availabilityResponse.availability;
        const isAvailable = availabilityData.fleetCategories.some(fc => fc.availability === 'FreeSell');
        changesApplied.push(`Availability for ${fleetType} at ${jucySite.name} (${jucySite.siteCode}) on ${formattedPickUpDate} to ${formattedDropOffDate}: ${isAvailable ? 'Available' : 'Not Available'}`);
      } else {
        changesApplied.push(`Availability API error for ${fleetType} at ${jucySite.name} (${jucySite.siteCode}): ${availabilityResponse.error || 'No availability data returned'}`);
      }
    } catch (apiError) {
      changesApplied.push(`Error calling Availability API for ${fleetType} at ${jucySite.name} (${jucySite.siteCode}): ${(apiError as Error).message}`);
    }
  }
  return internalStationId;
}

// Helper to upsert camper
async function upsertCamper(connection: Connection, jucyProduct: JucyProduct, jucyProviderId: number, stationId: number | null, changesApplied: string[]) {
  if (jucyProduct.fleetTypeSlug === 'car') {
    changesApplied.push(`Skipping Jucy product ${jucyProduct.name} (ID: ${jucyProduct.id}) - fleetTypeSlug is 'car'.`);
    return;
  }

  let floorplanDayUrl: string | null = null;
  let floorplanNightUrl: string | null = null;

  for (const floorPlan of jucyProduct.floorPlans) {
    const lowerCaseName = floorPlan.name.toLowerCase();
    if (lowerCaseName.includes('day')) {
      floorplanDayUrl = floorPlan.url;
    } else if (lowerCaseName.includes('night')) {
      floorplanNightUrl = floorPlan.url;
    }
    if (floorplanDayUrl && floorplanNightUrl) {
      break;
    }
  }

  const camperData: Partial<Camper> = {
    ext_id: jucyProduct.id,
    provider_id: jucyProviderId,
    station_id: stationId,
    active: true,
    name: jucyProduct.name,
    description: jucyProduct.description,
    sleeps_adults: jucyProduct.sleepCount,
    max_adults: jucyProduct.maxOccupants,
    passengers_seats: jucyProduct.seatCount,
    transmission_automatic: jucyProduct.transmission.toLowerCase() === 'automatic',
    dimension_length_max: parseFloat(jucyProduct.length) || null,
    dimension_width_max: parseFloat(jucyProduct.width) || null,
    dimension_height_max: parseFloat(jucyProduct.weight) || null,
    rating: null,
    run_of_fleet: false,
    variant: jucyProduct.fleetType,
    variant_id: jucyProduct.fleetTypeId,
    mood1: jucyProduct.scenicImage,
    mood2: jucyProduct.studioImage,
    mood3: jucyProduct.emailImage,
    floorplan_day: floorplanDayUrl,
    floorplan_night: floorplanNightUrl,
  };

  let internalCamperId = await getInternalIdByExternalIdAndPartner(connection, 'jucy', 'camper', jucyProduct.id);

  if (internalCamperId) {
    const updateFields = Object.keys(camperData).map(key => `\`${key}\` = ?`).join(', ');
    const updateValues = Object.values(camperData).map(value => value === undefined ? null : value);
    await connection.execute(`UPDATE campers SET ${updateFields} WHERE id = ?`, [...updateValues, internalCamperId]);
    changesApplied.push(`Updated camper: ${jucyProduct.name} (External ID: ${jucyProduct.id}, Internal ID: ${internalCamperId})`);
  } else {
    const insertFields = Object.keys(camperData).map(key => `\`${key}\``).join(', ');
    const insertValues = Object.values(camperData).map(value => value === undefined ? null : value);
    const placeholders = Array(insertValues.length).fill('?').join(', ');
    const [result] = await connection.execute(`INSERT INTO campers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
    internalCamperId = result.insertId;
    await createPartnerMapping(connection, 'jucy', 'camper', internalCamperId, jucyProduct.id);
    changesApplied.push(`Inserted new camper: ${jucyProduct.name} (External ID: ${jucyProduct.id}, Internal ID: ${internalCamperId})`);
  }

  // Process gallery images
  if (internalCamperId && jucyProduct.gallery && jucyProduct.gallery.length > 0) {
    for (const galleryItem of jucyProduct.gallery) {
      const category = 'gallery'; // Default category for gallery images
      const imageUrl = galleryItem.original;
      try {
        const imageId = await upsertImage(connection, imageUrl);
        await linkCamperImage(connection, internalCamperId, imageId, category);
        changesApplied.push(`Processed image for camper ${jucyProduct.name}: ${imageUrl} (Category: ${category})`);
      } catch (error) {
        changesApplied.push(`Failed to process image ${galleryItem.original} for camper ${jucyProduct.name}: ${(error as Error).message}`);
        console.error(`Failed to process image ${galleryItem.original}:`, error);
      }
    }
  }
}

export async function POST() {
  let connection: Connection | undefined;
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // 1. Fetch Jucy Products (Campers)
    const jucyData: JucyRentalCatalogResponse = await getJucyRentalCatalog({});
    if (!jucyData.products || jucyData.error) {
      throw new Error(`Failed to fetch data from Jucy Rental Catalog API: ${jucyData.error}`);
    }
    const jucyProducts: JucyProduct[] = jucyData.products;
    changesApplied.push(`Fetched ${jucyProducts.length} Jucy products.`);

    // 2. Derive and Upsert Provider
    const jucyProviderId = await upsertProvider(connection, 'Jucy', changesApplied);

    // 3. Fetch Jucy Sites (Stations)
    const sitesResponse = await getJucySites({});
    if (sitesResponse.error) {
      throw new Error(`Failed to fetch Jucy sites: ${sitesResponse.error}`);
    }
    const jucySites: JucySite[] = sitesResponse.sites;
    changesApplied.push(`Fetched ${jucySites.length} Jucy sites.`);

    // 4. Process Stations
    const stationIdMap = new Map<string, number>();
    for (const jucySite of jucySites) {
      const internalStationId = await upsertStation(connection, jucySite, jucyProviderId, changesApplied);
      if (internalStationId) {
        stationIdMap.set(jucySite.id, internalStationId);
      }
    }

    // 5. Process Campers
    for (const jucyProduct of jucyProducts) {
      // Find a corresponding station based on region or a default logic
      // This logic needs to be more robust, for now, a simple lookup
      let stationId: number | null = null;
      const matchingSite = jucySites.find(site => site.countryCode.toLowerCase() === jucyProduct.region.toLowerCase());
      if (matchingSite) {
        stationId = stationIdMap.get(matchingSite.id) || null;
      }
      
      await upsertCamper(connection, jucyProduct, jucyProviderId, stationId, changesApplied);
    }

    return NextResponse.json({ message: 'Jucy unified import successful', changes: changesApplied }, { status: 200 });
  } catch (error) {
    console.error('Jucy unified import failed:', error);
    return NextResponse.json({ message: 'Jucy unified import failed', error: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
