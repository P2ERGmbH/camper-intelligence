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

    // Check if user already exists
    const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert the new user
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'provider']
    );
    const userId = (userResult as any).insertId;

    // Create a new provider for the user
    const [providerResult] = await connection.execute(
      'INSERT INTO providers (company_name) VALUES (?)',
      ['New Provider'] // Default name, can be updated later
    );
    const providerId = (providerResult as any).insertId;

    // Link the user to the new provider
    await connection.execute(
      'INSERT INTO provider_users (user_id, provider_id) VALUES (?, ?)',
      [userId, providerId]
    );

    await connection.end();

    // Create JWT
    const token = jwt.sign(
      { id: userId, email: email },
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

    return NextResponse.json({ message: 'Provider account created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
