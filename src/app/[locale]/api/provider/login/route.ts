import { getTranslations } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createDbConnection } from '@/lib/db/utils';

export async function POST(req: NextRequest) {
  const t = await getTranslations('errors');
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: t('email_password_required') }, { status: 400 });
    }

    const [users] = await connection.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'provider']);
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: t('invalid_credentials') }, { status: 401 });
    }

    const user: { id: number; email: string; password_hash: string; role: string } = users[0] as { id: number; email: string; password_hash: string; role: string };
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: t('invalid_credentials') }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-default-secret', { expiresIn: '1h' });

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
