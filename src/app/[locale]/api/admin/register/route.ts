import { NextResponse } from 'next/server';
import { registerAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await registerAdmin(email, password);

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during admin registration:', error);
    return NextResponse.json({ error: 'Failed to register admin' }, { status: 500 });
  }
}
