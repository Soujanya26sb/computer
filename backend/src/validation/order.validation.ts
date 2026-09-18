import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(120),
    customerEmail: z.string().email().max(160),
    customerPhone: z.string().min(7).max(40),
    notes: z.string().max(1000).optional(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().int().min(1).max(50),
    })).min(1).max(20),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const listOrdersQuerySchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['NEW', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['NEW', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED']),
  }),
  query: z.any().optional(),
  params: z.object({ id: z.string().uuid() }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
export type OrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body'];
