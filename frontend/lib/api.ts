import type { ApiResponse, Category, Order, Product, ProductFilters } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiFetch<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ items: Product[]; meta: ApiResponse<Product[]>["meta"] }> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.stockStatus) params.set("stockStatus", filters.stockStatus);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.featured !== undefined) params.set("featured", String(filters.featured));

  const qs = params.toString();
  const res = await apiFetch<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  return { items: res.data, meta: res.meta };
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await apiFetch<Product>(`/products/slug/${slug}`);
  return res.data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch<Category[]>("/categories");
  return res.data;
}

export async function createOrder(body: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<Order> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Order failed");
  }
  return data.data;
}
