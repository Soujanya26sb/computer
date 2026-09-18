import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.create(req.body);
  return sendSuccess(res, order, 'Order request placed successfully', 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, status, page, limit } = req.query as Record<string, string | undefined>;
  const result = await orderService.list({
    search,
    status: status as any,
    page: page !== undefined ? Number(page) : undefined,
    limit: limit !== undefined ? Number(limit) : undefined,
  });
  return sendSuccess(res, result.items, 'Orders retrieved', 200, result.meta);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  return sendSuccess(res, order, 'Order updated successfully');
});

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await orderService.getStats();
  return sendSuccess(res, result, 'Order statistics retrieved');
});
