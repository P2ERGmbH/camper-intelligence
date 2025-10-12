import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getStations } from '@/lib/db/stations';

// This comment is added to force recompilation and clear potential caching issues.


export async function GET() {
  let connection;
  try {
    connection = await createDbConnection();
    const stations = await getStations(connection);
    return NextResponse.json(stations);
  } catch (error: unknown) {
    console.error('Error fetching stations:', error);
    let errorMessage = 'Failed to fetch stations.';
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
