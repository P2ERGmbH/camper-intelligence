import mysql from 'mysql2/promise';
import { Addon } from '@/types/addon';

export async function getAddonsByProviderIds(connection: mysql.Connection, providerIds: number[]): Promise<Addon[]> {
  if (providerIds.length === 0) {
    return [];
  }
  const placeholders = providerIds.map(() => '?').join(', ');
  const [rows] = await connection.execute(`
    SELECT DISTINCT a.id, a.name, a.price_per_unit, a.description, a.category, a.max_quantity
    FROM addons a
    JOIN camper_addons ca ON a.id = ca.addon_id
    JOIN campers c ON ca.camper_id = c.id
    WHERE c.provider_id IN (${placeholders})
  `, providerIds);
  return rows as Addon[];
}

export async function getAddonsForCamperFromDb(connection: mysql.Connection, camperId: number): Promise<Addon[]> {
  if (camperId === undefined || camperId === null) {
    throw new Error("camperId must not be undefined or null when fetching addons for a camper.");
  }
  const [rows] = await connection.execute(`
    SELECT a.id, a.name, a.price_per_unit, a.description, a.category, a.max_quantity
    FROM addons a
    JOIN camper_addons ca ON a.id = ca.addon_id
    WHERE ca.camper_id = ?
  `, [camperId]);
  return rows as Addon[];
}

export async function getAddonByNameAndProviderId(connection: mysql.Connection, name: string, providerId: number): Promise<number | null> {
  const [rows] = await connection.execute(
    'SELECT id FROM addons WHERE name = ? AND provider_id = ?',
    [name, providerId]
  );
  const addons = rows as { id: number }[];
  return addons.length > 0 ? addons[0].id : null;
}

export async function associateAddonWithCamper(connection: mysql.Connection, addonId: number, camperId: number): Promise<void> {
  await connection.execute(
    'INSERT INTO camper_addons (addon_id, camper_id) VALUES (?, ?)',
    [addonId, camperId]
  );
}
