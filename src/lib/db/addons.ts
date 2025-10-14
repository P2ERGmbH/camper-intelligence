import mysql from 'mysql2/promise';
import { Addon } from '@/types/addon';

export async function getAddonsByProviderId(connection: mysql.Connection, providerId: number): Promise<Addon[]> {
  const [rows] = await connection.execute(`
    SELECT DISTINCT a.id, a.name, a.price_per_unit, a.description, a.category, a.max_quantity
    FROM addons a
    JOIN camper_addons ca ON a.id = ca.addon_id
    JOIN campers c ON ca.camper_id = c.id
    WHERE c.provider_id = ?
  `, [providerId]);
  return rows as Addon[];
}

export async function getAddonsForCamperFromDb(connection: mysql.Connection, camperId: number): Promise<Addon[]> {
  const [rows] = await connection.execute(`
    SELECT a.id, a.name, a.price_per_unit, a.description, a.category, a.max_quantity
    FROM addons a
    JOIN camper_addons ca ON a.id = ca.addon_id
    WHERE ca.camper_id = ?
  `, [camperId]);
  return rows as Addon[];
}
