"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/adminApi";
import type { Order, OrderStatus } from "@/types";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { formatCurrency } from "@/lib/format";

const STATUSES: OrderStatus[] = ["NEW", "CONFIRMED", "PROCESSING", "READY", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { limit: "50" };
      if (status) params.status = status;
      const result = await adminGetOrders(params);
      setOrders(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customer enquiries");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateStatus(id: string, nextStatus: OrderStatus) {
    try {
      await adminUpdateOrderStatus(id, nextStatus);
      setToast("Enquiry status updated.");
      await loadOrders();
      setTimeout(() => setToast(""), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update failed");
    }
  }

  if (loading) return <LoadingState message="Loading customer enquiries..." />;
  if (error && orders.length === 0) return <ErrorState message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-600">Customer site requests</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Product enquiries and order requests</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Customers submit their name, phone and email from the product page. Admin confirms stock and final order by call or email.
            </p>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-cyan-400"
          >
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {toast && <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{toast}</div>}
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
            No customer enquiries found.
          </div>
        ) : (
          orders.map((order) => {
            const firstItem = order.items[0];
            const emailBody = encodeURIComponent(`Hello ${order.customerName},\n\nWe are contacting you about enquiry ${order.orderNumber}.\n\nProduct: ${firstItem?.productName || "Product enquiry"}\nAmount: ${formatCurrency(order.subtotal)}\n\nWe can confirm availability and next steps.`);
            return (
              <article key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">{order.orderNumber}</span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-700">{order.status}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-black text-slate-950">{order.customerName}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{order.customerEmail} / {order.customerPhone}</p>
                    {order.notes && <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">{order.notes}</p>}
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Requested items</p>
                    <div className="mt-3 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          <Link href={`/products/${item.productSlug}`} target="_blank" className="text-sm font-black text-slate-950 hover:text-cyan-700">
                            {item.productName}
                          </Link>
                          <p className="mt-1 text-xs font-semibold text-slate-500">Qty {item.quantity} / {formatCurrency(item.lineTotal)}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-lg font-black text-slate-950">{formatCurrency(order.subtotal)}</p>
                  </div>

                  <div className="flex min-w-52 flex-col gap-2">
                    <a href={`tel:${order.customerPhone}`} className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white hover:bg-cyan-700">Call customer</a>
                    <a href={`mailto:${order.customerEmail}?subject=ByteHub enquiry ${order.orderNumber}&body=${emailBody}`} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-50">Email customer</a>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-cyan-400"
                    >
                      {STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
