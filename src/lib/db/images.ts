import mysql from 'mysql2/promise';
import { Image } from '@/types/image';

export async function getImagesForCamperFromDb(connection: mysql.Connection, camperId: string): Promise<Image[]> {
  const [rows] = await connection.execute(
    'SELECT i.id, i.url, i.caption, i.alt_text, i.copyright_holder_name, i.copyright_holder_link, i.created_at, i.updated_at FROM images i JOIN camper_images ci ON i.id = ci.image_id WHERE ci.camper_id = ?',
    [camperId]
  );
  return rows as Image[];
}
