import slugify from 'slugify';
import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';

export const categoryService = {
  async list() {
    return categoryRepository.findAllWithProductCount();
  },

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  },

  async create(data: { name: string; description?: string | null; icon?: string | null }) {
    const slug = slugify(data.name, { lower: true, strict: true });
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) throw ApiError.conflict('A category with this name already exists');
    return categoryRepository.create({ ...data, slug });
  },

  async update(
    id: string,
    data: { name?: string; description?: string | null; icon?: string | null }
  ) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');

    let slug: string | undefined;
    if (data.name && data.name !== existing.name) {
      slug = slugify(data.name, { lower: true, strict: true });
      const slugOwner = await categoryRepository.findBySlug(slug);
      if (slugOwner && slugOwner.id !== id) {
        throw ApiError.conflict('A category with this name already exists');
      }
    }

    const updated = await categoryRepository.update(id, { ...data, slug });
    return updated;
  },

  async delete(id: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');

    const productCount = await categoryRepository.countProductsInCategory(id);
    if (productCount > 0) {
      throw ApiError.conflict(
        `Cannot delete category with ${productCount} product(s) assigned to it. Reassign or remove those products first.`
      );
    }

    await categoryRepository.delete(id);
  },
};
