import mysql from 'mysql2/promise';
import { Provider } from '@/types/provider';

export async function getProviderByExtId(connection: mysql.Connection, extId: string): Promise<Provider | null> {
  const [rows] = await connection.execute('SELECT * FROM providers WHERE ext_id = ?', [extId]);
  const providers = rows as Provider[];
  return providers.length > 0 ? providers[0] : null;
}

export async function getAllProviders(connection: mysql.Connection): Promise<Provider[]> {
  const [rows] = await connection.execute('SELECT * FROM providers');
  return rows as Provider[];
}

export async function updateProvider(connection: mysql.Connection, provider: Partial<Provider>): Promise<void> {
  const { id, ...fields } = provider;
  const setClauses = Object.keys(fields).map(key => `\`${key}\` = ?`).join(', ');
  const values = Object.values(fields);

  if (setClauses) {
    await connection.execute(`UPDATE providers SET ${setClauses} WHERE id = ?`, [...values, id]);
  }
}

export async function getProviderById(connection: mysql.Connection, id: number): Promise<Provider | null> {
  const [rows] = await connection.execute('SELECT * FROM providers WHERE id = ?', [id]);
  const providers = rows as Provider[];
  return providers.length > 0 ? providers[0] : null;
}
