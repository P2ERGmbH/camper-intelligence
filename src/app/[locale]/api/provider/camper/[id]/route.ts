import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { Camper } from '@/types/camper';
import { User } from '@/types/user';
import { createDbConnection } from '@/lib/db/utils';
import { getCamperFromDb } from '@/lib/db/campers';

async function getUserFromToken(req: NextRequest): Promise<User | null> {
  const token = req.cookies.get('session');
  if (!token) return null;
  let connection: mysql.Connection | undefined;
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret') as User;
    if (!decoded || !decoded.id) return null;

    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);

    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch {
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  const { id } = await params;
  try {
    connection = await createDbConnection();
    const camper = await getCamperFromDb(connection, id);

    if (camper) {
      return NextResponse.json(camper, { status: 200 });
    }
    return NextResponse.json({ error: 'Camper not found' }, { status: 404 });
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

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const camperData: Partial<Camper> = await req.json();
    
    await connection.execute(
      `UPDATE campers SET 
        name = ?, description = ?, sleeps_adults = ?, sleeps_children = ?, max_adults = ?, max_children = ?,
        passengers_seats = ?, passengers_seats_isofix = ?, dimension_length_min = ?, dimension_height_min = ?,
        dimension_width_min = ?, transmission_automatic = ?, awning = ?, air_condition_driving_cabin = ?,
        air_condition_living_area = ?, shower_wc = ?, tank_freshwater = ?, tank_wastewater1 = ?, fridge = ?,
        navigation = ?, consumption = ?, four_wd = ?, rear_cam = ?, tv = ?
      WHERE id = ?`,
      [
        camperData.name || null, camperData.description || null, camperData.sleeps_adults || null, camperData.sleeps_children || null, camperData.max_adults || null, camperData.max_children || null,
        camperData.passengers_seats || null, camperData.passengers_seats_isofix || null, camperData.dimension_length_min || null, camperData.dimension_height_min || null,
        camperData.dimension_width_min || null, camperData.transmission_automatic || null, camperData.awning || null, camperData.air_condition_driving_cabin || null,
        camperData.air_condition_living_area || null, camperData.shower_wc || null, camperData.tank_freshwater || null, camperData.tank_wastewater1 || null, camperData.fridge || null,
        camperData.navigation || null, camperData.consumption || null, camperData.four_wd || null, camperData.rear_cam || null, camperData.tv || null,
        params.id
      ]
    );

    return NextResponse.json({ message: 'Camper updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
