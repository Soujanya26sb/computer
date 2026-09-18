import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import StockBadge from "./StockBadge";
import { formatCurrency } from "@/lib/format";

function StarRating({ score = 4.2, count = 0 }: { score?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="rating-badge">
        {score.toFixed(1)}
        <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5">
          <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
        </svg>
      </span>
      {count > 0 && <span className="text-xs text-gray-500">({count.toLocaleString()})</span>}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const fakeOriginal = Math.round(product.price * 1.18);
  const discount = Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);
  const fakeRating = 3.8 + ((product.id.charCodeAt(0) % 12) / 10);
  const fakeReviews = 120 + (product.id.charCodeAt(0) % 880);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        {product.isFeatured && (
          <span className="absolute left-3 top-3 z-10 fk-badge">Featured</span>
        )}
        {product.stockStatus === "LOW_STOCK" && (
          <span className="absolute right-3 top-3 z-10 offer-badge">Low Stock</span>
        )}
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            className="object-contain p-6 drop-shadow-md transition duration-400 group-hover:scale-105"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16">
              <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold">No Image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#2874f0] mb-1">{product.categoryName}</p>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-snug min-h-[40px] group-hover:text-[#2874f0] transition">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 truncate">{product.brand} · {product.model}</p>

        <div className="mt-2">
          <StarRating score={fakeRating} count={fakeReviews} />
        </div>

        <div className="mt-3 flex items-end gap-2 flex-wrap">
          <span className="text-xl font-black text-gray-900">{formatCurrency(product.price)}</span>
          <span className="price-strike text-sm">{formatCurrency(fakeOriginal)}</span>
          <span className="text-sm font-black text-green-600">{discount}% off</span>
        </div>

        <div className="mt-2">
          <StockBadge status={product.stockStatus} />
        </div>

        <div className="mt-4 btn-primary px-4 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded">
          View Details & Order
        </div>
      </div>
    </Link>
  );
}
