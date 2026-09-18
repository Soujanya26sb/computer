import Link from "next/link";
import { getCategories } from "@/lib/api";

const CAT_ICONS: Record<string, string> = {
  laptops: "💻",
  "desktop-computers": "🖥️",
  processors: "⚡",
  "graphics-cards": "🎨",
  storage: "💾",
  ram: "🧠",
  motherboards: "🔌",
  monitors: "🖥",
  keyboards: "⌨️",
  mice: "🖱️",
  cooling: "❄️",
  accessories: "🔧",
};

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div className="bg-[#f1f3f6]">
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-3">Browse</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Shop by Category</h1>
          <p className="mt-3 text-sm text-blue-200">Find exactly what you need — from laptops to PC parts.</p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#2874f0] hover:shadow-[0_8px_30px_rgba(40,116,240,0.15)] hover:-translate-y-1 transition"
            >
              <span className="text-4xl shrink-0">{CAT_ICONS[cat.slug] || "🔧"}</span>
              <div className="min-w-0">
                <h2 className="font-black text-gray-900 group-hover:text-[#2874f0] transition">{cat.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{cat.product_count} products</p>
                {cat.description && <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-4">{cat.description}</p>}
              </div>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gray-300 group-hover:text-[#2874f0] shrink-0 transition">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
