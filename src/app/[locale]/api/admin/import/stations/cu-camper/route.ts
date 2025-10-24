import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAllProviders } from '@/lib/db/providers';
import { getAuthenticatedUser } from '@/lib/auth';
import { processCuCamperStation } from '@/lib/import/cuCamper';

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
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const userId = authenticatedUser.id;
  const origin = 'cu-camper-import';

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
      const processedCuStation = {
        ...cuStation,
        active: cuStation.active === 'true',
        weekday_open_monday: cuStation.weekday_open_monday === 'true',
        weekday_open_tuesday: cuStation.weekday_open_tuesday === 'true',
        weekday_open_wednesday: cuStation.weekday_open_wednesday === 'true',
        weekday_open_thursday: cuStation.weekday_open_thursday === 'true',
        weekday_open_friday: cuStation.weekday_open_friday === 'true',
        weekday_open_saturday: cuStation.weekday_open_saturday === 'true',
        weekday_open_sunday: cuStation.weekday_open_sunday === 'true',
        weekday_open_holiday: cuStation.weekday_open_holiday === 'true',
      };
      await processCuCamperStation(connection, processedCuStation, providerMap, userId, origin, changes);
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
