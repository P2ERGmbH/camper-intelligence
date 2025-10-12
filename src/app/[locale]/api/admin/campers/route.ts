import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';

export async function GET() {
  let connection;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT * FROM campers');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API Error: Error fetching campers:', error);
    return NextResponse.json({ error: 'Failed to fetch campers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
