import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret');
    if (!decoded || !decoded.id) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0];
        return NextResponse.json({ user }, { status: 200 });
    } else {
        // User in token not found in DB, clear the cookie
        const response = NextResponse.json({ error: 'User not found' }, { status: 401 });
        response.cookies.set('session', '', { maxAge: -1, path: '/' });
        return response;
    }
  } catch (error) {
    // Invalid token, clear the cookie
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    response.cookies.set('session', '', { maxAge: -1, path: '/' });
    return response;
  }
}
