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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute('SELECT * FROM stations WHERE id = ?', [params.id]);
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0], { status: 200 });
    }
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    const stationData = await req.json();
    const {
      name, address, phone_number, email, payment_options, opening_hours,
      distance_motorway_km, distance_airport_km, distance_train_station_km,
      distance_bus_stop_km, parking_info, shopping_info, fuel_station_info,
      guest_toilet, lounge_area, greywater_disposal_info, pickup_hours, return_hours
    } = stationData;

    await connection.execute(
      `UPDATE stations SET 
        name = ?, address = ?, phone_number = ?, email = ?, payment_options = ?, opening_hours = ?,
        distance_motorway_km = ?, distance_airport_km = ?, distance_train_station_km = ?,
        distance_bus_stop_km = ?, parking_info = ?, shopping_info = ?, fuel_station_info = ?,
        guest_toilet = ?, lounge_area = ?, greywater_disposal_info = ?, pickup_hours = ?, return_hours = ?
      WHERE id = ?`,
      [
        name || null, address || null, phone_number || null, email || null, payment_options || null, opening_hours || null,
        distance_motorway_km || null, distance_airport_km || null, distance_train_station_km || null,
        distance_bus_stop_km || null, parking_info || null, shopping_info || null, fuel_station_info || null,
        guest_toilet || null, lounge_area || null, greywater_disposal_info || null, pickup_hours || null, return_hours || null,
        params.id
      ]
    );

    await connection.end();
    return NextResponse.json({ message: 'Station updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
