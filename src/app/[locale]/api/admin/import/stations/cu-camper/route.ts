import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { createStation, updateStation } from '@/lib/db/stations';
import { getAllProviders } from '@/lib/db/providers';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { upsertImage, linkStationImage } from '@/lib/db/images';
import { getCuCamperImageUrl, fetchCuCamperImageMetadata } from '@/lib/utils/image';
import { Station } from '@/types/station';
import { Provider } from '@/types/provider'; // eslint-disable-line @typescript-eslint/no-unused-vars

interface CuStation {
  id: string;
  rental_company_id: string;
  active: string; // "true" or "false"
  name: string;
  iata: string;
  country_code: string;
  country: string;
  city: string;
  administrative_area_level_2: string;
  administrative_area_level_1: string;
  postal_code: string;
  street: string;
  street_number: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  phone_number: string;
  fax_number: string;
  hotline_number: string;
  weekday_open_monday: string; // "true" or "false"
  weekday_open_tuesday: string;
  weekday_open_wednesday: string;
  weekday_open_thursday: string;
  weekday_open_friday: string;
  weekday_open_saturday: string;
  weekday_open_sunday: string;
  weekday_open_holiday: string;
  weekday_text_monday: string;
  weekday_text_tuesday: string;
  weekday_text_wednesday: string;
  weekday_text_thursday: string;
  weekday_text_friday: string;
  weekday_text_saturday: string;
  weekday_text_sunday: string;
  weekday_text_holiday: string;
  weekday_text_info: string;
  image: string;
  vehiclecount: number;
}

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

const CU_CAMPER_STATIONS_API_URL = `${CU_CAMPER_BASE_URL}?run=RentalCompanyStationsApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;

export async function POST() {
  let connection;
  try {
    const response = await fetch(CU_CAMPER_STATIONS_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch stations from CU Camper API: ${response.statusText}`);
    }
    const cuStations: CuStation[] = await response.json();

    connection = await createDbConnection();

    const providers = await getAllProviders(connection);
    const providerMap = new Map<string, number>();
    providers.forEach(provider => {
      if (provider.ext_id) {
        providerMap.set(provider.ext_id, provider.id);
      }
    });

    const changes: string[] = [];

    for (const cuStation of cuStations) {
      const providerId = providerMap.get(cuStation.rental_company_id);

      if (providerId === undefined) {
        changes.push(`Skipping station ${cuStation.id} - Provider with rental_company_id ${cuStation.rental_company_id} not found.`);
        continue;
      }

      const stationData: Omit<Station, 'id' | 'created_at' | 'updated_at'> = {
        ext_id: cuStation.id,
        provider_id: providerId,
        rental_company_id: cuStation.rental_company_id,
        active: cuStation.active === 'true',
        name: cuStation.name || cuStation.id,
        iata: cuStation.iata || null,
        country_code: cuStation.country_code || null,
        country: cuStation.country || null,
        city: cuStation.city || null,
        administrative_area_level_2: cuStation.administrative_area_level_2 || null,
        administrative_area_level_1: cuStation.administrative_area_level_1 || null,
        postal_code: cuStation.postal_code || null,
        street: cuStation.street || null,
        street_number: cuStation.street_number || null,
        // address: [
        //   cuStation.street,
        //   cuStation.street_number,
        //   cuStation.postal_code,
        //   cuStation.city,
        //   cuStation.country,
        // ].filter(Boolean).join(', ') || null,
        description: cuStation.description || null,
        lat: cuStation.lat || null,
        lng: cuStation.lng || null,
        phone_number: cuStation.phone_number || null,
        fax_number: cuStation.fax_number || null,
        hotline_number: cuStation.hotline_number || null,
        weekday_open_monday: cuStation.weekday_open_monday === 'true',
        weekday_open_tuesday: cuStation.weekday_open_tuesday === 'true',
        weekday_open_wednesday: cuStation.weekday_open_wednesday === 'true',
        weekday_open_thursday: cuStation.weekday_open_thursday === 'true',
        weekday_open_friday: cuStation.weekday_open_friday === 'true',
        weekday_open_saturday: cuStation.weekday_open_saturday === 'true',
        weekday_open_sunday: cuStation.weekday_open_sunday === 'true',
        weekday_open_holiday: cuStation.weekday_open_holiday === 'true',
        weekday_text_monday: cuStation.weekday_text_monday || null,
        weekday_text_tuesday: cuStation.weekday_text_tuesday || null,
        weekday_text_wednesday: cuStation.weekday_text_wednesday || null,
        weekday_text_thursday: cuStation.weekday_text_thursday || null,
        weekday_text_friday: cuStation.weekday_text_friday || null,
        weekday_text_saturday: cuStation.weekday_text_saturday || null,
        weekday_text_sunday: cuStation.weekday_text_sunday || null,
        weekday_text_holiday: cuStation.weekday_text_holiday || null,
        weekday_text_info: cuStation.weekday_text_info || null,
        image: cuStation.image || null,
        vehiclecount: cuStation.vehiclecount || null,
      };

      let internalId = await getInternalIdByExternalIdAndPartner(connection, 'cu-camper', 'station', cuStation.id);

      if (internalId) {
        await updateStation(connection, internalId, stationData);
        changes.push(`Updated station: ${cuStation.name || cuStation.id} (ID: ${cuStation.id}, Internal ID: ${internalId})`);
      } else {
        const newStationId = await createStation(connection, stationData);
        await createPartnerMapping(connection, 'cu-camper', 'station', newStationId, cuStation.id);
        changes.push(`Created station: ${cuStation.name || cuStation.id} (ID: ${cuStation.id}, Internal ID: ${newStationId})`);
        internalId = newStationId;
      }

      // Image processing for station
      if (internalId && cuStation.image) {
        const relativePath = cuStation.image;
        if (typeof relativePath === 'string' && (relativePath.startsWith('cu/camper/') || relativePath.startsWith('allgemein/'))) {
          const imageUrl = getCuCamperImageUrl(relativePath);
          const { caption, alt_text, copyright_holder_name, width, height } = await fetchCuCamperImageMetadata(imageUrl);
          try {
            const imageId = await upsertImage(connection, imageUrl, caption, alt_text, copyright_holder_name, width, height);
            await linkStationImage(connection, internalId, imageId, 'main'); // Assuming 'main' category for station image
            changes.push(`Processed image for station ${cuStation.name || cuStation.id}: ${imageUrl} (Category: main, Caption: ${caption || 'N/A'})`);
          } catch (imageError) {
            console.error(`Failed to process image ${imageUrl} for station ${cuStation.name || cuStation.id}:`, imageError);
            changes.push(`Failed to process image ${imageUrl} for station ${cuStation.name || cuStation.id}: ${(imageError as Error).message}`);
          }
        }
      }
    }

    return NextResponse.json({ message: 'Stations import completed successfully.', changes });
  } catch (error: unknown) {
    console.error('Error importing stations:', error);
    let errorMessage = 'Failed to import stations.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
