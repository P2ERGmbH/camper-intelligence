import mysql from 'mysql2/promise';

export interface InsertResult {
  insertId: number;
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function createDbConnection(): Promise<mysql.Connection> {
  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    throw new Error('Missing database environment variables. Cannot create DB connection.');
  }
  return await mysql.createConnection(dbConfig);
}
