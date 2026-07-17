const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "__________________";

const num = (v) => Number(v) || 0;

const amountInWords = (n) => {
  // Lightweight fallback; swap for a proper number-to-words lib if you need full compliance text
  try {
    return new Intl.NumberFormat("en-NG").format(n);
  } catch {
    return String(n);
  }
};

export default function CreditNoteAgreement({
  investorName,
  principalAmount,
  currency = "NGN",
  tenorMonths,
  monthlyRatePercent,
  propertyName,
  today = new Date(),
}) {
  const symbol = currency === "NGN" ? "₦" : currency;

  return (
    <div
      className="relative text-sm leading-relaxed text-gray-800 space-y-4 font-serif"
      style={{
        backgroundImage: "url('/assets/letterhead-1.png')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        padding: "180px 60px 100px 60px", // top clears the logo block, bottom clears the orange footer strip
        minHeight: "1123px", // A4 height at 96dpi-ish; adjust to your PNG's aspect ratio
      }}
    >

      <div className="text-center space-y-1 pb-2 border-b border-gray-200">
        <p className="font-bold tracking-wide">5PM NEXUS INVEST LIMITED</p>
        <p className="text-xs text-gray-500 italic">
          Let's grow your capital together
        </p>
      </div>

      <p className="text-center font-bold underline">
        PRIVATE CREDIT NOTE AGREEMENT
      </p>
      <p className="text-center text-xs text-gray-500">
        Investor Facility Form
      </p>

      <p>
        This Private Credit Note Agreement is made on{" "}
        <span className="font-semibold">{formatDate(today)}</span>
      </p>

      <p>
        <span className="font-semibold">BETWEEN</span>
        <br />
        <span className="font-semibold">
          {investorName || "__________________________________"}
        </span>{" "}
        (the "Investor")
      </p>

      <p>
        <span className="font-semibold">AND</span>
        <br />
        5PM NEXUS INVEST LIMITED, a company incorporated under the laws of the
        Federal Republic of Nigeria, having its registered office at 53 Raymond
        Njoku Street, Off Awolowo Road, Lagos (the "Company" or "Issuer")
      </p>

      <div>
        <p className="font-bold">1. PURPOSE AND NATURE OF THE TRANSACTION</p>
        <p>
          1.1. This Agreement constitutes a private credit transaction and not
          an investment management or fund management arrangement.
        </p>
        <p>
          1.2. The Investor agrees to advance funds to the Company by way of a
          private credit facility, and the Company agrees to repay the principal
          and agreed return in accordance with the terms of this Agreement.
        </p>
        <p>
          1.3. The parties expressly acknowledge that this Agreement creates a
          debt obligation of the Company and does not constitute an equity
          investment, partnership, or collective investment scheme.
        </p>
      </div>

      <div>
        <p className="font-bold">2. FACILITY AMOUNT AND USE OF FUNDS</p>
        <p>
          2.1. The Investor shall advance the sum of{" "}
          <span className="font-semibold">
            {symbol}
            {amountInWords(num(principalAmount))}
          </span>{" "}
          ({amountInWords(num(principalAmount))}{" "}
          {currency === "NGN" ? "Naira" : currency}) to the Company (the
          "Principal Amount").
        </p>
        <p>
          2.2. The funds shall be used by the Company strictly for its business
          activities, including but not limited to real estate development and
          other related projects{propertyName ? ` (${propertyName})` : ""} as
          described in Schedule 1.
        </p>
        <p>
          2.3. The above-mentioned investment shall be made by the Investor into
          the bank account with the following details — NAME: 5PM NEXUS INVEST
          LIMITED, BANK: FCMB, ACCOUNT NO: 1003799718.
        </p>
      </div>

      <div>
        <p className="font-bold">3. TENOR AND RETURN</p>
        <p>
          3.1. The facility shall have a tenor of{" "}
          <span className="font-semibold">
            {tenorMonths ? `${tenorMonths} months` : "__________________"}
          </span>{" "}
          commencing from the date the funds are credited to the Company's
          account.
        </p>
        <p>
          3.2. The Company shall pay the Investor a fixed return of{" "}
          <span className="font-semibold">
            {monthlyRatePercent ? `${monthlyRatePercent}%` : "______"}
          </span>{" "}
          per month, calculated on the Principal Amount.
        </p>
        <p>
          3.3. Returns shall be payable monthly and the Principal Amount shall
          be repaid on or before the maturity date.
        </p>
      </div>

      <div>
        <p className="font-bold">4. REPAYMENT</p>
        <p>
          4.1. Repayment of returns and principal shall be made to the
          Investor's designated account on file with the Company.
        </p>
        <p>
          4.2. Early repayment may be made by the Company with three (3) days'
          prior written notice, without penalty unless otherwise agreed.
        </p>
      </div>

      <div>
        <p className="font-bold">5. EVENTS OF DEFAULT</p>
        <p>
          Each of the following shall constitute an Event of Default: failure to
          pay any amount due when due; breach of any material term; insolvency
          or inability to pay debts; misrepresentation of any material fact;
          unauthorized disposal of substantial business assets.
        </p>
      </div>

      <div>
        <p className="font-bold">6. CONSEQUENCES OF DEFAULT</p>
        <p>
          6.1. Upon an Event of Default, the Investor may declare all
          outstanding amounts immediately due and payable, enforce guarantees
          provided, and commence recovery proceedings without further notice.
        </p>
      </div>

      <div>
        <p className="font-bold">7. CORPORATE AND PERSONAL GUARANTEE</p>
        <p>
          7.1. The Company irrevocably and unconditionally guarantees the
          repayment of all sums due under this Agreement.
        </p>
        <p>
          7.2. The obligations of the Company under this Agreement shall
          constitute direct, unconditional, and continuing obligations, binding
          on the Company's assets and business.
        </p>
        <p>
          7.3. The signatories to this Agreement, in their capacity as directors
          and principal officers of the Company, jointly and severally guarantee
          the due repayment of the Principal Amount and agreed returns.
        </p>
        <p>
          7.4. This clause shall operate as a continuing deed of guarantee
          without the need for a separate guarantee document.
        </p>
      </div>

      <div>
        <p className="font-bold">8. REPRESENTATIONS AND WARRANTIES</p>
        <p>
          The Company represents that it has full corporate power and authority
          to enter this Agreement; this Agreement has been duly approved by its
          Board of Directors; and execution of this Agreement does not breach
          any existing obligation.
        </p>
      </div>

      <div>
        <p className="font-bold">9. GOVERNING LAW AND JURISDICTION</p>
        <p>
          This Agreement shall be governed by the laws of the Federal Republic
          of Nigeria, and the courts of Lagos State shall have exclusive
          jurisdiction.
        </p>
      </div>

      <div>
        <p className="font-bold">10. MISCELLANEOUS</p>
        <p>
          10.1. This Agreement constitutes the entire agreement between the
          parties.
        </p>
        <p>
          10.2. Any amendment must be in writing and signed by both parties.
        </p>
        <p>
          10.3. Failure to enforce any provision shall not constitute a waiver.
        </p>
      </div>

      <div>
        <p className="font-bold">
          SCHEDULE 1 – BUSINESS PROJECTS / ASSET PORTFOLIO (DISCLOSURE SCHEDULE)
        </p>
        <p>
          The Company is currently engaged in the following business
          projects/assets (non-exhaustive): Real Estate Development — Completed
          44 Units of 3-Bedroom apartments with 1 BQ at 4 Isaac John Street,
          Ikeja GRA, Lagos; and additional residential, commercial, and land
          banking assets as allocated by the Company from time to time.
        </p>
        <p className="text-xs text-gray-500 italic">
          This schedule is provided for disclosure purposes and constitutes
          asset-level security.
        </p>
      </div>

      <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
        5PM NEXUS INVEST LIMITED &nbsp;|&nbsp; www.5pmnexus.com &nbsp;|&nbsp;
        +234 703 341 7802 / +234 708 089 7994
      </p>
    </div>
  );
}
