import { forwardRef } from "react";

const formatDate = (date) =>
  date
    ? new Date(date)
        .toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .toUpperCase()
    : "--";

const num = (v) => Number(v) || 0;

const currencySymbols = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };

const formatAmount = (amount, currency = "NGN") => {
  const symbol = currencySymbols[currency] || `${currency} `;
  return `${symbol}${num(amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatRate = (rate) => {
  const n = num(rate);
  if (!n) return null;
  // Trim trailing .00 but keep e.g. 3.5
  return n % 1 === 0 ? n.toFixed(0) : n.toString();
};

const InvestmentCertificate = forwardRef(
  ({ investment, investorName, companyName = "Nexus Invest" }, ref) => {
    const investor = investment?.investor;
    const resolvedName =
      investorName ||
      (investor
        ? `${investor.firstName || ""} ${investor.lastName || ""}`.trim()
        : "") ||
      "Investor Name";

    const tenure = investment?.tenure;
    const currency = investment?.currency || "NGN";
    const amount = investment?.amount;
    const rate = formatRate(investment?.interestRatePerAnnum);

    return (
      <div
        ref={ref}
        style={{ width: 900, height: 620, fontFamily: "Georgia, serif" }}
        className="relative bg-white p-3 overflow-hidden"
      >
        {/* Outer border */}
        <div className="absolute inset-3 border-2 border-red-600" />
        {/* Inner border */}
        <div className="absolute inset-5 border border-red-600" />

        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
        >
          <span
            style={{
              fontSize: 90,
              fontWeight: 800,
              color: "rgba(15, 23, 42, 0.06)",
              transform: "rotate(-30deg)",
              whiteSpace: "nowrap",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {companyName}
          </span>
        </div>

        <div
          className="relative h-full flex flex-col justify-between px-14 py-10"
          style={{ zIndex: 1 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/newlogo.png"
                alt="logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-sm font-bold tracking-wide text-gray-800 uppercase">
                {companyName}
              </span>
            </div>

            {/* Gold seal */}
            <svg width="70" height="100" viewBox="0 0 70 100">
              <circle
                cx="35"
                cy="35"
                r="30"
                fill="#D4AF37"
                stroke="#B8860B"
                strokeWidth="2"
              />
              <circle
                cx="35"
                cy="35"
                r="23"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path d="M20 60 L20 95 L35 82 L50 95 L50 60 Z" fill="#C0392B" />
            </svg>
          </div>

          {/* Title */}
          <div className="text-center -mt-6">
            <h1 className="text-2xl font-bold tracking-wide text-gray-900">
              INVESTMENT CERTIFICATE
            </h1>
          </div>

          {/* Body */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">This is to certify that</p>
            <p
              className="text-3xl italic text-gray-900"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              {resolvedName}
            </p>
            <p className="text-base text-gray-800">
              Has an investment of amount{" "}
              <span className="font-semibold">
                {formatAmount(amount, currency)}
              </span>
              {rate && (
                <>
                  {" "}
                  at <span className="font-semibold">{rate}%</span> per month
                </>
              )}
            </p>
            <p className="text-sm text-gray-600">Issued on</p>
            <p className="text-base font-bold text-gray-900">
              {formatDate(new Date().toISOString())}
            </p>
            <p className="text-sm text-gray-600">
              {tenure
                ? `For a tenure of (${tenure}) months based on our signed agreement`
                : "Based on our signed agreement"}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-6 text-sm text-center text-gray-600">
            <p className="italic">
              Thank you for choosing {companyName}. We are committed to helping
              you achieve your financial goals through reliable investment
              opportunities.
            </p>
          </div>
        </div>
      </div>
    );
  },
);

InvestmentCertificate.displayName = "InvestmentCertificate";
export default InvestmentCertificate;
