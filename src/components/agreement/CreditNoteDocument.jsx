import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ---- helpers -------------------------------------------------------------

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
  try {
    return new Intl.NumberFormat("en-NG").format(n);
  } catch {
    return String(n);
  }
};

// ---- styles ---------------------------------------------------------------
// A4 = 595.28 x 841.89 pt. Letterhead logo block + orange corner sit in the
// top ~140pt; the orange footer strip sits in the bottom ~60pt — margins are
// set to clear both on every page.

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    lineHeight: 1.5,
    color: "#1f2937",
    paddingTop: 130,
    paddingBottom: 70,
    paddingHorizontal: 56,
  },
  letterheadBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  companyName: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 8,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 2,
  },
  headerBlock: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 14,
  },
  para: {
    marginBottom: 8,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginTop: 10,
    marginBottom: 6,
  },
  clause: {
    marginBottom: 6,
    textAlign: "justify",
  },
  scheduleNote: {
    fontSize: 8.5,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 4,
  },
  sigSection: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
  },
  sigTitle: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginBottom: 10,
  },
  sigRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sigCol: {
    width: "50%",
  },
  sigLabel: {
    fontSize: 8.5,
    color: "#6b7280",
  },
  sigValue: {
    fontFamily: "Times-Bold",
    fontSize: 9.5,
    marginTop: 2,
  },
  sigImageBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#f9fafb",
    width: 160,
  },
  sigImage: {
    height: 40,
    objectFit: "contain",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  pageNumber: {
    position: "absolute",
    bottom: 24,
    right: 56,
    fontSize: 8,
    color: "#9ca3af",
  },
});

// ---- component --------------------------------------------------------------

