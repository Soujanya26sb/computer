import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone";
const PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "";
const EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
const WHATSAPP = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "";

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

const BRANDS = [
  { name: "Intel", color: "#0071c5" },
  { name: "AMD", color: "#ed1c24" },
  { name: "NVIDIA", color: "#76b900" },
  { name: "Dell", color: "#007db8" },
  { name: "HP", color: "#0096d6" },
  { name: "Lenovo", color: "#e2231a" },
  { name: "ASUS", color: "#00539b" },
  { name: "Samsung", color: "#1428a0" },
  { name: "Seagate", color: "#00b140" },
  { name: "Corsair", color: "#f5a623" },
];

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ featured: true, limit: 8 }).catch(() => ({ items: [], meta: undefined })),
    getProducts({ sortBy: "newest", limit: 8 }).catch(() => ({ items: [], meta: undefined })),
  ]);

  const activeCategories = categories.filter((c) => c.product_count > 0);
  const heroProduct = featured.items[0] ?? latest.items[0];

  return (
    <div className="bg-[#f1f3f6]">
      {/* ── HERO ── */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-100 mb-5">
                <span className="h-2 w-2 rounded-full bg-[#ff9f00] pulse-dot" />
                India&apos;s Trusted Computer Store
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Power Your World<br />
                <span className="text-[#ff9f00]">With The Best Tech</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-blue-100">
                Laptops, desktops, PC components and accessories — all genuine, all in stock. Browse, compare specs, and order directly with our team.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary rounded-lg px-7 py-3.5 text-sm font-black uppercase tracking-wider shadow-xl">
                  🛒 Shop Now
                </Link>
                {PHONE && (
                  <a href={`tel:${PHONE}`} className="flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm font-black text-white hover:bg-white/20 transition">
                    📞 Call to Order
                  </a>
                )}
                {WHATSAPP && (
                  <a href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-[#25d366] px-7 py-3.5 text-sm font-black text-white hover:opacity-90 transition">
                    💬 WhatsApp
                  </a>
                )}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
                {[["500+", "Products"], ["100%", "Genuine"], ["Same Day", "Support"]].map(([val, label]) => (
                  <div key={label} className="rounded-xl bg-white/10 p-3 text-center">
                    <p className="text-lg font-black text-white">{val}</p>
                    <p className="text-xs text-blue-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero product card */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl" />
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-200">⭐ Featured Product</p>
                    <p className="mt-1 text-lg font-black text-white line-clamp-1">{heroProduct?.name || "Top Laptops & Desktops"}</p>
                  </div>
                  <span className="rounded-full bg-[#ff9f00] px-3 py-1 text-xs font-black text-white">LIVE</span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/90 shadow-inner">
                  {heroProduct?.images?.[0] ? (
                    <Image src={heroProduct.images[0].url} alt={heroProduct.name} fill priority className="object-contain p-6" sizes="480px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg viewBox="0 0 24 24" fill="none" className="h-20 w-20 mx-auto mb-2">
                          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="font-black text-lg">{SHOP_NAME}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Laptops", "Desktops", "PC Parts"].map((item) => (
                    <div key={item} className="rounded-xl bg-white/10 py-2 text-center text-xs font-black text-white">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <div className="bg-white border-b border-gray-200 py-4 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 rounded-full bg-[#2874f0]" />
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">Top Brands</p>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
            {BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-black text-gray-700 hover:border-[#2874f0] hover:text-[#2874f0] hover:bg-blue-50 transition"
                style={{ borderLeftColor: brand.color, borderLeftWidth: 3 }}
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="section-header">
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Find exactly what you need</p>
          </div>
          <Link href="/categories" className="text-sm font-black text-[#2874f0] hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {activeCategories.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-[#2874f0] hover:shadow-[0_8px_30px_rgba(40,116,240,0.15)] transition hover:-translate-y-1"
            >
              <span className="text-3xl mb-2">{CAT_ICONS[cat.slug] || "🔧"}</span>
              <p className="text-sm font-black text-gray-900 group-hover:text-[#2874f0] transition">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.product_count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.items.length > 0 && (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="section-header">
                <h2 className="text-2xl font-black text-gray-900">⭐ Featured Products</h2>
                <p className="text-sm text-gray-500 mt-1">Handpicked by our experts</p>
              </div>
              <Link href="/products?featured=true" className="text-sm font-black text-[#2874f0] hover:underline">View All →</Link>
            </div>
            <ProductGrid products={featured.items} />
          </div>
        </section>
      )}

      {/* ── PROMO BANNER ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🎮", title: "Gaming Setups", desc: "RTX 4090 · i9 · 32GB RAM", href: "/products?search=gaming", color: "from-purple-600 to-indigo-700" },
            { icon: "💼", title: "Business Laptops", desc: "Thin, light, powerful", href: "/products?search=business", color: "from-[#2874f0] to-[#0d47a1]" },
            { icon: "⚡", title: "PC Upgrades", desc: "SSD · RAM · GPU upgrades", href: "/products?category=storage", color: "from-orange-500 to-red-600" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-r ${item.color} p-5 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition`}
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <p className="text-lg font-black">{item.title}</p>
                <p className="text-sm text-white/80">{item.desc}</p>
                <p className="mt-1 text-xs font-black text-white/70 group-hover:text-white transition">Shop Now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LATEST ARRIVALS ── */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="section-header">
            <h2 className="text-2xl font-black text-gray-900">🆕 Latest Arrivals</h2>
            <p className="text-sm text-gray-500 mt-1">Fresh stock just added</p>
          </div>
          <Link href="/products?sortBy=newest" className="text-sm font-black text-[#2874f0] hover:underline">See All →</Link>
        </div>
        <ProductGrid products={latest.items} />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">How Ordering Works</h2>
            <p className="text-sm text-gray-500 mt-2">Simple, safe, no online payment required</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", icon: "🔍", title: "Browse Products", desc: "Search and filter our full catalog of laptops, desktops and PC parts." },
              { step: "02", icon: "📋", title: "Submit Enquiry", desc: "Click 'Order Enquiry', fill your name, email and phone number." },
              { step: "03", icon: "📞", title: "We Contact You", desc: "Our team calls or emails to confirm availability and pricing." },
              { step: "04", icon: "✅", title: "Confirm & Collect", desc: "Confirm your order and collect in-store or arrange delivery." },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2874f0] px-3 py-0.5 text-xs font-black text-white">{item.step}</span>
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-black text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-5">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {PHONE && (
              <a href={`tel:${PHONE}`} className="btn-blue rounded-lg px-8 py-3.5 text-sm font-black uppercase tracking-wider shadow-lg">
                📞 Call Now: {PHONE}
              </a>
            )}
            {EMAIL && (
              <a href={`mailto:${EMAIL}`} className="rounded-lg border-2 border-[#2874f0] px-8 py-3.5 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition uppercase tracking-wider">
                ✉️ Email Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="section-header mb-8">
          <h2 className="text-2xl font-black text-gray-900">Why Choose {SHOP_NAME}?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🛡️", title: "100% Genuine Products", desc: "All products are sourced directly from authorized distributors. No counterfeits, ever." },
            { icon: "💰", title: "Best Price Guarantee", desc: "We match or beat competitor prices on identical products. Ask us!" },
            { icon: "🔧", title: "Expert Tech Advice", desc: "Our team helps you choose the right laptop, desktop or component for your needs." },
            { icon: "⚡", title: "Fast Stock Updates", desc: "Inventory is updated in real-time. What you see is what we have." },
            { icon: "📦", title: "Careful Packaging", desc: "All products are packed securely to prevent damage during transit." },
            { icon: "🤝", title: "After-Sales Support", desc: "We're here after your purchase for setup help, warranty claims and upgrades." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#2874f0] hover:shadow-md transition">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-black text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
