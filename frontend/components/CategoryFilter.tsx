"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value); else params.delete("category");
    params.delete("page");
    router.push(`${pathname}?${params}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
      <button
        onClick={() => select("")}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-black border transition ${
          !active ? "cat-pill-active border-[#2874f0]" : "bg-white border-gray-200 text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0]"
        }`}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(cat.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-black border transition ${
            active === cat.slug ? "cat-pill-active border-[#2874f0]" : "bg-white border-gray-200 text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0]"
          }`}
        >
          {cat.name} <span className="opacity-60">({cat.product_count})</span>
        </button>
      ))}
    </div>
  );
}
