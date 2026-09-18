import { randomUUID } from 'crypto';
import { pool } from '../config/db';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export const categoryRepository = {
  async findAll(): Promise<CategoryRecord[]> {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows as CategoryRecord[];
  },

  async findAllWithProductCount(): Promise<Array<CategoryRecord & { product_count: number }>> {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    return rows as Array<CategoryRecord & { product_count: number }>;
  },

  async findById(id: string): Promise<CategoryRecord | null> {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return (rows as CategoryRecord[])[0] ?? null;
  },

  async findBySlug(slug: string): Promise<CategoryRecord | null> {
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return (rows as CategoryRecord[])[0] ?? null;
  },

  async create(data: { name: string; slug: string; description?: string | null; icon?: string | null }): Promise<CategoryRecord> {
    const id = randomUUID();
    await pool.query(
      `INSERT INTO categories (id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.slug, data.description ?? null, data.icon ?? null]
    );
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return (rows as CategoryRecord[])[0];
  },

  async update(
    id: string,
    data: { name?: string; slug?: string; description?: string | null; icon?: string | null }
  ): Promise<CategoryRecord | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return (rows as CategoryRecord[])[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },

  async countProductsInCategory(id: string): Promise<number> {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products WHERE category_id = ?', [id]);
    return Number((rows as Array<{ count: number | string }>)[0]?.count ?? 0);
  },
};
