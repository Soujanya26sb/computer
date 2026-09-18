"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetStats } from "@/lib/adminApi";

interface Stats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalCategories: number;
  totalCustomers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  const cards = stats
    ? [
        { label: "Total Products", value: stats.totalProducts, icon: "💻", color: "bg-[#2874f0]", href: "/admin/products" },
        { label: "In Stock", value: stats.inStock, icon: "✅", color: "bg-green-600", href: "/admin/products?stockStatus=IN_STOCK" },
        { label: "Low Stock", value: stats.lowStock, icon: "⚠️", color: "bg-amber-500", href: "/admin/products?stockStatus=LOW_STOCK" },
        { label: "Out of Stock", value: stats.outOfStock, icon: "❌", color: "bg-red-600", href: "/admin/products?stockStatus=OUT_OF_STOCK" },
        { label: "Categories", value: stats.totalCategories, icon: "🗂️", color: "bg-purple-600", href: "/admin/categories" },
        { label: "Customers", value: stats.totalCustomers, icon: "👥", color: "bg-slate-700", href: "/admin/customers" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!stats && !error && (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2874f0] border-t-transparent" />
        </div>
      )}

      {stats && (
        <>
          {/* Welcome banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#2874f0] to-[#0d47a1] p-6 text-white shadow-lg">
            <p className="text-sm font-black text-blue-200 uppercase tracking-wider">Welcome back</p>
            <h2 className="mt-1 text-2xl font-black">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-blue-200">Manage your computer shop inventory, orders and customers.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/admin/products/new" className="rounded-lg bg-white px-5 py-2.5 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition">
                + Add Product
              </Link>
              <Link href="/admin/orders" className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-black text-white hover:bg-white/20 transition">
                View Enquiries
              </Link>
              <Link href="/" target="_blank" className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-black text-white hover:bg-white/20 transition">
                🌐 Customer Site ↗
              </Link>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className={`${card.color} mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-sm`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-gray-900">{card.value}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{card.label}</p>
              </Link>
            ))}
          </div>

          {/* Quick actions + stock overview */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-black text-gray-900 mb-4 section-header">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/admin/products/new" className="flex items-center gap-3 rounded-xl bg-[#2874f0] px-4 py-3 text-sm font-bold text-white hover:bg-[#1a5dc8] transition">
                  <span>➕</span> Add New Product
                </Link>
                <Link href="/admin/categories" className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                  <span>🗂️</span> Manage Categories
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                  <span>📋</span> View Customer Enquiries
                </Link>
                {stats.lowStock > 0 && (
                  <Link href="/admin/products?stockStatus=LOW_STOCK" className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 hover:bg-amber-100 transition">
                    <span>⚠️</span> {stats.lowStock} Low Stock Items — Review Now
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-black text-gray-900 mb-4 section-header">Stock Overview</h2>
              <div className="space-y-4">
                {[
                  { label: "In Stock", value: stats.inStock, total: stats.totalProducts, color: "bg-green-500" },
                  { label: "Low Stock", value: stats.lowStock, total: stats.totalProducts, color: "bg-amber-500" },
                  { label: "Out of Stock", value: stats.outOfStock, total: stats.totalProducts, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-600">{item.label}</span>
                      <span className="font-black text-gray-900">{item.value} / {item.total}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-700`}
                        style={{ width: item.total > 0 ? `${(item.value / item.total) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
