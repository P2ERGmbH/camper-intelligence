import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'provider']);
    
    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user: any = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      await connection.end();
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await connection.end();

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '1h' }
    );

    // Set cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
