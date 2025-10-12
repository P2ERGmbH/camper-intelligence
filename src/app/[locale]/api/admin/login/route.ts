import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let connection;
    try {
      connection = await createDbConnection();
      const [rows] = await connection.execute('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
      const users = rows as (User & { password_hash: string })[];

      if (users.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }

      const user = users[0];

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }

      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Access denied. Not an admin user.' }, { status: 403 });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Set cookie
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      return NextResponse.json({ message: 'Login successful.', user: { id: user.id, email: user.email, role: user.role } });
    } catch (dbError) {
      console.error('Database error during admin login:', dbError);
      return NextResponse.json({ error: 'Database error during login.' }, { status: 500 });
    } finally {
      if (connection) connection.end();
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
