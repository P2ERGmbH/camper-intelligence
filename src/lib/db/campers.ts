import mysql from 'mysql2/promise';
import {Camper, CamperWIthTileImage} from '@/types/camper';
import { getCamperTileImage } from '@/lib/db/images';

export async function getCampersByStationId(connection: mysql.Connection, stationId: number): Promise<Camper[]> {
  const [rows] = await connection.execute('SELECT * FROM campers WHERE station_id = ?', [stationId]);
  return (rows as mysql.RowDataPacket[]) as Camper[];
}

export async function getAllCampers(connection: mysql.Connection): Promise<Camper[]> {
  const [rows] = await connection.execute('SELECT * FROM campers');
  return (rows as mysql.RowDataPacket[]) as Camper[];
}

export async function getCampersByProviderIds(connection: mysql.Connection, providerIds: number[]): Promise<CamperWIthTileImage[]> {
  if (providerIds.length === 0) {
    return [];
  }
  const placeholders = providerIds.map(() => '?').join(', ');
  const [rows] = await connection.execute(`SELECT * FROM campers WHERE provider_id IN (${placeholders})`, providerIds);
  const campers: CamperWIthTileImage[] = (rows as mysql.RowDataPacket[]) as CamperWIthTileImage[];

  for (const camper of campers) {
    const tileImage = await getCamperTileImage(connection, camper.id);
    if (tileImage) {
      camper.tileImage = tileImage;
    }
  }

  return campers;
}

export async function getCamperFromDb(connection: mysql.Connection, id: number): Promise<Camper | null> {
  const [rows] = await connection.execute('SELECT * FROM campers WHERE id = ?', [id]);
  const campers:Camper[] = (rows as mysql.RowDataPacket[]) as Camper[];
  return campers.length > 0 ? campers[0] : null;
}

export async function updateCamperStation(connection: mysql.Connection, camperId: number, stationId: number | null): Promise<void> {
  await connection.execute('UPDATE campers SET station_id = ? WHERE id = ?', [stationId, camperId]);
}