import { orderRepository, OrderRecord, OrderStatus } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';
import { CreateOrderInput } from '../validation/order.validation';

function serializeOrder(order: OrderRecord) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    status: order.status,
    subtotal: Number(order.subtotal),
    notes: order.notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productSlug: item.product_slug,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  };
}

function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CS-${stamp}-${tail}`;
}

export const orderService = {
  async create(data: CreateOrderInput) {
    const items = [];
    for (const requested of data.items) {
      const product = await productRepository.findById(requested.productId);
      if (!product) throw ApiError.badRequest('Selected product is not available');
      if (product.stock_quantity <= 0) throw ApiError.badRequest(`${product.name} is out of stock`);
      if (requested.quantity > product.stock_quantity) {
        throw ApiError.badRequest(`Only ${product.stock_quantity} unit(s) available for ${product.name}`);
      }
      const unitPrice = Number(product.price);
      items.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        unitPrice,
        quantity: requested.quantity,
        lineTotal: unitPrice * requested.quantity,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = await orderRepository.create({
      orderNumber: makeOrderNumber(),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      subtotal,
      notes: data.notes,
      items,
    });
    if (!order) throw ApiError.internal('Failed to create order');
    return serializeOrder(order);
  },

  async list(query: { search?: string; status?: OrderStatus; page?: number; limit?: number }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
    const { items, total } = await orderRepository.list({
      search: query.search,
      status: query.status,
      page,
      limit,
    });
    return {
      items: items.map(serializeOrder),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  async updateStatus(id: string, status: OrderStatus) {
    const order = await orderRepository.updateStatus(id, status);
    if (!order) throw ApiError.notFound('Order not found');
    return serializeOrder(order);
  },

  async getStats() {
    const stats = await orderRepository.getStats();
    return {
      totalOrders: Number(stats.total_orders ?? 0),
      newOrders: Number(stats.new_orders ?? 0),
      activeOrders: Number(stats.active_orders ?? 0),
      completedOrders: Number(stats.completed_orders ?? 0),
    };
  },
};