export default function CreditNoteDocument({
  investorName,
  principalAmount,
  currency = "NGN",
  tenorMonths,
  monthlyRatePercent,
  propertyName,
  today = new Date(),
  signatureUrl,
  signatureFullName,
  signatureDate,
  letterheadImageSrc = "/assets/letterhead.png",
}) {
  const symbol = currency === "NGN" ? "₦" : currency;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Letterhead as a true background layer, repeats on every page */}
        <Image src={letterheadImageSrc} style={styles.letterheadBg} fixed />

        <View style={styles.headerBlock}>
          <Text style={styles.companyName}>5PM NEXUS INVEST LIMITED</Text>
          <Text style={styles.tagline}>Let's grow your capital together</Text>
        </View>

        <Text style={styles.title}>PRIVATE CREDIT NOTE AGREEMENT</Text>
        <Text style={styles.subtitle}>Investor Facility Form</Text>

        <Text style={styles.para}>
          This Private Credit Note Agreement is made on{" "}
          <Text style={styles.bold}>{formatDate(today)}</Text>
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>BETWEEN{"\n"}</Text>
          <Text style={styles.bold}>
            {investorName || "__________________________________"}
          </Text>{" "}
          (the "Investor")
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>AND{"\n"}</Text>
          5PM NEXUS INVEST LIMITED, a company incorporated under the laws of the
          Federal Republic of Nigeria, having its registered office at 53
          Raymond Njoku Street, Off Awolowo Road, Lagos (the "Company" or
          "Issuer")
        </Text>

        <Text style={styles.sectionTitle}>
          1. PURPOSE AND NATURE OF THE TRANSACTION
        </Text>
        <Text style={styles.clause}>
          1.1. This Agreement constitutes a private credit transaction and not
          an investment management or fund management arrangement.
        </Text>
        <Text style={styles.clause}>
          1.2. The Investor agrees to advance funds to the Company by way of a
          private credit facility, and the Company agrees to repay the principal
          and agreed return in accordance with the terms of this Agreement.
        </Text>
        <Text style={styles.clause}>
          1.3. The parties expressly acknowledge that this Agreement creates a
          debt obligation of the Company and does not constitute an equity
          investment, partnership, or collective investment scheme.
        </Text>

        <Text style={styles.sectionTitle}>
          2. FACILITY AMOUNT AND USE OF FUNDS
        </Text>
        <Text style={styles.clause}>
          2.1. The Investor shall advance the sum of{" "}
          <Text style={styles.bold}>
            {symbol}
            {amountInWords(num(principalAmount))}
          </Text>{" "}
          ({amountInWords(num(principalAmount))}{" "}
          {currency === "NGN" ? "Naira" : currency}) to the Company (the
          "Principal Amount").
        </Text>
        <Text style={styles.clause}>
          2.2. The funds shall be used by the Company strictly for its business
          activities, including but not limited to real estate development and
          other related projects
          {propertyName ? ` (${propertyName})` : ""} as described in Schedule 1.
        </Text>
        <Text style={styles.clause}>
          2.3. The above-mentioned investment shall be made by the Investor into
          the bank account with the following details — NAME: 5PM NEXUS INVEST
          LIMITED, BANK: FCMB, ACCOUNT NO: 1003799718.
        </Text>

        <Text style={styles.sectionTitle}>3. TENOR AND RETURN</Text>
        <Text style={styles.clause}>
          3.1. The facility shall have a tenor of{" "}
          <Text style={styles.bold}>
            {tenorMonths ? `${tenorMonths} months` : "__________________"}
          </Text>{" "}
          commencing from the date the funds are credited to the Company's
          account.
        </Text>
        <Text style={styles.clause}>
          3.2. The Company shall pay the Investor a fixed return of{" "}
          <Text style={styles.bold}>
            {monthlyRatePercent ? `${monthlyRatePercent}%` : "______"}
          </Text>{" "}
          per month, calculated on the Principal Amount.
        </Text>
        <Text style={styles.clause}>
          3.3. Returns shall be payable monthly and the Principal Amount shall
          be repaid on or before the maturity date.
        </Text>

        <Text style={styles.sectionTitle}>4. REPAYMENT</Text>
        <Text style={styles.clause}>
          4.1. Repayment of returns and principal shall be made to the
          Investor's designated account on file with the Company.
        </Text>
        <Text style={styles.clause}>
          4.2. Early repayment may be made by the Company with three (3) days'
          prior written notice, without penalty unless otherwise agreed.
        </Text>

        <Text style={styles.sectionTitle}>5. EVENTS OF DEFAULT</Text>
        <Text style={styles.clause}>
          Each of the following shall constitute an Event of Default: failure to
          pay any amount due when due; breach of any material term; insolvency
          or inability to pay debts; misrepresentation of any material fact;
          unauthorized disposal of substantial business assets.
        </Text>

        <Text style={styles.sectionTitle}>6. CONSEQUENCES OF DEFAULT</Text>
        <Text style={styles.clause}>
          6.1. Upon an Event of Default, the Investor may declare all
          outstanding amounts immediately due and payable, enforce guarantees
          provided, and commence recovery proceedings without further notice.
        </Text>

        <Text style={styles.sectionTitle}>
          7. CORPORATE AND PERSONAL GUARANTEE
        </Text>
        <Text style={styles.clause}>
          7.1. The Company irrevocably and unconditionally guarantees the
          repayment of all sums due under this Agreement.
        </Text>
        <Text style={styles.clause}>
          7.2. The obligations of the Company under this Agreement shall
          constitute direct, unconditional, and continuing obligations, binding
          on the Company's assets and business.
        </Text>
        <Text style={styles.clause}>
          7.3. The signatories to this Agreement, in their capacity as directors
          and principal officers of the Company, jointly and severally guarantee
          the due repayment of the Principal Amount and agreed returns.
        </Text>
        <Text style={styles.clause}>
          7.4. This clause shall operate as a continuing deed of guarantee
          without the need for a separate guarantee document.
        </Text>

        <Text style={styles.sectionTitle}>
          8. REPRESENTATIONS AND WARRANTIES
        </Text>
        <Text style={styles.clause}>
          The Company represents that it has full corporate power and authority
          to enter this Agreement; this Agreement has been duly approved by its
          Board of Directors; and execution of this Agreement does not breach
          any existing obligation.
        </Text>

        <Text style={styles.sectionTitle}>
          9. GOVERNING LAW AND JURISDICTION
        </Text>
        <Text style={styles.clause}>
          This Agreement shall be governed by the laws of the Federal Republic
          of Nigeria, and the courts of Lagos State shall have exclusive
          jurisdiction.
        </Text>

        <Text style={styles.sectionTitle}>10. MISCELLANEOUS</Text>
        <Text style={styles.clause}>
          10.1. This Agreement constitutes the entire agreement between the
          parties.
        </Text>
        <Text style={styles.clause}>
          10.2. Any amendment must be in writing and signed by both parties.
        </Text>
        <Text style={styles.clause}>
          10.3. Failure to enforce any provision shall not constitute a waiver.
        </Text>

        <Text style={styles.sectionTitle}>
          SCHEDULE 1 – BUSINESS PROJECTS / ASSET PORTFOLIO (DISCLOSURE SCHEDULE)
        </Text>
        <Text style={styles.clause}>
          The Company is currently engaged in the following business
          projects/assets (non-exhaustive): Real Estate Development — Completed
          44 Units of 3-Bedroom apartments with 1 BQ at 4 Isaac John Street,
          Ikeja GRA, Lagos; and additional residential, commercial, and land
          banking assets as allocated by the Company from time to time.
        </Text>
        <Text style={styles.scheduleNote}>
          This schedule is provided for disclosure purposes and constitutes
          asset-level security.
        </Text>

        {(signatureUrl || signatureFullName) && (
          <View style={styles.sigSection} wrap={false}>
            <Text style={styles.sigTitle}>SIGNATURE</Text>
            <View style={styles.sigRow}>
              <View style={styles.sigCol}>
                <Text style={styles.sigLabel}>Signed by:</Text>
                <Text style={styles.sigValue}>
                  {signatureFullName || investorName}
                </Text>
              </View>
              {signatureDate && (
                <View style={styles.sigCol}>
                  <Text style={styles.sigLabel}>Date signed:</Text>
                  <Text style={styles.sigValue}>
                    {new Date(signatureDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>
            {signatureUrl && (
              <View style={styles.sigImageBox}>
                <Image src={signatureUrl} style={styles.sigImage} />
              </View>
            )}
          </View>
        )}

        <Text style={styles.footer} fixed>
          5PM NEXUS INVEST LIMITED | www.5pmnexus.com | +234 703 341 7802 / +234 708 089 7994
        </Text>
        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
