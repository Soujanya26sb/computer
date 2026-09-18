"use client";

import { usePathname } from "next/navigation";

interface Props { onMenuClick: () => void; }

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Customer Enquiries",
  "/admin/products": "Products",
  "/admin/products/new": "Add New Product",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/settings": "Settings",
};

export default function AdminHeader({ onMenuClick }: Props) {
  const pathname = usePathname();
  const title = TITLES[pathname] || (pathname.includes("/edit") ? "Edit Product" : "Admin");

  return (
    <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3.5 shadow-sm sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2874f0]">Admin Panel</p>
        <h1 className="text-xl font-black text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-black text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 pulse-dot" />
          System Online
        </span>
      </div>
    </header>
  );
}
