"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { adminGetProducts, adminDeleteProduct } from "@/lib/adminApi";
import type { Product, PaginationMeta } from "@/types";
import StockBadge from "@/components/StockBadge";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { limit: "20" };
      const s = searchParams.get("search");
      const st = searchParams.get("stockStatus");
      const sort = searchParams.get("sortBy");
      const p = searchParams.get("page");
      if (s) params.search = s;
      if (st) params.stockStatus = st;
      if (sort) params.sortBy = sort;
      if (p) params.page = p;
      const result = await adminGetProducts(params);
      setProducts(result.items);
      setMeta(result.meta ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParam("search", search);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(deleteTarget.id);
      setToast(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchProducts();
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {toast}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </form>

          <select
            value={searchParams.get("stockStatus") ?? ""}
            onChange={(e) => setParam("stockStatus", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stock</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <select
            value={searchParams.get("sortBy") ?? "newest"}
            onChange={(e) => setParam("sortBy", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading products..." />
      ) : error && products.length === 0 ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const img = p.images.find((i) => i.isPrimary) ?? p.images[0];
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {img ? (
                                <Image src={img.url} alt={p.name} fill className="object-cover" sizes="40px" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-gray-300 text-xs">No img</div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.brand} · {p.model}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.categoryName}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.stockQuantity}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <StockBadge status={p.stockStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 px-4 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </span>
              <button
                onClick={() => setPage(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading..." />}>
      <ProductsContent />
    </Suspense>
  );
}
