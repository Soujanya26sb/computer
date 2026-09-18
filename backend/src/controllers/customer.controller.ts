import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, page, limit } = req.query as Record<string, string | undefined>;
  const result = await customerService.list({
    search,
    page: page !== undefined ? Number(page) : undefined,
    limit: limit !== undefined ? Number(limit) : undefined,
  });

  return sendSuccess(res, result.items, 'Customers retrieved', 200, result.meta);
});
