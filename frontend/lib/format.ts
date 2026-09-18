export function formatCurrency(value: number) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

  const locale =
    currency === "INR"
      ? "en-IN"
      : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}