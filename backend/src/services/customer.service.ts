import { userRepository, UserRecord } from '../repositories/user.repository';

function serializeCustomer(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export const customerService = {
  async list(query: { search?: string; page?: number; limit?: number }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
    const { items, total } = await userRepository.listCustomers({
      search: query.search,
      page,
      limit,
    });

    return {
      items: items.map(serializeCustomer),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
};
