import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { pool } from '../config/db';
import { env } from '../config/env';

async function createAdmin() {
  const name = env.initialAdmin.name;
  const email = env.initialAdmin.email;
  const password = env.initialAdmin.password;

  if (!name || !email || !password) {
    console.error(
      'Missing INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, or INITIAL_ADMIN_PASSWORD in .env'
    );
    process.exit(1);
  }

  const connection = await pool.getConnection();
  try {
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    );
    if ((existing as Array<{ id: string }>).length > 0) {
      console.log(`Admin with email "${email}" already exists. Skipping creation.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = randomUUID();
    await connection.query(
      `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'ADMIN')`,
      [id, name, email.toLowerCase(), passwordHash]
    );

    const [rows] = await connection.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [id]
    );

    const admin = (rows as Array<{ id: string; name: string; email: string; role: string }>)[0];
    console.log('Admin created successfully:');
    console.log(`  ID:    ${admin.id}`);
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    console.log('\nIMPORTANT: Change the password after first login.');
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

createAdmin();
