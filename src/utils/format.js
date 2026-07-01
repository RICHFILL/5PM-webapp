const CURRENCY_CONFIG = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "$", locale: "en-US" },
  USDT: { symbol: "$", locale: "en-US" },
};

function parseAmount(amount) {
  const num = Number(amount);
  return isNaN(num) ? 0 : num;
}

export function formatCurrency(amount, currency = "NGN") {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.NGN;
  const value = parseAmount(amount);
  return config.symbol + value.toLocaleString(config.locale);
}

export function formatNaira(amount) {
  return formatCurrency(amount, "NGN");
}

export function formatUSD(amount) {
  return formatCurrency(amount, "USD");
}

export function formatUSDT(amount) {
  return formatCurrency(amount, "USDT");
}
