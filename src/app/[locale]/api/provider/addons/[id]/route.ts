import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
  } catch (error: unknown) {
    console.error(error);
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const params = await context.params;
  const { id } = params;
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT * FROM addons WHERE id = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      return NextResponse.json({ error: 'Addon not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const params = await context.params;
  const { id } = params;
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const { name, description, price_per_unit, max_quantity } = await req.json();

    if (!name || !price_per_unit) {
      return NextResponse.json({ error: 'Missing required fields: name, price_per_unit' }, { status: 400 });
    }

    const [result] = await connection.execute(
      'UPDATE addons SET name = ?, description = ?, price_per_unit = ?, max_quantity = ? WHERE id = ?',
      [name, description, price_per_unit, max_quantity, id]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ error: 'Addon not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Addon updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const params = await context.params;
  const { id } = params;
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [result] = await connection.execute('DELETE FROM addons WHERE id = ?', [id]);

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ error: 'Addon not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Addon deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
