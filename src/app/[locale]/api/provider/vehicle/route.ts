import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Camper } from '@/types/camper';
import { createDbConnection } from '@/lib/db/utils';

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('session');
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
    const vehicleData: Partial<Camper> = await req.json();
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
        providerId, vehicleData.name || null, vehicleData.description || null, vehicleData.sleeps_adults || null, vehicleData.sleeps_children || null, vehicleData.max_adults || null, vehicleData.max_children || null,
        vehicleData.passengers_seats || null, vehicleData.passengers_seats_isofix || null, vehicleData.dimension_length_min || null, vehicleData.dimension_height_min || null,
        vehicleData.dimension_width_min || null, vehicleData.transmission_automatic || null, vehicleData.awning || null, vehicleData.air_condition_driving_cabin || null,
        vehicleData.air_condition_living_area || null, vehicleData.shower_wc || null, vehicleData.tank_freshwater || null, vehicleData.tank_wastewater1 || null, vehicleData.fridge || null,
        vehicleData.navigation || null, vehicleData.consumption || null, vehicleData.four_wd || null, vehicleData.rear_cam || null, vehicleData.tv || null
      ]
    );
    const camperId = (camperResult as { insertId: number }).insertId;

    if (vehicleData.addons && Array.isArray(vehicleData.addons)) {
      for (const addon of vehicleData.addons) {
        let addonId;
        const [existingAddons] = await connection.execute('SELECT id FROM addons WHERE name = ?', [addon.name]);
        if (Array.isArray(existingAddons) && existingAddons.length > 0) {
          addonId = (existingAddons[0] as { id: number }).id;
        } else {
          const [addonResult] = await connection.execute('INSERT INTO addons (name) VALUES (?)', [addon.name]);
          addonId = (addonResult as { insertId: number }).insertId;
        }
        await connection.execute('INSERT INTO camper_addons (camper_id, addon_id) VALUES (?, ?)', [camperId, addonId]);
      }
    }

    await connection.commit();
    return NextResponse.json({ message: 'Vehicle saved successfully', id: camperId }, { status: 201 });
  } catch (error: unknown) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
