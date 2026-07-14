import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  Banknote,
  Receipt,
  Building2,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CalendarDays,
  Copy,
} from "lucide-react";
import { investmentApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";
import { formatCurrency } from "../../utils/format";
import html2canvas from "html2canvas";
import useAuth from "../../hooks/useAuth";
import InvestmentCertificate from "../../components/certificate/InvestmentCertificate";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "\u2014";

const formatDateShort = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "\u2014";

const statusMeta = {
  active: { variant: "success", icon: CheckCircle2, label: "Active" },
  pending: { variant: "warning", icon: Clock, label: "Pending" },
  completed: { variant: "info", icon: ShieldCheck, label: "Completed" },
  cancelled: { variant: "danger", icon: AlertTriangle, label: "Cancelled" },
};

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className={`inline-flex rounded-xl ${bg} p-2.5 ring-1 ring-inset ring-black/5`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-lg even:bg-gray-50/80">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? "text-neon-tangerine" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

export default function InvestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [investment, setInvestment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({
    totalPaymentAmountRecorded: 0,
    investmentTotalDue: 0,
    balanceLeft: 0,
  });
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await investmentApi.getInvestmentDetails(id);
        setInvestment(data?.data || data);
      } catch {
        setInvestment(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setPaymentsLoading(true);
        const response = await investmentApi.getInvestmentPayments(id);
        const paymentsData = response?.data || response;
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setPaymentTotals({
          totalPaymentAmountRecorded: response?.totals?.totalPaymentAmountRecorded ?? 0,
          investmentTotalDue: response?.totals?.investmentTotalDue ?? 0,
          balanceLeft: response?.totals?.balanceLeft ?? 0,
        });
      } catch {
        setPayments([]);
      } finally {
        setPaymentsLoading(false);
      }
    };
    if (id) fetchPayments();
  }, [id]);

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#fff",
      });
      const link = document.createElement("a");
      link.download = `certificate-${investment.refNumber || id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton.Card />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <Skeleton.Card />
          <Skeleton.Card />
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <Link
          to="/investments"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Investments
        </Link>
        <Card>
          <div className="text-center py-8">
            <AlertTriangle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-semibold text-gray-900">Investment not found</p>
            <p className="text-sm text-gray-500 mt-1">The investment you are looking for does not exist or has been removed.</p>
          </div>
        </Card>
      </div>
    );
  }

  const inv = investment;
  const currency = inv.currency || "NGN";
  const fmt = (amount) => formatCurrency(amount, currency);
  const statusInfo = statusMeta[inv.status] || statusMeta.pending;
  const StatusIcon = statusInfo.icon;

  const metrics = [
    { label: "Investment Amount", value: fmt(inv.amount), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Interest Rate", value: `${inv.interestRatePerAnnum || 0}%`, icon: Percent, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Interest Earned", value: fmt(inv.interestEarned), icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Monthly Repayment", value: fmt(inv.expectedMonthlyRepayment), icon: Banknote, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Payout at Expiry", value: fmt(inv.payoutUponExpiration), icon: Receipt, color: "text-rose-600", bg: "bg-rose-50" },
    {
      label: inv.expectedMonthlyRepaymentDate ? "Next Payment" : "Expected Returns",
      value: inv.expectedMonthlyRepaymentDate ? formatDate(inv.expectedMonthlyRepaymentDate) : fmt(inv.expectedReturns),
      icon: CalendarDays,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  const investorName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    inv.investorName ||
    inv.user?.fullName ||
    "\u2014";
  const investorInitials =
    (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "") || "?";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

      <Link
        to="/investments"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Investments
      </Link>

      <section className="rounded-3xl bg-gradient-to-br from-dark-lavender via-dark-lavender to-indigo-900 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  statusInfo.variant === "success" ? "bg-emerald-500/15 text-emerald-300" :
                  statusInfo.variant === "warning" ? "bg-amber-500/15 text-amber-300" :
                  statusInfo.variant === "info" ? "bg-blue-500/15 text-blue-300" :
                  "bg-gray-500/15 text-gray-300"
                }`}>
                  <StatusIcon size={12} />
                  {statusInfo.label}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                  {inv.currency || "NGN"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                  {inv.refNumber || "\u2014"}
                </span>
                {inv.repaymentStructure && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10">
                    {inv.repaymentStructure}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/60">Investment Record</p>
                <h2 className="mt-1.5 text-2xl md:text-3xl font-bold capitalize">
                  {inv.projectData?.projectName || inv.project?.projectName || "General Investment"}
                </h2>
              </div>

              <button
                onClick={handleDownloadCertificate}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-tangerine text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-neon-tangerine/25 active:scale-[0.98]"
              >
                <Download size={15} />
                {downloading ? "Generating..." : "Download Certificate"}
              </button>

              <div style={{ position: "fixed", top: 0, left: "-9999px" }}>
                <InvestmentCertificate
                  ref={certificateRef}
                  investment={inv}
                  investorName={investorName}
                  companyName="5PM Nexus Invest"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm min-w-[280px]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Rate</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{inv.interestRatePerAnnum || 0}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Tenure</p>
                <p className="mt-1 text-lg font-bold">{inv.tenure ? `${inv.tenure}mo` : "\u2014"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Start</p>
                <p className="mt-1 text-sm font-semibold">{formatDateShort(inv.startDate)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Maturity</p>
                <p className="mt-1 text-sm font-semibold">{formatDateShort(inv.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Investment Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Full record breakdown</p>
              </div>
              <span className="text-xs text-gray-400 tabular-nums">
                ID: {inv.id?.slice(0, 8)}...
                <button
                  onClick={() => { navigator.clipboard.writeText(inv.id); }}
                  className="ml-1 text-gray-400 hover:text-gray-600 inline-flex"
                >
                  <Copy size={12} />
                </button>
              </span>
            </div>
            <div className="divide-y divide-gray-100 -mx-6 px-6">
              <InfoRow label="Reference Number" value={inv.refNumber || "\u2014"} />
              <InfoRow label="Status" value={<Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>} />
              <InfoRow label="Currency" value={inv.currency || "NGN"} />
              <InfoRow label="Repayment Structure" value={inv.repaymentStructure ? inv.repaymentStructure.charAt(0).toUpperCase() + inv.repaymentStructure.slice(1) : "\u2014"} />
              <InfoRow label="Interest Rate (monthly)" value={`${inv.interestRatePerAnnum || 0}%`} />
              <InfoRow label="Tenure" value={inv.tenure ? `${inv.tenure} months` : "\u2014"} />
              <InfoRow label="Returns Withdrawn" value={inv.returnsWithdrawn ? "Yes" : "No"} />
              <InfoRow label="Expected Returns" value={fmt(inv.expectedReturns)} />
              <InfoRow label="Start Date" value={formatDate(inv.startDate)} />
              <InfoRow label="Maturity Date" value={formatDate(inv.endDate)} />
              <InfoRow label="Created" value={formatDate(inv.createdAt)} />
              <InfoRow label="Last Updated" value={formatDate(inv.updatedAt)} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-lavender to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                {investorInitials}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{investorName}</h3>
                <p className="text-xs text-gray-500">Investor</p>
              </div>
            </div>
            <div className="space-y-3 text-sm divide-y divide-gray-100">
              <div className="text-gray-600 pb-3">{user?.email || "\u2014"}</div>
              <div className="text-gray-600 py-3">{user?.phone || "\u2014"}</div>
            </div>
          </Card>

          {inv.projectData && (
            <Card>
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-dark-lavender to-purple-500 rounded-t-xl -mx-6 -mt-6 mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Building2 size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Project</h3>
                  <p className="text-xs text-gray-500">Associated investment project</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-base font-bold text-gray-900">
                  {inv.projectData.projectName || "\u2014"}
                </p>
                {inv.projectData.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Created {formatDate(inv.projectData.createdAt)}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Receipt size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Payment Records</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {payments.length > 0
                  ? `${payments.length} payment${payments.length === 1 ? '' : 's'} recorded`
                  : 'All payments recorded against this investment'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-3 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="bg-white rounded-xl border border-emerald-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Payments Received</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(paymentTotals.totalPaymentAmountRecorded)}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Total Due</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(paymentTotals.investmentTotalDue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-rose-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${paymentTotals.balanceLeft > 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${paymentTotals.balanceLeft > 0 ? "text-rose-700" : "text-emerald-700"}`}>Balance Left</p>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${paymentTotals.balanceLeft > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {fmt(paymentTotals.balanceLeft)}
            </p>
          </div>
        </div>

        <div className="p-6">
          {paymentsLoading ? (
            <Skeleton.Table rows={3} />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.map((payment, idx) => (
                    <tr
                      key={payment.id || payment._id}
                      className="hover:bg-gray-50/80 transition-colors even:bg-gray-50/40"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400 font-mono tabular-nums">{idx + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{fmt(payment.amount)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={13} className="text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700">{formatDate(payment.paymentDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={13} className="text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700">{formatDate(payment.dueDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={payment.status === "verified" ? "success" : payment.status === "pending" ? "warning" : "default"}>
                          {payment.status || "\u2014"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <Receipt size={28} className="text-amber-300" />
              </div>
              <p className="text-gray-500 font-semibold">No payment records yet</p>
              <p className="text-gray-400 text-sm mt-1">Payments will appear here once they are recorded.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
