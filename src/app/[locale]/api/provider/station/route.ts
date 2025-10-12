import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Station } from '@/types/station';
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

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const stationData: Partial<Station> = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as { provider_id: number }).provider_id;

    const [stationResult] = await connection.execute(
      'INSERT INTO stations (provider_id, name, address, phone_number, email, payment_options, opening_hours, distance_motorway_km, distance_airport_km, distance_train_station_km, distance_bus_stop_km, parking_info, shopping_info, fuel_station_info, guest_toilet, lounge_area, greywater_disposal_info, pickup_hours, return_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        providerId,
        stationData.name || null,
        stationData.address || null,
        stationData.phone_number || null,
        stationData.email || null,
        stationData.payment_options || null,
        stationData.opening_hours || null,
        stationData.distance_motorway_km || null,
        stationData.distance_airport_km || null,
        stationData.distance_train_station_km || null,
        stationData.distance_bus_stop_km || null,
        stationData.parking_info || null,
        stationData.shopping_info || null,
        stationData.fuel_station_info || null,
        stationData.guest_toilet || null,
        stationData.lounge_area || null,
        stationData.greywater_disposal_info || null,
        stationData.pickup_hours || null,
        stationData.return_hours || null,
      ]
    );

    await connection.commit();
    return NextResponse.json({ message: 'Station saved successfully', id: (stationResult as { insertId: number }).insertId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
