
export function formatCurrencyAmount(amount, currency = "NGN") {
  const value = Number(amount) || 0;
  const code = currency || "NGN";
  const locale = code === "USD" ? "en-US" : "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
  }).format(value);
}

export function currencySymbol(currency = "NGN") {
  return currency === "USD" ? "$" : "₦";
}