import { getTranslations } from 'next-intl/server';
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
  } catch {
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET(req: NextRequest) {
  const t = await getTranslations('errors');
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: t('not_authenticated') }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);

    if (!Array.isArray(providerLink) || providerLink.length === 0) {
      return NextResponse.json({}, { status: 200 }); // No provider linked, return empty object
    }

    const providerId = (providerLink[0] as { provider_id: number }).provider_id;
    const [rows] = await connection.execute('SELECT company_name, address, tax_id FROM providers WHERE id = ?', [providerId]);

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0], { status: 200 });
    }
    return NextResponse.json({}, { status: 200 }); // Provider linked but not found, return empty
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function PUT(req: NextRequest) {
  const t = await getTranslations('errors');
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: t('not_authenticated') }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const { company_name, address, tax_id } = await req.json();
    await connection.beginTransaction();

    const [providerLink] = await connection.execute('SELECT provider_id FROM provider_users WHERE user_id = ? LIMIT 1', [user.id]);

    if (Array.isArray(providerLink) && providerLink.length > 0) {
      // User is linked to a provider, update it
      const providerId = (providerLink[0] as { provider_id: number }).provider_id;
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
      const providerId = (providerResult as { insertId: number }).insertId;
      await connection.execute(
        'INSERT INTO provider_users (user_id, provider_id) VALUES (?, ?)',
        [user.id, providerId]
      );
    }

    await connection.commit();
    return NextResponse.json({ message: 'Legal information updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
