import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';
import { createDbConnection } from '@/lib/db/utils';

async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('session');
  if (!token) return null;
  let connection: mysql.Connection | undefined;
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'your-default-secret') as JwtPayload;
    if (!decoded || !decoded.id) return null;

    connection = await createDbConnection();
    const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);

    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as { id: number; email: string; role: string }) : null;
  } catch (error: unknown) {
    console.error(error);
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await createDbConnection();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const parentId = formData.get('parentId');
    const parentType = formData.get('parentType');
    const description = formData.get('description');
    const altText = formData.get('altText');
    const copyright = formData.get('copyright');
    const category = formData.get('category');

    if (!file || !parentId || !parentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    await connection.beginTransaction();

    const [imageResult] = await connection.execute(
      'INSERT INTO images (url, caption, alt_text, copyright_holder_name) VALUES (?, ?, ?, ?)',
      [fileUrl, description, altText, copyright]
    );
    const imageId = (imageResult as { insertId: number }).insertId;

    if (parentType === 'camper') {
      await connection.execute(
        'INSERT INTO camper_images (camper_id, image_id, image_category) VALUES (?, ?, ?)',
        [parentId, imageId, category]
      );
    } else {
      await connection.execute(
        `INSERT INTO ${parentType}_images (${parentType}_id, image_id) VALUES (?, ?)`,
        [parentId, imageId]
      );
    }

    await connection.commit();

    return NextResponse.json({ message: 'Image uploaded successfully', url: fileUrl }, { status: 200 });
  } catch (error: unknown) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
