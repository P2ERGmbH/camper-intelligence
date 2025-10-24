import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest, context: { params: Promise<{ locale: string; stationId: string; }> }) {
  const { stationId } = await context.params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedStationId = parseInt(stationId);
  if (isNaN(parsedStationId)) {
    return NextResponse.json({ error: 'Invalid Station ID' }, { status: 400 });
  }

  let connection;
  try {
    const { isActive } = await req.json();
    connection = await createDbConnection();

    await connection.execute(
      'UPDATE stations SET active = ? WHERE id = ?',
      [isActive, parsedStationId]
    );

    return NextResponse.json({ message: 'Station active status updated successfully.' });
  } catch (error) {
    console.error('Error toggling station active status:', error);
    return NextResponse.json({ error: 'Failed to update station active status.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
