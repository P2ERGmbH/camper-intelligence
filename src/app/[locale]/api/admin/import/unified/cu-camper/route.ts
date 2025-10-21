import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAllProviders } from '@/lib/db/providers';
import { processCuCamperProvider, processCuCamperStation, processCuCamperCamper } from '@/lib/import/cuCamper';

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

const CU_CAMPER_PROVIDERS_API_URL = `${CU_CAMPER_BASE_URL}?run=RentalCompaniesApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;
const CU_CAMPER_STATIONS_API_URL = `${CU_CAMPER_BASE_URL}?run=RentalCompanyStationsApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;
const CU_CAMPER_CAMPERS_API_URL = `${CU_CAMPER_BASE_URL}?run=VehiclesApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;

export async function POST() {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const userId = authenticatedUser.id;
  const origin = 'cu-camper-unified-import';

  let connection;
  try {
    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // 1. Import Providers
    const providersResponse = await fetch(CU_CAMPER_PROVIDERS_API_URL);
    if (!providersResponse.ok) {
      throw new Error(`Failed to fetch providers from CU Camper API: ${providersResponse.statusText}`);
    }
    const externalProviders = await providersResponse.json();
    for (const extProvider of externalProviders) {
      await processCuCamperProvider(connection, extProvider, userId, origin, changesApplied);
    }
    changesApplied.push(`Processed ${externalProviders.length} CU Camper providers.`);

    // Fetch all providers again to ensure the map is up-to-date with newly imported providers
    const allProviders = await getAllProviders(connection);
    const providerMap = new Map<string, number>();
    allProviders.forEach(p => {
      if (p.ext_id) {
        providerMap.set(p.ext_id, p.id);
      }
    });

    // 2. Import Stations
    const stationsResponse = await fetch(CU_CAMPER_STATIONS_API_URL);
    if (!stationsResponse.ok) {
      throw new Error(`Failed to fetch stations from CU Camper API: ${stationsResponse.statusText}`);
    }
    const cuStations = await stationsResponse.json();
    for (const cuStation of cuStations) {
      await processCuCamperStation(connection, cuStation, providerMap, userId, origin, changesApplied);
    }
    changesApplied.push(`Processed ${cuStations.length} CU Camper stations.`);

    // 3. Import Campers
    const campersResponse = await fetch(CU_CAMPER_CAMPERS_API_URL);
    if (!campersResponse.ok) {
      throw new Error(`Failed to fetch campers from CU Camper API: ${campersResponse.statusText}`);
    }
    const externalCampers = await campersResponse.json();
    for (const extCamper of externalCampers) {
      await processCuCamperCamper(connection, extCamper, providerMap, userId, origin, changesApplied);
    }
    changesApplied.push(`Processed ${externalCampers.length} CU Camper campers.`);

    return NextResponse.json({ message: 'CU Camper unified import successful', changes: changesApplied });
  } catch (error) {
    console.error('Error during CU Camper unified import:', error);
    return NextResponse.json({ error: 'Failed to perform CU Camper unified import.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
