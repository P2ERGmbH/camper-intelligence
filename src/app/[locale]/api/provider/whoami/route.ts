import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { createDbConnection } from '@/lib/db/utils';

import { getTranslations } from 'next-intl/server';

interface UserRow {
  id: number;
  email: string;
  role: 'client' | 'provider' | 'admin';
}

export async function GET(req: NextRequest) {
  const t = await getTranslations('errors');
  let connection: mysql.Connection | undefined;
  try {
    const token = req.cookies.get('token');
    console.log('whoami API: Token from cookie:', token ? '[present]' : '[absent]');

    if (!token) {
      console.log('whoami API: No token, returning 401.');
      return NextResponse.json({ error: t('not_authenticated') }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret') as JwtPayload;
    console.log('whoami API: Decoded JWT:', decoded);
    if (!decoded || !decoded.id) {
        console.log('whoami API: Invalid decoded token, returning 401.');
        return NextResponse.json({ error: t('invalid_token') }, { status: 401 });
    }

    connection = await createDbConnection();
    const [userRows] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
        console.log('whoami API: User not found in DB, returning 401.');
        const response = NextResponse.json({ error: t('user_not_found') }, { status: 401 });
response.cookies.set('token', '', { maxAge: -1, path: '/' });
        return response;
    }

    const user = userRows[0] as UserRow;
    console.log('whoami API: User from DB:', user);

    // Extract provider slug from the request URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const providerSlug = pathSegments[2]; // e.g., 'alaska-motorhome-rentals-2'
    console.log('whoami API: Extracted provider slug:', providerSlug);

    if (user.role === 'admin') {
      console.log('whoami API: User is global admin, granting access.');
      return NextResponse.json({ user: { ...user, providerRole: 'admin' } }, { status: 200 });
    }

    if (providerSlug) {
interface ProviderRow {
  id: number;
}

      const [providerRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM providers WHERE external_url_slug = ?',
        [providerSlug]
      );

      if (!Array.isArray(providerRows) || providerRows.length === 0) {
        console.log('whoami API: Provider not found for slug:', providerSlug, ', returning 404.');
        return NextResponse.json({ error: t('provider_not_found') }, { status: 404 });
      }

      const providerId = (providerRows[0] as ProviderRow).id;
      console.log('whoami API: Found provider ID:', providerId);

interface ProviderUserRow {
  role: 'client' | 'provider' | 'admin';
}

      const [providerUserRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT role FROM provider_users WHERE user_id = ? AND provider_id = ?',
        [user.id, providerId]
      );

      if (Array.isArray(providerUserRows) && providerUserRows.length > 0) {
        const providerRole = (providerUserRows[0] as ProviderUserRow).role;
        console.log('whoami API: User has provider-specific role:', providerRole, ', granting access.');
        return NextResponse.json({ user: { ...user, providerRole } }, { status: 200 });
      } else {
        console.log('whoami API: User not authorized for provider:', providerSlug, ', returning 403.');
        return NextResponse.json({ error: t('not_authorized_for_provider') }, { status: 403 });
      }
    } else {
      // If no provider slug is present, and user is not admin,
      // they should at least be a global provider to access generic provider routes
      if (user.role === 'provider') {
        console.log('whoami API: No provider slug, user is global provider, granting access.');
        return NextResponse.json({ user }, { status: 200 });
      } else {
        console.log('whoami API: No provider slug, user is not admin or global provider, returning 403.');
        return NextResponse.json({ error: t('not_authorized') }, { status: 403 });
      }
    }
  } catch (error) {
    console.error('whoami API: Auth: JWT verification failed or other error:', error);
    const response = NextResponse.json({ error: t('invalid_token') }, { status: 401 });
    response.cookies.set('token', '', { maxAge: -1, path: '/' });
    return response;
  } finally {
    if (connection) await connection.end();
  }
}
