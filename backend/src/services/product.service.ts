import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { env, uploadAbsolutePath } from '../config/env';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository, ProductRecord } from '../repositories/product.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { getStockStatus } from '../utils/stockStatus';

export interface ListProductsQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
  featured?: boolean;
}

function serializeProduct(product: ProductRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.category_id,
    categoryName: product.category_name,
    categorySlug: product.category_slug,
    brand: product.brand,
    model: product.model,
    price: Number(product.price),
    stockQuantity: product.stock_quantity,
    stockStatus: getStockStatus(product.stock_quantity),
    shortDescription: product.short_description,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    isFeatured: product.is_featured,
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    images: (product.images ?? []).map((img) => ({
      id: img.id,
      url: img.image_url,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
    })),
  };
}

function deleteImageFile(imageUrl: string) {
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadAbsolutePath, 'products', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-fatal: file may already be removed
  }
}

export const productService = {
  async list(query: ListProductsQuery, includeInactive = false) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 12;

    const { items, total } = await productRepository.list({
      search: query.search,
      categorySlug: query.category,
      brand: query.brand,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      stockStatus: query.stockStatus,
      sortBy: query.sortBy,
      page,
      limit,
      featured: query.featured,
      includeInactive,
      lowStockThreshold: env.stock.lowStockThreshold,
      outOfStockThreshold: env.stock.outOfStockThreshold,
    });

    return {
      items: items.map(serializeProduct),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async getById(id: string, includeInactive = false) {
    const product = await productRepository.findById(id, includeInactive);
    if (!product) throw ApiError.notFound('Product not found');
    return serializeProduct(product);
  },

  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw ApiError.notFound('Product not found');
    return serializeProduct(product);
  },

  async create(
    data: {
      name: string;
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
    },
    imageFiles: Express.Multer.File[]
  ) {
    const category = await categoryRepository.findById(data.category_id);
    if (!category) throw ApiError.badRequest('Selected category does not exist');

    let baseSlug = slugify(data.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await productRepository.slugExists(slug)) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const product = await productRepository.create({ ...data, slug });

    if (imageFiles.length > 0) {
      const images = imageFiles.map((file, index) => ({
        image_url: `${env.baseUrl}/uploads/products/${file.filename}`,
        is_primary: index === 0,
        sort_order: index,
      }));
      await productRepository.addImages(product.id, images);
    }

    const withImages = await productRepository.findById(product.id, true);
    return serializeProduct(withImages as ProductRecord);
  },

  async update(
    id: string,
    data: {
      name?: string;
      category_id?: string;
      brand?: string;
      model?: string;
      price?: number;
      stock_quantity?: number;
      short_description?: string;
      description?: string;
      features?: string[];
      specifications?: Record<string, string>;
      is_featured?: boolean;
      is_active?: boolean;
      remove_image_ids?: string[];
    },
    newImageFiles: Express.Multer.File[]
  ) {
    const existing = await productRepository.findById(id, true);
    if (!existing) throw ApiError.notFound('Product not found');

    if (data.category_id) {
      const category = await categoryRepository.findById(data.category_id);
      if (!category) throw ApiError.badRequest('Selected category does not exist');
    }

    let slug: string | undefined;
    if (data.name && data.name !== existing.name) {
      const baseSlug = slugify(data.name, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;
      while (await productRepository.slugExists(slug, id)) {
        counter += 1;
        slug = `${baseSlug}-${counter}`;
      }
    }

    const { remove_image_ids, ...productFields } = data;

    await productRepository.update(id, { ...productFields, slug });

    if (remove_image_ids && remove_image_ids.length > 0) {
      const imagesToRemove = (existing.images ?? []).filter((img) =>
        remove_image_ids.includes(img.id)
      );
      await productRepository.removeImages(id, remove_image_ids);
      imagesToRemove.forEach((img) => deleteImageFile(img.image_url));
    }

    if (newImageFiles.length > 0) {
      const currentImages = await productRepository.getImages(id);
      const images = newImageFiles.map((file, index) => ({
        image_url: `${env.baseUrl}/uploads/products/${file.filename}`,
        is_primary: currentImages.length === 0 && index === 0,
        sort_order: currentImages.length + index,
      }));
      await productRepository.addImages(id, images);
    }

    await productRepository.ensurePrimaryImage(id);

    const updated = await productRepository.findById(id, true);
    return serializeProduct(updated as ProductRecord);
  },

  async delete(id: string) {
    const existing = await productRepository.findById(id, true);
    if (!existing) throw ApiError.notFound('Product not found');

    const images = await productRepository.getImages(id);
    const deleted = await productRepository.delete(id);
    if (!deleted) throw ApiError.internal('Failed to delete product');

    images.forEach((img) => deleteImageFile(img.image_url));
  },

  async getStats() {
    const stats = await productRepository.getStats(
      env.stock.lowStockThreshold,
      env.stock.outOfStockThreshold
    );
    const categories = await categoryRepository.findAllWithProductCount();
    return {
      totalProducts: stats.total_products,
      inStock: stats.in_stock,
      lowStock: stats.low_stock,
      outOfStock: stats.out_of_stock,
      totalCategories: categories.length,
      totalCustomers: await userRepository.countByRole('CUSTOMER'),
      stockThresholds: {
        lowStockThreshold: env.stock.lowStockThreshold,
        outOfStockThreshold: env.stock.outOfStockThreshold,
      },
    };
  },
};
