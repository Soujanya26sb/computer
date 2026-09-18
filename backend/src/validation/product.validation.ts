import { z } from 'zod';

// Products are created/updated via multipart/form-data (to support image uploads),
// so numeric/JSON fields arrive as strings and need coercion.

const featuresField = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (val === undefined) return [] as string[];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as string[];
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  });

const specificationsField = z
  .union([z.string(), z.record(z.string())])
  .optional()
  .transform((val) => {
    if (val === undefined) return {} as Record<string, string>;
    if (typeof val === 'object') return val;
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  });

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required').max(200),
    category_id: z.string().uuid('A valid category is required'),
    brand: z.string().min(1, 'Brand is required').max(120),
    model: z.string().min(1, 'Model is required').max(120),
    price: z.coerce.number().positive('Price must be greater than 0'),
    stock_quantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative'),
    short_description: z.string().min(5, 'Short description is required').max(300),
    description: z.string().min(10, 'Detailed description is required'),
    features: featuresField,
    specifications: specificationsField,
    is_featured: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((v) => v === true || v === 'true'),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    category_id: z.string().uuid().optional(),
    brand: z.string().min(1).max(120).optional(),
    model: z.string().min(1).max(120).optional(),
    price: z.coerce.number().positive().optional(),
    stock_quantity: z.coerce.number().int().min(0).optional(),
    short_description: z.string().min(5).max(300).optional(),
    description: z.string().min(10).optional(),
    features: featuresField,
    specifications: specificationsField,
    is_featured: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
    is_active: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
    remove_image_ids: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (val === undefined) return [] as string[];
        if (Array.isArray(val)) return val;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [val];
        } catch {
          return [val];
        }
      }),
  }),
  query: z.any().optional(),
  params: z.object({ id: z.string().uuid('Invalid product id') }),
});

export const listProductsQuerySchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    stockStatus: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
    sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    featured: z.coerce.boolean().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
