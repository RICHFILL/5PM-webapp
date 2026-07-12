

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


export function groupInvestmentTotalsByCurrency(investments = []) {
  const buckets = {};
  investments.forEach((inv) => {
    const currency = inv.currency || "NGN";
    if (!buckets[currency]) {
      buckets[currency] = {
        currency,
        totalInvested: 0,
        totalInterestEarned: 0,
        totalExpectedMonthlyRepayment: 0,
        totalPayoutUponExpiration: 0,
        totalInvestments: 0,
        activeInvestments: 0,
      };
    }
    const b = buckets[currency];
    b.totalInvested += Number(inv.amount) || 0;
    b.totalInterestEarned += Number(inv.interestEarned) || 0;
    b.totalExpectedMonthlyRepayment += Number(inv.expectedMonthlyRepayment) || 0;
    b.totalPayoutUponExpiration += Number(inv.payoutUponExpiration) || 0;
    b.totalInvestments += 1;
    if (inv.status === "active") b.activeInvestments += 1;
  });

  return Object.values(buckets).sort((a, b) =>
    a.currency === "NGN" ? -1 : b.currency === "NGN" ? 1 : a.currency.localeCompare(b.currency)
  );
}