import { randomUUID } from 'crypto';
import { pool } from '../config/db';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  brand: string;
  model: string;
  price: string;
  stock_quantity: number;
  short_description: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
  images?: ProductImageRecord[];
}

export interface ProductImageRecord {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface ListProductsFilters {
  search?: string;
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page: number;
  limit: number;
  featured?: boolean;
  includeInactive?: boolean;
  lowStockThreshold: number;
  outOfStockThreshold: number;
}

function buildSortClause(sortBy?: string): string {
  switch (sortBy) {
    case 'price_asc':
      return 'p.price ASC';
    case 'price_desc':
      return 'p.price DESC';
    case 'name_asc':
      return 'p.name ASC';
    case 'name_desc':
      return 'p.name DESC';
    case 'newest':
    default:
      return 'p.created_at DESC';
  }
}

async function attachImages(products: ProductRecord[]): Promise<ProductRecord[]> {
  if (products.length === 0) return products;
  const ids = products.map((p) => p.id);
  const [rows] = await pool.query('SELECT * FROM product_images WHERE product_id IN (?) ORDER BY is_primary DESC, sort_order ASC, created_at ASC', [ids]);
  const imagesByProduct = new Map<string, ProductImageRecord[]>();
  for (const img of rows as ProductImageRecord[]) {
    const list = imagesByProduct.get(img.product_id) ?? [];
    list.push(img);
    imagesByProduct.set(img.product_id, list);
  }
  return products.map((p) => ({ ...p, images: imagesByProduct.get(p.id) ?? [] }));
}

export const productRepository = {
  async list(filters: ListProductsFilters): Promise<{ items: ProductRecord[]; total: number }> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (!filters.includeInactive) {
      conditions.push('p.is_active = TRUE');
    }

    if (filters.search) {
      conditions.push('(p.name LIKE ? OR p.brand LIKE ? OR p.model LIKE ? OR p.short_description LIKE ?)');
      const term = `%${filters.search}%`;
      values.push(term, term, term, term);
    }

    if (filters.categorySlug) {
      conditions.push('c.slug = ?');
      values.push(filters.categorySlug);
    }

    if (filters.brand) {
      conditions.push('p.brand = ?');
      values.push(filters.brand);
    }

    if (filters.minPrice !== undefined) {
      conditions.push('p.price >= ?');
      values.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      conditions.push('p.price <= ?');
      values.push(filters.maxPrice);
    }

    if (filters.featured) {
      conditions.push('p.is_featured = TRUE');
    }

    if (filters.stockStatus === 'OUT_OF_STOCK') {
      conditions.push('p.stock_quantity <= ?');
      values.push(filters.outOfStockThreshold);
    } else if (filters.stockStatus === 'LOW_STOCK') {
      conditions.push('p.stock_quantity > ? AND p.stock_quantity <= ?');
      values.push(filters.outOfStockThreshold, filters.lowStockThreshold);
    } else if (filters.stockStatus === 'IN_STOCK') {
      conditions.push('p.stock_quantity > ?');
      values.push(filters.lowStockThreshold);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortClause = buildSortClause(filters.sortBy);
    const offset = (filters.page - 1) * filters.limit;

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${whereClause}`,
      values
    );
    const total = Number((countRows as Array<{ count: number | string }>)[0]?.count ?? 0);

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${whereClause}
       ORDER BY ${sortClause}
       LIMIT ? OFFSET ?`,
      [...values, filters.limit, offset]
    );

    const items = await attachImages(rows as ProductRecord[]);
    return { items, total };
  },

  async findById(id: string, includeInactive = false): Promise<ProductRecord | null> {
    const conditions = ['p.id = ?'];
    if (!includeInactive) conditions.push('p.is_active = TRUE');
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE ${conditions.join(' AND ')}`,
      [id]
    );
    const product = (rows as ProductRecord[])[0] ?? null;
    if (!product) return null;
    const [withImages] = await attachImages([product]);
    return withImages;
  },

  async findBySlug(slug: string): Promise<ProductRecord | null> {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_active = TRUE`,
      [slug]
    );
    const product = (rows as ProductRecord[])[0] ?? null;
    if (!product) return null;
    const [withImages] = await attachImages([product]);
    return withImages;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const [rows] = await pool.query(
      excludeId
        ? 'SELECT 1 FROM products WHERE slug = ? AND id != ?'
        : 'SELECT 1 FROM products WHERE slug = ?',
      excludeId ? [slug, excludeId] : [slug]
    );
    return (rows as any[]).length > 0;
  },

  async create(data: {
    name: string;
    slug: string;
    category_id: string;
    brand: string;
    model: string;
    price: number;
    stock_quantity: number;
    short_description: string;
    description: string;
    features: string[];
    specifications: Record<string, string>;
    is_featured: boolean;
  }): Promise<ProductRecord> {
    const productId = randomUUID();
    await pool.query(
      `INSERT INTO products
        (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        data.name,
        data.slug,
        data.category_id,
        data.brand,
        data.model,
        data.price,
        data.stock_quantity,
        data.short_description,
        data.description,
        JSON.stringify(data.features),
        JSON.stringify(data.specifications),
        data.is_featured,
      ]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    return (rows as ProductRecord[])[0];
  },

  async update(id: string, data: Record<string, unknown>): Promise<ProductRecord | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (key === 'features' || key === 'specifications') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.findById(id, true);
    }

    values.push(id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return (rows as ProductRecord[])[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },

  async addImages(
    productId: string,
    images: Array<{ image_url: string; is_primary?: boolean; sort_order?: number }>
  ): Promise<ProductImageRecord[]> {
    if (images.length === 0) return [];
    const inserted: ProductImageRecord[] = [];
    for (const [index, img] of images.entries()) {
      const imageId = randomUUID();
      await pool.query(
        `INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [imageId, productId, img.image_url, img.is_primary ?? false, img.sort_order ?? index]
      );
      const [rows] = await pool.query('SELECT * FROM product_images WHERE id = ?', [imageId]);
      inserted.push((rows as ProductImageRecord[])[0]);
    }
    return inserted;
  },

  async removeImages(productId: string, imageIds: string[]): Promise<void> {
    if (imageIds.length === 0) return;
    await pool.query('DELETE FROM product_images WHERE product_id = ? AND id IN (?)', [productId, imageIds]);
  },

  async getImages(productId: string): Promise<ProductImageRecord[]> {
    const [rows] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [productId]
    );
    return rows as ProductImageRecord[];
  },

  async ensurePrimaryImage(productId: string): Promise<void> {
    const images = await this.getImages(productId);
    if (images.length === 0) return;
    const hasPrimary = images.some((img) => img.is_primary);
    if (!hasPrimary) {
      await pool.query('UPDATE product_images SET is_primary = TRUE WHERE id = ?', [images[0].id]);
    }
  },

  async getStats(lowStockThreshold: number, outOfStockThreshold: number) {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total_products,
        SUM(CASE WHEN stock_quantity > ? THEN 1 ELSE 0 END) AS in_stock,
        SUM(CASE WHEN stock_quantity > ? AND stock_quantity <= ? THEN 1 ELSE 0 END) AS low_stock,
        SUM(CASE WHEN stock_quantity <= ? THEN 1 ELSE 0 END) AS out_of_stock
       FROM products WHERE is_active = TRUE`,
      [lowStockThreshold, outOfStockThreshold, lowStockThreshold, outOfStockThreshold]
    );
    return (rows as Array<{ total_products: number; in_stock: number; low_stock: number; out_of_stock: number }>)[0];
  },
};

