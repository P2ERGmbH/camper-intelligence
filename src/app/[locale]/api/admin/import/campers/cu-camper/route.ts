import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { processCuCamperCamper } from '@/lib/import/cuCamper';

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

const CU_CAMPER_API_URL = `${CU_CAMPER_BASE_URL}?run=VehiclesApi&active=1&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;

interface ProviderMapping {
  id: number;
  ext_id: string;
}


export async function POST() {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser || authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const userId = authenticatedUser.id;
  const origin = 'cu-camper-import';

  let connection;
  try {
    const response = await fetch(CU_CAMPER_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from CU Camper API: ${response.statusText}`);
    }
    const externalCampers = await response.json();

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // Fetch all providers to map rental_company_id to provider_id
    const [providerRows] = await connection.execute('SELECT id, ext_id FROM providers');
    const providerMap = new Map<string, number>();
    (providerRows as ProviderMapping[]).forEach(p => {
      if (p.ext_id) {
        providerMap.set(p.ext_id, p.id);
      }
    });

    for (const extCamper of externalCampers) {
      await processCuCamperCamper(connection, extCamper, providerMap, userId, origin, changesApplied);
    }

    return NextResponse.json({ message: 'CU Camper campers imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing CU Camper campers:', error);
    return NextResponse.json({ error: 'Failed to import CU Camper campers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
