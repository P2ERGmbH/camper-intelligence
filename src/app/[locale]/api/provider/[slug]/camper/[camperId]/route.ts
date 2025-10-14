import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createDbConnection } from '@/lib/db/utils';
import { Camper } from '@/types/camper';
import { getTranslations } from 'next-intl/server';

interface Params {
  locale: string;
  slug: string;
  camperId: string;
}

export async function PUT(req: NextRequest, context: { params: Promise<Params> }) {
  const t = await getTranslations('errors');
  const params = await context.params;
  const { slug, camperId } = params;
  let connection: mysql.Connection | undefined;

  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: t('not_authenticated') }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret') as {
      id: number;
      email: string;
      role: 'client' | 'provider' | 'admin';
    };

    const userId = decodedToken.id;
    const userRole = decodedToken.role;

    connection = await createDbConnection();

    let authorized = false;
    let providerId: number | null = null;

    if (userRole === 'admin') {
      authorized = true;
    } else if (userRole === 'provider') {
      const [providerRows] = await connection.execute<mysql.RowDataPacket[]>(`
        SELECT p.id
        FROM providers p
        JOIN provider_users pu ON p.id = pu.provider_id
        WHERE pu.user_id = ? AND CONCAT(LOWER(REPLACE(p.company_name, ' ', '-')), '-', p.id) = ?
      `, [userId, slug]);

      if (providerRows.length > 0) {
        providerId = (providerRows[0] as { id: number }).id;
        // Check if the camper belongs to this provider
        const [camperCheckRows] = await connection.execute<mysql.RowDataPacket[]>(`SELECT id FROM campers WHERE id = ? AND provider_id = ?`, [camperId, providerId]);
        if (camperCheckRows.length > 0) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: t('not_authorized') }, { status: 403 });
    }

    const updatedData: Partial<Camper> = await req.json();
    const fieldsToExclude = ['id', 'provider_id', 'created_at', 'updated_at', 'addons'];
    const fieldsToUpdate: Partial<Camper> = {};
    for (const key of Object.keys(updatedData)) {
      if (!fieldsToExclude.includes(key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fieldsToUpdate as any)[key] = (updatedData as any)[key];
      }
    }
    const setClauses: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    for (const key in fieldsToUpdate) {
      if (Object.prototype.hasOwnProperty.call(fieldsToUpdate, key)) {
        const value = fieldsToUpdate[key as keyof typeof fieldsToUpdate];
        // Only push primitive values (string, number, boolean, null) to the values array
        if (value !== undefined && !Array.isArray(value) && typeof value !== 'object') {
          setClauses.push(`\`${key}\` = ?`);
          values.push(value);
        }
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: t('missing_fields') }, { status: 400 });
    }

    values.push(camperId);

    const [result] = await connection.execute(`UPDATE campers SET ${setClauses.join(', ')} WHERE id = ?`, values);

    if ((result as mysql.OkPacket).affectedRows === 0) {
      return NextResponse.json({ error: t('camper_not_found') }, { status: 404 });
    }

    // Handle addons
    if (updatedData.addons !== undefined && updatedData.addons !== null) {
      // Delete existing addons for this camper
      await connection.execute('DELETE FROM camper_addons WHERE camper_id = ?', [camperId]);

      // Insert new addons
      if (updatedData.addons.length > 0) {
        const addonValues = updatedData.addons.map(addon => [camperId, addon.id]);
        await connection.query('INSERT INTO camper_addons (camper_id, addon_id) VALUES ?', [addonValues]);
      }
    }

    return NextResponse.json({ message: 'Camper updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating camper data:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: t('invalid_token') }, { status: 401 });
    }
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
