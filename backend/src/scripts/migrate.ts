import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

async function migrate() {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found at: ${schemaPath}`);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    console.log('Running database migration (database/schema.sql)...');
    for (const statement of statements) {
      try {
        await pool.query(statement);
      } catch (err) {
        const mysqlError = err as { code?: string };
        if (mysqlError.code !== 'ER_DUP_KEYNAME') throw err;
      }
    }
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
