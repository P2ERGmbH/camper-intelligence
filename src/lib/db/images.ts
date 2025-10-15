import mysql from 'mysql2/promise';
import { InsertResult } from './utils';

export interface CamperImage {
  url: string;
  caption: string | null;
  alt_text: string | null;
  category: string;
}

export async function insertImage(connection: mysql.Connection, url: string, caption: string | null, altText: string | null): Promise<number> {
  const [result] = await connection.execute(
    'INSERT INTO images (url, caption, alt_text) VALUES (?, ?, ?)',
    [url, caption, altText]
  ) as [InsertResult, mysql.FieldPacket[]];
  return result.insertId;
}

export async function associateImageWithCamper(connection: mysql.Connection, imageId: number, camperId: number, category: string): Promise<void> {
  await connection.execute(
    'INSERT INTO camper_images (image_id, camper_id, category) VALUES (?, ?, ?)',
    [imageId, camperId, category]
  );
}

export async function getImagesForCamperFromDb(connection: mysql.Connection, camperId: number): Promise<CamperImage[]> {
  const [rows] = await connection.execute(
    'SELECT i.url, i.caption, i.alt_text, ci.category FROM images i JOIN camper_images ci ON i.id = ci.image_id WHERE ci.camper_id = ?',
    [camperId]
  );
  return rows as CamperImage[];
}
