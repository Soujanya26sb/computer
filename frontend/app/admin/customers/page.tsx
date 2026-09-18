"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminGetCustomers } from "@/lib/adminApi";
import type { PaginationMeta } from "@/types";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER";
  isActive: boolean;
  createdAt: string;
}

function CustomersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { limit: "20" };
      const s = searchParams.get("search");
      const page = searchParams.get("page");
      if (s) params.search = s;
      if (page) params.page = page;
      const result = await adminGetCustomers(params);
      setCustomers(result.items);
      setMeta(result.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search); else params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#2874f0]">Customers</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900">Registered Customers</h2>
        </div>
        <form onSubmit={submitSearch} className="flex w-full sm:w-auto">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-field rounded-r-none sm:w-64" />
          <button className="btn-blue rounded-l-none rounded-r-lg px-5 py-2.5 text-sm font-black">Search</button>
        </form>
      </div>

      {loading ? (
        <LoadingState message="Loading customers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCustomers} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-black text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left font-black text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-black text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-14 text-center font-bold text-gray-400">No customers found.</td></tr>
                ) : customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2874f0] text-sm font-black text-white shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${c.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-4 py-4">
              <button disabled={meta.page <= 1} onClick={() => setPage(meta.page - 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40 hover:bg-gray-50 transition">← Prev</button>
              <span className="text-sm font-bold text-gray-500">Page {meta.page} of {meta.totalPages}</span>
              <button disabled={meta.page >= meta.totalPages} onClick={() => setPage(meta.page + 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40 hover:bg-gray-50 transition">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading customers..." />}>
      <CustomersContent />
    </Suspense>
  );
}
