import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

async function seed() {
  const seedPath = path.resolve(__dirname, '../../database/seed.sql');

  if (!fs.existsSync(seedPath)) {
    console.error(`Seed file not found at: ${seedPath}`);
    process.exit(1);
  }

  const seedSql = fs.readFileSync(seedPath, 'utf-8');
  try {
    console.log('Running seed (database/seed.sql)...');
    await pool.query(seedSql);
    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
