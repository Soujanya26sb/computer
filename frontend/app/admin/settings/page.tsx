"use client";

import { useAuth } from "@/lib/auth";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-4">Admin Profile</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2874f0] text-2xl font-black text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{user?.name || "Admin"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="mt-1 inline-flex rounded-full bg-[#2874f0]/10 px-3 py-0.5 text-xs font-black text-[#2874f0]">ADMIN</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            ["Email", user?.email || "—"],
            ["Role", user?.role || "ADMIN"],
            ["Access Level", "Full admin access — products, categories, orders, customers"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</p>
              <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-black uppercase tracking-wider text-amber-700 mb-2">Security Note</p>
        <p className="text-sm text-amber-800 leading-6">
          To change your admin password, update <code className="bg-amber-100 px-1 rounded">INITIAL_ADMIN_PASSWORD</code> in <code className="bg-amber-100 px-1 rounded">backend/.env</code> and re-run <code className="bg-amber-100 px-1 rounded">npm run create-admin</code>.
        </p>
      </div>
    </div>
  );
}
