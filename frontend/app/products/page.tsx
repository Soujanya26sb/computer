"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, PaginationMeta, Product, ProductFilters } from "@/types";
import ProductGrid from "@/components/ProductGrid";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

const SORT_OPTIONS = [
  ["newest", "Newest First"],
  ["price_asc", "Price: Low to High"],
  ["price_desc", "Price: High to Low"],
  ["name_asc", "Name: A–Z"],
  ["name_desc", "Name: Z–A"],
];

const PRICE_RANGES = [
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 – ₹25,000", min: 10000, max: 25000 },
  { label: "₹25,000 – ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 – ₹75,000", min: 50000, max: 75000 },
  { label: "₹75,000 – ₹1,00,000", min: 75000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: 0 },
];

function AccordionFilter({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition"
      >
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allBrands, setAllBrands] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filters: ProductFilters = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      minPrice: Number(searchParams.get("minPrice")) || undefined,
      maxPrice: Number(searchParams.get("maxPrice")) || undefined,
      sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "newest",
      page: Number(searchParams.get("page") || 1),
      limit: 16,
      featured: searchParams.get("featured") === "true" ? true : undefined,
    };
    try {
      const [catData, prodData] = await Promise.all([getCategories(), getProducts(filters)]);
      setCategories(catData.filter((c) => c.product_count > 0));
      setProducts(prodData.items);
      setMeta(prodData.meta || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  useEffect(() => {
    if (products.length > 0) {
      setAllBrands((prev) =>
        Array.from(new Set([...prev, ...products.map((p) => p.brand)])).sort()
      );
    }
  }, [products]);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPriceRange(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString());
    const currentMin = searchParams.get("minPrice");
    const currentMax = searchParams.get("maxPrice");
    // Toggle off if already selected
    if (currentMin === String(min) && currentMax === (max ? String(max) : "")) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", String(min));
      if (max) params.set("maxPrice", String(max)); else params.delete("maxPrice");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push("/products");
  }

  function changePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeSort = searchParams.get("sortBy") || "newest";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const hasFilters = !!(
    searchParams.get("search") || activeCategory || activeBrand ||
    activeMinPrice || activeMaxPrice || searchParams.get("featured")
  );

  const activePriceRange = PRICE_RANGES.find(
    (r) => String(r.min) === activeMinPrice && (r.max ? String(r.max) === activeMaxPrice : !activeMaxPrice)
  );

  const SidebarContent = (
    <div>
      {/* Sort By */}
      <AccordionFilter title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setParam("sortBy", val)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                activeSort === val
                  ? "bg-[#2874f0] text-white font-bold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </AccordionFilter>

      {/* Category */}
      <AccordionFilter title="Category">
        <div className="space-y-1">
          <button
            onClick={() => setParam("category", "")}
            className={`w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              !activeCategory
                ? "bg-[#2874f0] text-white font-bold"
                : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", cat.slug)}
              className={`w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                activeCategory === cat.slug
                  ? "bg-[#2874f0] text-white font-bold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className={`text-xs shrink-0 rounded-full px-1.5 py-0.5 ${activeCategory === cat.slug ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {cat.product_count}
              </span>
            </button>
          ))}
        </div>
      </AccordionFilter>

      {/* Price Range */}
      <AccordionFilter title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              activeMinPrice === String(range.min) &&
              (range.max ? activeMaxPrice === String(range.max) : !activeMaxPrice);
            return (
              <button
                key={range.label}
                onClick={() => applyPriceRange(range.min, range.max)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#2874f0] text-white font-bold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </AccordionFilter>

      {/* Brand */}
      {allBrands.length > 0 && (
        <AccordionFilter title="Brand">
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            <button
              onClick={() => setParam("brand", "")}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                !activeBrand
                  ? "bg-[#2874f0] text-white font-bold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
              }`}
            >
              All Brands
            </button>
            {allBrands.map((b) => (
              <button
                key={b}
                onClick={() => setParam("brand", b)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                  activeBrand === b
                    ? "bg-[#2874f0] text-white font-bold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </AccordionFilter>
      )}

      {/* Clear all */}
      {hasFilters && (
        <div className="px-4 py-3">
          <button
            onClick={clearAll}
            className="w-full rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition"
          >
            ✕ Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      {/* Page header */}
      <div className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black sm:text-3xl">
            {searchParams.get("search")
              ? `Results for "${searchParams.get("search")}"`
              : activeCategory
              ? (categories.find((c) => c.slug === activeCategory)?.name || "Products")
              : "All Products"}
          </h1>
          {meta && !loading && (
            <p className="mt-1 text-sm text-blue-200">
              {meta.total} product{meta.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-5">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-[76px] rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-[#2874f0] px-4 py-3">
                <p className="text-sm font-black uppercase tracking-wider text-white">Filters</p>
              </div>
              {SidebarContent}
            </div>
          </aside>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-2xl lg:hidden">
                <div className="flex items-center justify-between bg-[#2874f0] px-4 py-3">
                  <p className="text-sm font-black uppercase tracking-wider text-white">Filters</p>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
                </div>
                {SidebarContent}
              </div>
            </>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition lg:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Filters
                  {hasFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2874f0] text-[10px] font-black text-white">!</span>}
                </button>

                {/* Active filter chips */}
                {searchParams.get("search") && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-[#2874f0]">
                    &quot;{searchParams.get("search")}&quot;
                    <button onClick={() => setParam("search", "")} className="hover:text-red-500 ml-0.5">✕</button>
                  </span>
                )}
                {activeCategory && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-[#2874f0]">
                    {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
                    <button onClick={() => setParam("category", "")} className="hover:text-red-500 ml-0.5">✕</button>
                  </span>
                )}
                {activeBrand && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-[#2874f0]">
                    {activeBrand}
                    <button onClick={() => setParam("brand", "")} className="hover:text-red-500 ml-0.5">✕</button>
                  </span>
                )}
                {activePriceRange && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-[#2874f0]">
                    {activePriceRange.label}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("minPrice"); params.delete("maxPrice");
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="hover:text-red-500 ml-0.5"
                    >✕</button>
                  </span>
                )}
                {hasFilters && (
                  <button onClick={clearAll} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-black text-red-600 hover:bg-red-100 transition">
                    Clear all
                  </button>
                )}
              </div>

              {meta && !loading && (
                <span className="text-xs text-gray-400 shrink-0 hidden sm:inline">
                  {meta.total} items
                </span>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <LoadingState message="Loading products..." />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchData} />
            ) : (
              <ProductGrid products={products} emptyMessage="No products match your filters." />
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && !loading && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => changePage(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0] disabled:opacity-40 transition"
                >
                  ← Prev
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-black transition ${
                      page === meta.page
                        ? "bg-[#2874f0] text-white shadow"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => changePage(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0] disabled:opacity-40 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading products..." />}>
      <ProductsContent />
    </Suspense>
  );
}
