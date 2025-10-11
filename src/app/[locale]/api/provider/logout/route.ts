import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const t = await getTranslations('errors');
  try {
    (await cookies()).set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expire the cookie
      path: '/',
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  }
}
