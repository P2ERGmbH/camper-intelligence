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

export async function getCamperByExtId(connection: mysql.Connection, extId: string): Promise<Camper | null> {
  const [rows] = await connection.execute('SELECT * FROM campers WHERE ext_id = ?', [extId]);
  const campers = rows as Camper[];
  return campers.length > 0 ? campers[0] : null;
}

export async function updateCamperStation(connection: mysql.Connection, camperId: number, stationId: number | null): Promise<void> {
  await connection.execute('UPDATE campers SET station_id = ? WHERE id = ?', [stationId, camperId]);
}

export async function getCampersByProviderId(connection: mysql.Connection, providerId: number): Promise<Camper[]> {
  const [rows] = await connection.execute('SELECT id, name, description FROM campers WHERE provider_id = ?', [providerId]);
  return rows as Camper[];
}
