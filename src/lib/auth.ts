import { User } from '@/types/user';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createDbConnection } from '@/lib/db/utils';

interface JwtPayload {
  id: number;
  email: string;
  role: User['role'];
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('Auth: Token from cookie:', token ? '[present]' : '[absent]');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log('Auth: JWT decoded:', decoded);

    let connection;
    try {
      connection = await createDbConnection();
      const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);
      const users = rows as User[];

      if (users.length > 0) {
        console.log('Auth: User fetched from DB:', users[0]);
        return users[0];
      }
    } catch (dbError) {
      console.error('Auth: Database error fetching user:', dbError);
    } finally {
      if (connection) connection.end();
    }

    return null;
  } catch (error) {
    console.error('Auth: JWT verification failed:', error);
    return null;
  }
}
