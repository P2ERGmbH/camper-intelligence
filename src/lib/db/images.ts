import mysql from 'mysql2/promise';
import { InsertResult } from './utils';

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