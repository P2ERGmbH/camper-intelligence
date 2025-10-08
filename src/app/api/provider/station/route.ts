import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('session');
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret');
    if (!decoded || !decoded.id) return null;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);
    await connection.end();

    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    const stationData = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as any).provider_id;

    const {
      name,
      address,
      station_phone_number,
      station_email,
      payment_options,
      station_opening_hours,
      distance_motorway_km,
      distance_airport_km,
      distance_train_station_km,
      distance_bus_stop_km,
      parking_info,
      shopping_info,
      fuel_station_info,
      guest_toilet,
      lounge_area,
      greywater_disposal_info,
      pickup_hours,
      return_hours,
    } = stationData;

    const [stationResult] = await connection.execute(
      'INSERT INTO stations (provider_id, name, address, phone_number, email, payment_options, opening_hours, distance_motorway_km, distance_airport_km, distance_train_station_km, distance_bus_stop_km, parking_info, shopping_info, fuel_station_info, guest_toilet, lounge_area, greywater_disposal_info, pickup_hours, return_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        providerId,
        name || null,
        address || null,
        station_phone_number || null,
        station_email || null,
        payment_options || null,
        station_opening_hours || null,
        distance_motorway_km || null,
        distance_airport_km || null,
        distance_train_station_km || null,
        distance_bus_stop_km || null,
        parking_info || null,
        shopping_info || null,
        fuel_station_info || null,
        guest_toilet || null,
        lounge_area || null,
        greywater_disposal_info || null,
        pickup_hours || null,
        return_hours || null,
      ]
    );

    await connection.commit();
    return NextResponse.json({ message: 'Station saved successfully', id: (stationResult as any).insertId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
