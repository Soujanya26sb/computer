import mysql from 'mysql2/promise';
import { env } from './env';

export const pool = mysql.createPool({
  uri: env.databaseUrl,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true,
});

export async function testConnection(): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1 AS ok');
  } finally {
    connection.release();
  }
}
