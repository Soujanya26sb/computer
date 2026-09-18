import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.list();
  return sendSuccess(res, categories, 'Categories retrieved');
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id);
  return sendSuccess(res, category, 'Category retrieved');
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);
  return sendSuccess(res, category, 'Category created successfully', 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.update(req.params.id, req.body);
  return sendSuccess(res, category, 'Category updated successfully');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.delete(req.params.id);
  return sendSuccess(res, null, 'Category deleted successfully');
});
