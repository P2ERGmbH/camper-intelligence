import mysql from 'mysql2/promise';
import { Addon } from '@/types/addon';

export async function getAddonsByProviderId(connection: mysql.Connection, providerId: number): Promise<Addon[]> {
  const [rows] = await connection.execute('SELECT id, name, price_per_unit FROM addons WHERE provider_id = ?', [providerId]);
  return rows as Addon[];
}
