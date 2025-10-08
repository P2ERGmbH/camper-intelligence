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

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);
    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({ error: 'No provider associated with this user' }, { status: 403 });
    }
    const providerId = (providerLink[0] as any).provider_id;

    const [stations] = await connection.execute('SELECT * FROM stations WHERE provider_id = ?', [providerId]);
    
    await connection.end();
    return NextResponse.json(stations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
