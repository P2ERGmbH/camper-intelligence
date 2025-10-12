import mysql from 'mysql2/promise';
import { Camper } from '@/types/camper';

export async function getAllCampers(connection: mysql.Connection): Promise<Camper[]> {
  const [rows] = await connection.execute('SELECT * FROM campers');
  return rows as Camper[];
}

export async function getCamperFromDb(connection: mysql.Connection, id: string): Promise<Camper | null> {
  const [rows] = await connection.execute('SELECT * FROM campers WHERE id = ?', [id]);
  const campers = rows as Camper[];
  return campers.length > 0 ? campers[0] : null;
}

export async function getCampersByProviderId(connection: mysql.Connection, providerId: number): Promise<Camper[]> {
  const [rows] = await connection.execute('SELECT id, name, description FROM campers WHERE provider_id = ?', [providerId]);
  return rows as Camper[];
}
