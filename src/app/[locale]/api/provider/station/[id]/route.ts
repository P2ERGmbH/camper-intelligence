import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Station } from '@/types/station';
import { getStationFromDb, updateStationInDb } from '@/lib/db/stations';
import { createDbConnection } from '@/lib/db/utils';

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token) return null;
  let connection: mysql.Connection | undefined;
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret') as JwtPayload;
    if (!decoded || !decoded.id) return null;

    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);

    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as { id: number; email: string; role: string }) : null;
  } catch {
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const station = await getStationFromDb(connection, id);
    if (station) {
      return NextResponse.json(station, { status: 200 });
    }
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const stationData: Partial<Station> = await req.json();
    const success = await updateStationInDb(connection, id, stationData);

    if (success) {
      return NextResponse.json({ message: 'Station updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Station not found or no changes made' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
