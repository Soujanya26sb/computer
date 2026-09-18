import Link from "next/link";

const NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone";
const PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "";
const EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
const ADDRESS = process.env.NEXT_PUBLIC_SHOP_ADDRESS || "";
const WHATSAPP = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "";

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-300">
      {/* Trust bar */}
      <div className="bg-[#1e2d42] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🚚", title: "Direct Ordering", desc: "Call or email to confirm" },
              { icon: "🛡️", title: "Genuine Products", desc: "100% authentic hardware" },
              { icon: "🔧", title: "Expert Support", desc: "Tech advice included" },
              { icon: "💳", title: "No Online Payment", desc: "Safe in-store process" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-black text-white">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2874f0] text-white shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <div className="text-xs font-black text-blue-400 italic">Explore.</div>
                <div className="text-lg font-black text-white">{NAME}</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-gray-400 max-w-xs">
              Your trusted local store for laptops, desktops, PC components, and accessories. Real inventory, real support.
            </p>
            <div className="mt-5 flex gap-3">
              {WHATSAPP && (
                <a href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white hover:opacity-90 transition text-sm font-black">
                  W
                </a>
              )}
              {PHONE && (
                <a href={`tel:${PHONE}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2874f0] text-white hover:opacity-90 transition">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4 section-header">Shop</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/products" className="block hover:text-white transition">All Products</Link>
              <Link href="/products?category=laptops" className="block hover:text-white transition">Laptops</Link>
              <Link href="/products?category=desktop-computers" className="block hover:text-white transition">Desktop Computers</Link>
              <Link href="/products?category=graphics-cards" className="block hover:text-white transition">Graphics Cards</Link>
              <Link href="/products?category=processors" className="block hover:text-white transition">Processors</Link>
              <Link href="/products?category=storage" className="block hover:text-white transition">Storage (SSD/HDD)</Link>
              <Link href="/products?category=ram" className="block hover:text-white transition">RAM / Memory</Link>
              <Link href="/products?featured=true" className="block hover:text-white transition">⭐ Featured Products</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4 section-header">Information</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/about" className="block hover:text-white transition">About Us</Link>
              <Link href="/contact" className="block hover:text-white transition">Contact</Link>
              <Link href="/faq" className="block hover:text-white transition">FAQ</Link>
              <Link href="/categories" className="block hover:text-white transition">All Categories</Link>
              <Link href="/products?sortBy=newest" className="block hover:text-white transition">New Arrivals</Link>
              <Link href="/admin/login" className="block text-gray-500 hover:text-gray-300 transition mt-4 text-xs">Admin Login</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4 section-header">Contact Us</h3>
            <div className="space-y-3 text-sm">
              {ADDRESS && (
                <div className="flex gap-2">
                  <span className="text-[#2874f0] mt-0.5 shrink-0">📍</span>
                  <p className="text-gray-400 leading-5">{ADDRESS}</p>
                </div>
              )}
              {PHONE && (
                <div className="flex gap-2 items-center">
                  <span className="text-[#2874f0] shrink-0">📞</span>
                  <a href={`tel:${PHONE}`} className="hover:text-white transition">{PHONE}</a>
                </div>
              )}
              {EMAIL && (
                <div className="flex gap-2 items-center">
                  <span className="text-[#2874f0] shrink-0">✉️</span>
                  <a href={`mailto:${EMAIL}`} className="hover:text-white transition break-all">{EMAIL}</a>
                </div>
              )}
              <div className="mt-4 rounded-xl bg-[#2874f0]/15 border border-[#2874f0]/30 p-4">
                <p className="text-xs font-black text-blue-300 uppercase tracking-wider mb-1">How to Order</p>
                <p className="text-xs text-gray-400 leading-5">Browse products → Click "Order Enquiry" → Fill your details → Call or email us to confirm.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {NAME}. All rights reserved.</p>
          <p>Laptops · Desktops · PC Parts · Accessories</p>
        </div>
      </div>
    </footer>
  );
}
