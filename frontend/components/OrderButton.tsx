"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { createOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function OrderButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", notes: "" });

  const shopPhone = process.env.NEXT_PUBLIC_OWNER_PHONE || "";
  const shopEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
  const shopWhatsapp = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "";
  const message = `Hello, I want to enquire about ${product.name} (${product.model}), Qty: ${quantity}. Price: ${formatCurrency(product.price * quantity)}`;

  if (product.stockStatus === "OUT_OF_STOCK") {
    return (
      <button disabled className="w-full rounded-lg bg-gray-100 px-6 py-4 text-sm font-black text-gray-400 cursor-not-allowed">
        Currently Out of Stock
      </button>
    );
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const order = await createOrder({ ...form, items: [{ productId: product.id, quantity }] });
      setSuccess(`✅ Enquiry #${order.orderNumber} saved! Now contact the shop to confirm.`);
      setForm({ customerName: "", customerEmail: "", customerPhone: "", notes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex-1 btn-primary px-6 py-4 text-sm font-black uppercase tracking-wider rounded-lg shadow-lg"
        >
          🛒 Place Order Enquiry — {formatCurrency(product.price * quantity)}
        </button>
        {shopPhone && (
          <a
            href={`tel:${shopPhone}`}
            className="flex items-center gap-2 btn-blue px-5 py-4 text-sm font-black rounded-lg shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Call
          </a>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2874f0] to-[#1a5dc8] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-blue-200">Order Enquiry</p>
                  <h2 className="mt-1 text-xl font-black">{product.name}</h2>
                  <p className="mt-1 text-sm text-blue-200">Qty {quantity} · {formatCurrency(product.price * quantity)}</p>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-black hover:bg-white/30 transition">✕</button>
              </div>
            </div>

            <form onSubmit={submitOrder} className="space-y-4 p-5">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
                  <p>{success}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shopPhone && (
                      <a href={`tel:${shopPhone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2874f0] px-4 py-2 text-xs font-black text-white hover:opacity-90">
                        📞 Call Shop
                      </a>
                    )}
                    {shopWhatsapp && (
                      <a href={`https://wa.me/${shopWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25d366] px-4 py-2 text-xs font-black text-white hover:opacity-90">
                        💬 WhatsApp
                      </a>
                    )}
                    {shopEmail && (
                      <a href={`mailto:${shopEmail}?subject=Product Enquiry - ${encodeURIComponent(product.name)}&body=${encodeURIComponent(message)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-4 py-2 text-xs font-black text-green-800 hover:bg-green-50">
                        ✉️ Email Shop
                      </a>
                    )}
                  </div>
                </div>
              )}
              <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Your Full Name *" className="input-field" />
              <input required type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} placeholder="Email Address *" className="input-field" />
              <input required value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="Phone Number *" className="input-field" />
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any questions? (delivery, compatibility, upgrades...)" rows={3} className="input-field resize-none" />
              <button disabled={loading} className="btn-primary w-full rounded-lg px-6 py-4 text-sm font-black uppercase tracking-wider disabled:opacity-60">
                {loading ? "Saving Enquiry..." : "Submit Enquiry & Contact Shop"}
              </button>
              <p className="text-center text-xs text-gray-400">No online payment. We confirm by phone or email.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
