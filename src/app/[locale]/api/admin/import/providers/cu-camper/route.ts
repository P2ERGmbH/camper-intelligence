import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { processCuCamperProvider } from '@/lib/import/cuCamper';

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

const CU_CAMPER_API_URL = `${CU_CAMPER_BASE_URL}?run=RentalCompaniesApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;

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
    const externalProviders = await response.json();

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    for (const extProvider of externalProviders) {
      await processCuCamperProvider(connection, extProvider, userId, origin, changesApplied);
    }

    return NextResponse.json({ message: 'CU Camper providers imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing CU Camper providers:', error);
    return NextResponse.json({ error: 'Failed to import CU Camper providers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
