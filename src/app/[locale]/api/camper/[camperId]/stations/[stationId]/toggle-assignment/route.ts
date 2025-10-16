import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateCamperStation } from '@/lib/db/campers';

export async function POST(req: NextRequest, { params }: { params: { camperId: string, stationId: string } }) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const camperId = parseInt(params.camperId);
  const stationId = parseInt(params.stationId);
  if (isNaN(camperId) || isNaN(stationId)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  let connection;
  try {
    const { assign } = await req.json();
    connection = await createDbConnection();

    await updateCamperStation(connection, camperId, assign ? stationId : null);

    return NextResponse.json({ message: 'Camper station assignment updated successfully.' });
  } catch (error) {
    console.error('Error updating camper station assignment:', error);
    return NextResponse.json({ error: 'Failed to update camper station assignment.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
