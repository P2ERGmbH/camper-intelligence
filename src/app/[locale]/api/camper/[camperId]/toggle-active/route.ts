import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest, context: { params: Promise<{ locale: string; camperId: string; }> }) {
  const { camperId } = await context.params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedCamperId = parseInt(camperId);
  if (isNaN(parsedCamperId)) {
    return NextResponse.json({ error: 'Invalid Camper ID' }, { status: 400 });
  }

  let connection;
  try {
    const { isActive } = await req.json();
    connection = await createDbConnection();

    await connection.execute(
      'UPDATE campers SET active = ? WHERE id = ?',
      [isActive, parsedCamperId]
    );

    return NextResponse.json({ message: 'Camper active status updated successfully.' });
  } catch (error) {
    console.error('Error toggling camper active status:', error);
    return NextResponse.json({ error: 'Failed to update camper active status.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
