const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || "";
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data.data;
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function adminGetProducts(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const token = getToken();
  const res = await fetch(`${API_URL}/products${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  return { items: data.data, meta: data.meta };
}

export async function adminGetProductById(id: string) {
  return authFetch<import("@/types").Product>(`/products/${id}`);
}

export async function adminCreateProduct(formData: FormData) {
  return authFetch<import("@/types").Product>("/products", {
    method: "POST",
    body: formData,
  });
}

export async function adminUpdateProduct(id: string, formData: FormData) {
  return authFetch<import("@/types").Product>(`/products/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function adminDeleteProduct(id: string) {
  return authFetch<null>(`/products/${id}`, { method: "DELETE" });
}

export async function adminGetStats() {
  return authFetch<{
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalCategories: number;
    totalCustomers: number;
  }>("/products/stats");
}

export async function adminGetCustomers(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const token = getToken();
  const res = await fetch(`${API_URL}/customers${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  return { items: data.data, meta: data.meta } as {
    items: Array<{
      id: string;
      name: string;
      email: string;
      role: "CUSTOMER";
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    meta: import("@/types").PaginationMeta;
  };
}

export async function adminGetOrders(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const token = getToken();
  const res = await fetch(`${API_URL}/orders${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  return { items: data.data, meta: data.meta } as {
    items: import("@/types").Order[];
    meta: import("@/types").PaginationMeta;
  };
}

export async function adminUpdateOrderStatus(id: string, status: import("@/types").OrderStatus) {
  return authFetch<import("@/types").Order>(`/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function adminGetOrderStats() {
  return authFetch<{
    totalOrders: number;
    newOrders: number;
    activeOrders: number;
    completedOrders: number;
  }>("/orders/stats");
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminGetCategories() {
  const token = getToken();
  const res = await fetch(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  return data.data as import("@/types").Category[];
}

export async function adminCreateCategory(body: {
  name: string;
  description?: string;
  icon?: string;
}) {
  return authFetch<import("@/types").Category>("/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function adminUpdateCategory(
  id: string,
  body: { name?: string; description?: string; icon?: string }
) {
  return authFetch<import("@/types").Category>(`/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function adminDeleteCategory(id: string) {
  return authFetch<null>(`/categories/${id}`, { method: "DELETE" });
}
