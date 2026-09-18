"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/api";
import type { Product } from "@/types";
import StockBadge from "@/components/StockBadge";
import OrderButton from "@/components/OrderButton";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { formatCurrency } from "@/lib/format";

function StarRating({ score = 4.2, count = 0 }: { score?: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rating-badge text-sm px-2 py-1">
        {score.toFixed(1)}
        <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3">
          <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
        </svg>
      </span>
      <span className="text-sm text-gray-500">{count.toLocaleString()} ratings</span>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        const pi = p.images.findIndex((i) => i.isPrimary);
        setActive(pi >= 0 ? pi : 0);
        getProducts({ category: p.categorySlug, limit: 6 })
          .then((r) => setRelated(r.items.filter((i) => i.id !== p.id).slice(0, 5)))
          .catch(() => {});
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState message="Loading product..." />;
  if (error || !product) return <ErrorState message={error || "Product not found"} />;

  const images = [...product.images].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : a.sortOrder - b.sortOrder));
  const currentImage = images[active] || images[0];
  const fakeOriginal = Math.round(product.price * 1.18);
  const discount = Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);
  const fakeRating = 3.8 + ((product.id.charCodeAt(0) % 12) / 10);
  const fakeReviews = 120 + (product.id.charCodeAt(0) % 880);

  return (
    <div className="bg-[#f1f3f6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Link href="/" className="hover:text-[#2874f0]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#2874f0]">Shop</Link>
            <span>/</span>
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#2874f0]">{product.categoryName}</Link>
            <span>/</span>
            <span className="text-gray-800 font-black truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ height: 420 }}>
              {currentImage ? (
                <Image src={currentImage.url} alt={product.name} fill priority className="object-contain p-8 transition duration-400 hover:scale-105" sizes="(max-width:1024px)100vw,50vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <svg viewBox="0 0 24 24" fill="none" className="h-24 w-24">
                    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              {product.isFeatured && (
                <span className="absolute left-4 top-4 fk-badge">⭐ Featured</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActive(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${active === i ? "border-[#2874f0] shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#2874f0] mb-3">{product.categoryName}</span>
            <h1 className="text-2xl font-black text-gray-900 leading-snug sm:text-3xl">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{product.brand} · {product.model}</p>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <StarRating score={fakeRating} count={fakeReviews} />
              <StockBadge status={product.stockStatus} quantity={product.stockQuantity} />
            </div>

            <div className="mt-5 border-t border-b border-gray-100 py-4">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-4xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                <span className="price-strike text-lg">{formatCurrency(fakeOriginal)}</span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-black text-green-700">{discount}% OFF</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes. No online payment — confirm by phone/email.</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">{product.shortDescription}</p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="font-black">📋 How to Order:</span> Submit your enquiry below → We call/email you → Confirm & collect in-store.
            </div>

            {product.stockStatus !== "OUT_OF_STOCK" && (
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500">Quantity:</span>
                <div className="flex overflow-hidden rounded-lg border-2 border-gray-200">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg font-black text-gray-700 hover:bg-gray-50 transition">−</button>
                  <span className="grid min-w-12 place-items-center border-x-2 border-gray-200 text-sm font-black">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))} className="px-4 py-2 text-lg font-black text-gray-700 hover:bg-gray-50 transition">+</button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <OrderButton product={product} quantity={qty} />
            </div>

            {/* Key features */}
            {product.features.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Key Features</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-[#2874f0] font-black shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Description + Specs */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {product.description && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-2">Product Details</p>
              <h2 className="text-xl font-black text-gray-900 mb-4">Description</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-gray-600">{product.description}</p>
            </section>
          )}

          {Object.keys(product.specifications).length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-2">Technical Data</p>
              <h2 className="text-xl font-black text-gray-900 mb-4">Specifications</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className={`grid grid-cols-[40%_60%] border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="px-4 py-3 text-xs font-black text-gray-600">{key}</div>
                    <div className="px-4 py-3 text-xs text-gray-700">{value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="section-header">
                <h2 className="text-xl font-black text-gray-900">More from {product.categoryName}</h2>
              </div>
              <Link href={`/products?category=${product.categorySlug}`} className="text-sm font-black text-[#2874f0] hover:underline">View All →</Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => {
                const img = item.images.find((i) => i.isPrimary) ?? item.images[0];
                return (
                  <Link key={item.id} href={`/products/${item.slug}`} className="group rounded-xl border border-gray-200 bg-gray-50 p-3 hover:border-[#2874f0] hover:bg-white hover:shadow-md transition">
                    {img && (
                      <div className="relative h-24 mb-2 overflow-hidden rounded-lg bg-white">
                        <Image src={img.url} alt={item.name} fill className="object-contain p-2" sizes="120px" />
                      </div>
                    )}
                    <p className="line-clamp-2 text-xs font-black text-gray-900 group-hover:text-[#2874f0] transition">{item.name}</p>
                    <p className="mt-1 text-sm font-black text-gray-900">{formatCurrency(item.price)}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
