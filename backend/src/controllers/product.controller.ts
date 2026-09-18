import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import { verifyToken } from '../utils/jwt';

/**
 * GET /api/products and GET /api/products/:id are public endpoints, but when a
 * valid admin token is supplied we also include inactive products so the
 * admin dashboard can manage products that have been deactivated.
 */
function isPrivilegedRequester(req: Request): boolean {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return false;
  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, brand, minPrice, maxPrice, stockStatus, sortBy, page, limit, featured } =
    req.query as Record<string, string | undefined>;

  const result = await productService.list(
    {
      search,
      category,
      brand,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      stockStatus: stockStatus as 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | undefined,
      sortBy: sortBy as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | undefined,
      page: page !== undefined ? Number(page) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
    },
    isPrivilegedRequester(req)
  );

  return sendSuccess(res, result.items, 'Products retrieved', 200, result.meta);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getById(req.params.id, isPrivilegedRequester(req));
  return sendSuccess(res, product, 'Product retrieved');
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getBySlug(req.params.slug);
  return sendSuccess(res, product, 'Product retrieved');
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await productService.getStats();
  return sendSuccess(res, stats, 'Product statistics retrieved');
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const product = await productService.create(req.body, files);
  return sendSuccess(res, product, 'Product created successfully', 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const product = await productService.update(req.params.id, req.body, files);
  return sendSuccess(res, product, 'Product updated successfully');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await productService.delete(req.params.id);
  return sendSuccess(res, null, 'Product deleted successfully');
});
