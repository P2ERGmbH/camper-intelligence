import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    cookies().set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expire the cookie
      path: '/',
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
