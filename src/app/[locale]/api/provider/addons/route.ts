import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
  } catch (error: unknown) {
    console.error(error);
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
    const { name, description, price_per_unit, max_quantity, category } = await req.json();

    if (!name || !price_per_unit || !category) {
      return NextResponse.json({ error: 'Missing required fields: name, price_per_unit, category' }, { status: 400 });
    }

    const [result] = await connection.execute(
      'INSERT INTO addons (name, description, price_per_unit, max_quantity, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price_per_unit, max_quantity, category]
    );

    const insertId = (result as { insertId: number }).insertId;
    return NextResponse.json({ message: 'Addon created successfully', id: insertId }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT * FROM addons');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
