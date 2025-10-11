import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';
import { Camper } from '@/types/camper';
import { createDbConnection } from '@/lib/db/utils';
import { getImagesForCamperFromDb } from '@/lib/db/images';

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

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const camperData: Partial<Camper> = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as { provider_id: number }).provider_id;

    const [camperResult] = await connection.execute(
      `INSERT INTO campers (provider_id, name, description, sleeps_adults, sleeps_children, max_adults, max_children, passengers_seats, passengers_seats_isofix, dimension_length_min, dimension_height_min, dimension_width_min, transmission_automatic, awning, air_condition_driving_cabin, air_condition_living_area, shower_wc, tank_freshwater, tank_wastewater1, fridge, navigation, consumption, four_wd, rear_cam, tv)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        providerId, camperData.name || null, camperData.description || null, camperData.sleeps_adults || null, camperData.sleeps_children || null, camperData.max_adults || null, camperData.max_children || null,
        camperData.passengers_seats || null, camperData.passengers_seats_isofix || null, camperData.dimension_length_min || null, camperData.dimension_height_min || null,
        camperData.dimension_width_min || null, camperData.transmission_automatic || null, camperData.awning || null, camperData.air_condition_driving_cabin || null,
        camperData.air_condition_living_area || null, camperData.shower_wc || null, camperData.tank_freshwater || null, camperData.tank_wastewater1 || null, camperData.fridge || null,
        camperData.navigation || null, camperData.consumption || null, camperData.four_wd || null, camperData.rear_cam || null, camperData.tv || null
      ]
    );
    const camperId = (camperResult as { insertId: number }).insertId;

    await connection.commit();
    return NextResponse.json({ message: 'Camper saved successfully', id: camperId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection && connection.end) {
        await connection.end();
    }
  }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as { provider_id: number }).provider_id;

    const [campersRows] = await connection.execute('SELECT * FROM campers WHERE provider_id = ?', [providerId]);
    const campers = campersRows as Camper[];

    const campersWithImages = await Promise.all(campers.map(async (camper) => {
      const images = await getImagesForCamperFromDb(connection, camper.id.toString());
      return { ...camper, images };
    }));
    
    return NextResponse.json(campersWithImages, { status: 200 });
    } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) {
        await connection.end();
    }
  }
}
