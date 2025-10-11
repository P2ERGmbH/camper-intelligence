import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { createDbConnection } from '@/lib/db/utils';

import { getTranslations } from 'next-intl/server';

export async function GET(req: NextRequest) {
  const t = await getTranslations('errors');
  let connection: mysql.Connection | undefined;
  try {
    const token = req.cookies.get('session');

    if (!token) {
      return NextResponse.json({ error: t('not_authenticated') }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret') as JwtPayload;
    if (!decoded || !decoded.id) {
        return NextResponse.json({ error: t('invalid_token') }, { status: 401 });
    }

    connection = await createDbConnection();
    const [rows] = await connection.execute(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0];
        return NextResponse.json({ user }, { status: 200 });
    } else {
        const response = NextResponse.json({ error: t('user_not_found') }, { status: 401 });
        response.cookies.set('session', '', { maxAge: -1, path: '/' });
        return response;
    }
  } catch {
    const response = NextResponse.json({ error: t('invalid_token') }, { status: 401 });
    response.cookies.set('session', '', { maxAge: -1, path: '/' });
    return response;
  } finally {
    if (connection) await connection.end();
  }
}
