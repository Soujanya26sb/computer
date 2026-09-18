import type { StockStatus } from "@/types";

export default function StockBadge({ status, quantity }: { status: StockStatus; quantity?: number }) {
  const config: Record<StockStatus, { cls: string; dot: string; label: string }> = {
    IN_STOCK: { cls: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500", label: "In Stock" },
    LOW_STOCK: { cls: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500", label: "Low Stock" },
    OUT_OF_STOCK: { cls: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500", label: "Out of Stock" },
  };
  const { cls, dot, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full pulse-dot ${dot}`} />
      {label}
      {quantity !== undefined && status !== "OUT_OF_STOCK" ? ` · ${quantity}` : ""}
    </span>
  );
}
