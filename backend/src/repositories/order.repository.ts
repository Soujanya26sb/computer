import { randomUUID } from 'crypto';
import { pool } from '../config/db';

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  subtotal: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

async function attachItems(orders: OrderRecord[]) {
  if (!orders.length) return orders;
  const ids = orders.map((order) => order.id);
  const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?) ORDER BY id ASC', [ids]);
  const itemsByOrder = new Map<string, OrderItemRecord[]>();
  for (const item of rows as OrderItemRecord[]) {
    const list = itemsByOrder.get(item.order_id) ?? [];
    list.push(item);
    itemsByOrder.set(item.order_id, list);
  }
  return orders.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }));
}

export const orderRepository = {
  async create(data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subtotal: number;
    notes?: string;
    items: Array<{ productId: string; productName: string; productSlug: string; unitPrice: number; quantity: number; lineTotal: number }>;
  }) {
    const orderId = randomUUID();
    await pool.query(
      `INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, subtotal, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, data.orderNumber, data.customerName, data.customerEmail.toLowerCase(), data.customerPhone, data.subtotal, data.notes ?? null]
    );

    for (const item of data.items) {
      await pool.query(
        `INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [randomUUID(), orderId, item.productId, item.productName, item.productSlug, item.unitPrice, item.quantity, item.lineTotal]
      );
    }

    return this.findById(orderId);
  },

  async list(filters: { search?: string; status?: OrderStatus; page: number; limit: number }) {
    const conditions: string[] = [];
    const values: unknown[] = [];
    if (filters.search) {
      conditions.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)');
      const term = `%${filters.search}%`;
      values.push(term, term, term, term);
    }
    if (filters.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (filters.page - 1) * filters.limit;
    const [countRows] = await pool.query(`SELECT COUNT(*) AS count FROM orders ${whereClause}`, values);
    const total = Number((countRows as Array<{ count: string | number }>)[0]?.count ?? 0);
    const [rows] = await pool.query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, filters.limit, offset]
    );
    return { items: await attachItems(rows as OrderRecord[]), total };
  },

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    const order = (rows as OrderRecord[])[0] ?? null;
    if (!order) return null;
    const [withItems] = await attachItems([order]);
    return withItems;
  },

  async updateStatus(id: string, status: OrderStatus) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },

  async getStats() {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total_orders,
        SUM(CASE WHEN status = 'NEW' THEN 1 ELSE 0 END) AS new_orders,
        SUM(CASE WHEN status IN ('CONFIRMED', 'PROCESSING', 'READY') THEN 1 ELSE 0 END) AS active_orders,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_orders
       FROM orders`
    );
    return (rows as Array<{ total_orders: number; new_orders: number; active_orders: number; completed_orders: number }>)[0];
  },
};
