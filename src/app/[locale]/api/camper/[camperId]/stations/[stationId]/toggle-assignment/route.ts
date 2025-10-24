import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateCamperStation } from '@/lib/db/campers';

export async function POST(req: NextRequest, context: { params: Promise<{ locale: string; camperId: string; stationId: string; }> }) {
  const { camperId, stationId } = await context.params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const parsedCamperId = parseInt(camperId);
  const parsedStationId = parseInt(stationId);
  if (isNaN(parsedCamperId) || isNaN(parsedStationId)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  let connection;
  try {
    const { assign } = await req.json();
    connection = await createDbConnection();

    await updateCamperStation(connection, parsedCamperId, assign ? parsedStationId : null);

    return NextResponse.json({ message: 'Camper station assignment updated successfully.' });
  } catch (error) {
    console.error('Error updating camper station assignment:', error);
    return NextResponse.json({ error: 'Failed to update camper station assignment.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
