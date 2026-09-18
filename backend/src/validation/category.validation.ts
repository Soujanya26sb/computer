import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name is required').max(120),
    description: z.string().max(500).optional().nullable(),
    icon: z.string().max(60).optional().nullable(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(500).optional().nullable(),
    icon: z.string().max(60).optional().nullable(),
  }),
  query: z.any().optional(),
  params: z.object({ id: z.string().uuid('Invalid category id') }),
});

export const idParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ id: z.string().uuid('Invalid id') }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body'];
