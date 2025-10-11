import mysql from 'mysql2/promise';
import { Camper } from '@/types/camper';

export async function getCamperFromDb(connection: mysql.Connection, id: string): Promise<Camper | null> {
  const [rows] = await connection.execute('SELECT * FROM campers WHERE id = ?', [id]);
  const campers = rows as Camper[];
  return campers.length > 0 ? campers[0] : null;
}
