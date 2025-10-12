import { getTranslations } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createDbConnection } from '@/lib/db/utils';

// Helper function to generate the slug (duplicate from admin/providers/page.tsx, consider centralizing)
const generateProviderSlug = (companyName: string, id: number): string => {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  return `${slug}-${id}`;
};

export async function POST(req: NextRequest) {
  const t = await getTranslations('errors');
  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: t('email_password_required') }, { status: 400 });
    }

    // Allow both 'provider' and 'admin' roles to log in
    const [users] = await connection.execute('SELECT id, email, password_hash, role FROM users WHERE email = ? AND (role = ? OR role = ?)', [email, 'provider', 'admin']);
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: t('invalid_credentials') }, { status: 401 });
    }

    const user: { id: number; email: string; password_hash: string; role: 'client' | 'provider' | 'admin' } = users[0] as { id: number; email: string; password_hash: string; role: 'client' | 'provider' | 'admin' };
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: t('invalid_credentials') }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-default-secret', { expiresIn: '1h' });

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      path: '/',
    });

    // Determine redirect URL based on user role
    let redirectUrl = '';
    if (user.role === 'admin') {
      redirectUrl = '/admin'; // Admin dashboard
    } else if (user.role === 'provider') {
      // Fetch provider details to construct the slug
      const [providerRows] = await connection.execute('SELECT id, company_name FROM providers JOIN provider_users ON providers.id = provider_users.provider_id WHERE provider_users.user_id = ?', [user.id]);
      const provider = (providerRows as { id: number; company_name: string }[])[0];
      if (provider) {
        const slug = generateProviderSlug(provider.company_name, provider.id);
        redirectUrl = `/provider/${slug}/dashboard`;
      } else {
        // Fallback if provider not found for some reason
        redirectUrl = '/provider'; 
      }
    }

    return NextResponse.json({ message: 'Login successful', redirectUrl }, { status: 200 });

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
