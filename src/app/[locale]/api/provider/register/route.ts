import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createDbConnection } from '@/lib/db/utils';

import { getTranslations } from 'next-intl/server';
// ... (other imports)

export async function POST(req: NextRequest) {
  const t = await getTranslations('errors');
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: t('email_password_required') }, { status: 400 });
    }

    const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: t('user_exists') }, { status: 409 });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert the new user
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'provider']
    );
    const userId = (userResult as { insertId: number }).insertId;

    // Create a new provider for the user
    const [providerResult] = await connection.execute(
      'INSERT INTO providers (company_name) VALUES (?)',
      ['New Provider'] // Default name, can be updated later
    );
    const providerId = (providerResult as { insertId: number }).insertId;

    // Link the user to the new provider
    await connection.execute(
      'INSERT INTO provider_users (user_id, provider_id) VALUES (?, ?)',
      [userId, providerId]
    );

    // Create JWT
    const token = jwt.sign(
      { id: userId, email: email },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '1h' }
    );

    // Set cookie
    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ message: 'Provider account created successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
