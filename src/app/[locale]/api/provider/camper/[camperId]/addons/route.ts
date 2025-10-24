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

export async function GET(req: NextRequest, { params }: { params: Promise<{ camperId: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const {camperId} =  await params;
  if (!camperId) {
    return NextResponse.json({ error: 'Camper ID is required' }, { status: 400 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute(
      'SELECT a.* FROM addons a JOIN camper_addons ca ON a.id = ca.addon_id WHERE ca.camper_id = ?',
      [camperId]
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ camperId: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const params = await context.params;
  const { camperId } = params;
  const { addonId } = await req.json();

  if (!addonId) {
    return NextResponse.json({ error: 'Missing addonId' }, { status: 400 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    // Check if the addon already exists for the camper
    const [existing] = await connection.execute(
        'SELECT * FROM camper_addons WHERE camper_id = ? AND addon_id = ?',
        [camperId, addonId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ message: 'Addon already associated with this camper' }, { status: 200 });
    }

    await connection.execute(
      'INSERT INTO camper_addons (camper_id, addon_id) VALUES (?, ?)',
      [camperId, addonId]
    );
    return NextResponse.json({ message: 'Addon associated successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ camperId: string }> }) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'provider') {
    return NextResponse.json({ error: 'Not authenticated or authorized' }, { status: 401 });
  }

  const params = await context.params;
  const { camperId } = params;
  const { addonId } = await req.json();

  if (!addonId) {
    return NextResponse.json({ error: 'Missing addonId' }, { status: 400 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [result] = await connection.execute(
      'DELETE FROM camper_addons WHERE camper_id = ? AND addon_id = ?',
      [camperId, addonId]
    );

    if ((result as { affectedRows: number }).affectedRows === 0) {
      return NextResponse.json({ error: 'Addon not found for this camper' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Addon disassociated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
