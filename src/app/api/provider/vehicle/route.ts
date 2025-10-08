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
    const vehicleData = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as any).provider_id;

    const {
      name, description, sleeps_adults, sleeps_children, max_adults, max_children,
      passengers_seats, passengers_seats_isofix, dimension_length_min, dimension_height_min,
      dimension_width_min, transmission_automatic, awning, air_condition_driving_cabin,
      air_condition_living_area, shower_wc, tank_freshwater, tank_wastewater1, fridge,
      navigation, consumption, four_wd, rear_cam, tv, addons
    } = vehicleData;

    const [camperResult] = await connection.execute(
      `INSERT INTO campers (provider_id, name, description, sleeps_adults, sleeps_children, max_adults, max_children, passengers_seats, passengers_seats_isofix, dimension_length_min, dimension_height_min, dimension_width_min, transmission_automatic, awning, air_condition_driving_cabin, air_condition_living_area, shower_wc, tank_freshwater, tank_wastewater1, fridge, navigation, consumption, four_wd, rear_cam, tv)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        providerId, name || null, description || null, sleeps_adults || null, sleeps_children || null, max_adults || null, max_children || null,
        passengers_seats || null, passengers_seats_isofix || null, dimension_length_min || null, dimension_height_min || null,
        dimension_width_min || null, transmission_automatic || null, awning || null, air_condition_driving_cabin || null,
        air_condition_living_area || null, shower_wc || null, tank_freshwater || null, tank_wastewater1 || null, fridge || null,
        navigation || null, consumption || null, four_wd || null, rear_cam || null, tv || null
      ]
    );
    const camperId = (camperResult as any).insertId;

    if (addons && Array.isArray(addons)) {
      for (const addon of addons) {
        let addonId;
        const [existingAddons] = await connection.execute('SELECT id FROM addons WHERE name = ?', [addon.name]);
        if (Array.isArray(existingAddons) && existingAddons.length > 0) {
          addonId = (existingAddons[0] as any).id;
        } else {
          const [addonResult] = await connection.execute('INSERT INTO addons (name) VALUES (?)', [addon.name]);
          addonId = (addonResult as any).insertId;
        }
        await connection.execute('INSERT INTO camper_addons (camper_id, addon_id) VALUES (?, ?)', [camperId, addonId]);
      }
    }

    await connection.commit();
    return NextResponse.json({ message: 'Vehicle saved successfully', id: camperId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
