"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface Props { open: boolean; onClose: () => void; }

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "💻" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/orders", label: "Enquiries", icon: "📋" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  function handleLogout() { logout(); router.push("/admin/login"); }

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col admin-sidebar text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2874f0] shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16h-13A1.5 1.5 0 0 1 4 14.5v-9ZM9 20h6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-xs text-blue-400 font-bold">Admin Panel</p>
              <p className="text-sm font-black text-white">TechZone</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 lg:hidden">✕</button>
        </div>

        {/* User */}
        {user && (
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2874f0] text-sm font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <span className="mt-2 inline-flex rounded-full bg-[#2874f0]/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-300">
              ADMIN
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${active ? "bg-[#2874f0] text-white shadow-lg shadow-blue-900/30" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 px-3 py-4 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition">
            <span>🌐</span> View Customer Site
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
