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

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);

    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      await connection.end();
      return NextResponse.json({}, { status: 200 }); // No provider linked, return empty object
    }

    const providerId = (providerLink[0] as any).provider_id;
    const [rows] = await connection.execute('SELECT company_name, address, tax_id FROM providers WHERE id = ?', [providerId]);
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0], { status: 200 });
    }
    return NextResponse.json({}, { status: 200 }); // Provider linked but not found, return empty
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    const { company_name, address, tax_id } = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);

    if (Array.isArray(providerLink) && providerLink.length > 0) {
      // User is linked to a provider, update it
      const providerId = (providerLink[0] as any).provider_id;
      await connection.execute(
        'UPDATE providers SET company_name = ?, address = ?, tax_id = ? WHERE id = ?',
        [company_name, address, tax_id, providerId]
      );
    } else {
      // No provider linked, create a new one and link it
      const [providerResult] = await connection.execute(
        'INSERT INTO providers (company_name, address, tax_id) VALUES (?, ?, ?)',
        [company_name, address, tax_id]
      );
      const providerId = (providerResult as any).insertId;
      await connection.execute(
        'INSERT INTO provider_users (user_id, provider_id) VALUES (?, ?)',
        [user.id, providerId]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Legal information updated successfully' }, { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
