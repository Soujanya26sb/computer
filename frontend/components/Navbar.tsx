"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone";
const PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const isAdminArea = pathname.startsWith("/admin");

  useEffect(() => {
    void getCategories()
      .then((items) => setCategories(items.filter((i) => i.product_count > 0).slice(0, 12)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setOpen(false);
    }
  }

  if (isAdminArea) return null;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#0d47a1] text-white text-xs font-semibold py-1.5 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-8 marquee-inner whitespace-nowrap">
          {[
            "🔥 Latest Laptops & Desktops In Stock",
            "💻 Gaming PCs | Business Laptops | PC Parts",
            "📞 Call to Order — No Online Payment Required",
            "⚡ Intel Core i9 | AMD Ryzen 9 | RTX 4090 Available",
            "🛡️ Genuine Products | Expert Support",
            "🔥 Latest Laptops & Desktops In Stock",
            "💻 Gaming PCs | Business Laptops | PC Parts",
            "📞 Call to Order — No Online Payment Required",
            "⚡ Intel Core i9 | AMD Ryzen 9 | RTX 4090 Available",
            "🛡️ Genuine Products | Expert Support",
          ].map((t, i) => (
            <span key={i} className="mx-6">{t}</span>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-50 nav-gradient transition-shadow duration-300 ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.28)]" : ""}`}>
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 mr-2" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-2 ring-white/30 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white">
                <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div className="leading-none hidden sm:block">
              <div className="text-[11px] font-black text-blue-200 italic">Explore.</div>
              <div className="text-lg font-black text-white tracking-tight">{SHOP_NAME}</div>
            </div>
          </Link>

          {/* Categories dropdown */}
          <div ref={catRef} className="relative hidden lg:block shrink-0">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 px-3 py-2 text-sm font-bold text-white transition"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Categories
              <svg viewBox="0 0 24 24" fill="none" className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`}>
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
            {catOpen && (
              <div className="slide-down absolute left-0 top-full mt-2 w-72 rounded-xl bg-white shadow-[0_12px_48px_rgba(0,0,0,0.22)] border border-gray-100 overflow-hidden z-50">
                <div className="bg-[#2874f0] px-4 py-3">
                  <p className="text-xs font-black text-white uppercase tracking-wider">All Categories</p>
                </div>
                <div className="py-2 max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#2874f0] transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400 font-medium">{cat.product_count}</span>
                    </Link>
                  ))}
                  <Link href="/categories" onClick={() => setCatOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-black text-[#2874f0] hover:bg-blue-50 border-t border-gray-100 mt-1">
                    View all categories →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, desktops, PC parts, brands..."
              className="min-w-0 flex-1 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="flex items-center gap-1.5 bg-[#ff9f00] hover:bg-[#f0920a] px-5 py-2.5 text-sm font-black text-white transition shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Right links */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {PHONE && (
              <a href={`tel:${PHONE}`} className="flex flex-col items-center px-3 py-1 text-white hover:bg-white/15 rounded-lg transition">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span className="text-[10px] font-bold mt-0.5">Call</span>
              </a>
            )}
            <Link href="/products" className="flex flex-col items-center px-3 py-1 text-white hover:bg-white/15 rounded-lg transition">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold mt-0.5">Shop</span>
            </Link>
            <Link href="/about" className="flex flex-col items-center px-3 py-1 text-white hover:bg-white/15 rounded-lg transition">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold mt-0.5">About</span>
            </Link>
            <Link href="/contact" className="flex flex-col items-center px-3 py-1 text-white hover:bg-white/15 rounded-lg transition">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold mt-0.5">Contact</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 transition shrink-0"
            aria-label="Menu"
          >
            <span className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {/* Sub-nav */}
        <div className="hidden lg:block bg-[#1a5dc8] border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto hide-scrollbar">
            {[
              ["🏠 Home", "/"],
              ["💻 Laptops", "/products?category=laptops"],
              ["🖥️ Desktops", "/products?category=desktop-computers"],
              ["🎮 Gaming", "/products?search=gaming"],
              ["⚡ Processors", "/products?category=processors"],
              ["🎨 Graphics Cards", "/products?category=graphics-cards"],
              ["💾 Storage", "/products?category=storage"],
              ["🧠 RAM", "/products?category=ram"],
              ["🔌 Accessories", "/products?category=accessories"],
              ["⭐ Featured", "/products?featured=true"],
              ["🆕 New Arrivals", "/products?sortBy=newest"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 px-3 py-2 text-xs font-bold text-blue-100 hover:text-white hover:bg-white/10 rounded transition whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden bg-[#1a5dc8] transition-all duration-300 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="flex mb-3 overflow-hidden rounded-lg bg-white">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none"
              />
              <button type="submit" className="bg-[#ff9f00] px-4 text-white font-black text-sm">Go</button>
            </form>
            {[
              ["Home", "/"],
              ["Shop All", "/products"],
              ["Categories", "/categories"],
              ["About", "/about"],
              ["Contact", "/contact"],
              ["FAQ", "/faq"],
            ].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-bold text-white hover:bg-white/15 transition">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
