import { randomUUID } from 'crypto';
import { pool } from '../config/db';
import { normalizeUserRole, UserRole } from '../utils/jwt';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function mapUserRole(row: Partial<UserRecord> | undefined): UserRole {
  return normalizeUserRole((row?.role as string | undefined) ?? 'CUSTOMER');
}

export const userRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
    const user = (rows as UserRecord[])[0];
    if (!user) return null;
    return { ...user, role: mapUserRole(user) };
  },

  async findById(id: string): Promise<UserRecord | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as UserRecord[])[0];
    if (!user) return null;
    return { ...user, role: mapUserRole(user) };
  },

  async create(data: { name: string; email: string; passwordHash: string; role: UserRole }): Promise<UserRecord> {
    const id = randomUUID();
    const role = normalizeUserRole(data.role);
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.email.toLowerCase(), data.passwordHash, role]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as UserRecord[])[0];
    return { ...user, role: mapUserRole(user) };
  },

  async count(): Promise<number> {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM users');
    return Number((rows as Array<{ count: number | string }>)[0]?.count ?? 0);
  },

  async countByRole(role: UserRole): Promise<number> {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE role = ?', [role]);
    return Number((rows as Array<{ count: number | string }>)[0]?.count ?? 0);
  },

  async listCustomers(filters: { search?: string; page: number; limit: number }): Promise<{ items: UserRecord[]; total: number }> {
    const conditions = ['role = ?'];
    const values: unknown[] = ['CUSTOMER'];

    if (filters.search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const term = `%${filters.search}%`;
      values.push(term, term);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const offset = (filters.page - 1) * filters.limit;

    const [countRows] = await pool.query(`SELECT COUNT(*) AS count FROM users ${whereClause}`, values);
    const total = Number((countRows as Array<{ count: number | string }>)[0]?.count ?? 0);

    const [rows] = await pool.query(
      `SELECT id, name, email, role, is_active, created_at, updated_at
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, filters.limit, offset]
    );

    return { items: rows as UserRecord[], total };
  },
};
