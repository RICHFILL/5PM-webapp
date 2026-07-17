import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
  Plus,
  DollarSign,
  Mail,
  Phone,
  Receipt,
  Percent,
  Banknote,
  Download,
  Building2,
  Hash,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  FileText,
  Eye,
} from "lucide-react";
import { adminApi, investmentApi, agreementApi } from "../../services/api";
import {
  Card,
  Skeleton,
  Badge,
  Button,
  Modal,
  Input,
} from "../../components/common";
import AmountUpdateModal from "../../components/common/AmountUpdateModal";
import toast from "react-hot-toast";
import { currencySymbol } from "../../utils/currency";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvestmentCertificate from "../../components/certificate/InvestmentCertificate";
import CreditNoteAgreement from "../../components/agreement/CreditNoteAgreement";

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

export default function InvestmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({
    totalPaymentAmountRecorded: 0,
    investmentTotalDue: 0,
    balanceLeft: 0,
  });
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentDate: "",
    dueDate: "",
  });
  const [savingPayment, setSavingPayment] = useState(false);
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [amountModalOpen, setAmountModalOpen] = useState(false);
  const contractRef = useRef(null);
  const [contractDownloading, setContractDownloading] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [agreementData, setAgreementData] = useState(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const hasAgreement = agreementData != null;

  const fetchInvestment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getInvestmentDetail(id);
      setInvestment(response?.data || response);
    } catch (error) {
      setInvestment(null);
      toast.error("Failed to load investment details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchInvestmentPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const response = await investmentApi.getInvestmentPayments(id);
      const data = response?.data || response;
      setPayments(Array.isArray(data) ? data : []);
      setPaymentTotals({
        totalPaymentAmountRecorded:
          response?.totals?.totalPaymentAmountRecorded ?? 0,
        investmentTotalDue: response?.totals?.investmentTotalDue ?? 0,
        balanceLeft: response?.totals?.balanceLeft ?? 0,
      });
    } catch (error) {
      setPayments([]);
      toast.error("Failed to load payment records");
    } finally {
      setPaymentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvestment();
    fetchInvestmentPayments();
  }, [fetchInvestment, fetchInvestmentPayments]);

  useEffect(() => {
    const fetchAgreement = async () => {
      if (!investment?.id) return;
      setAgreementLoading(true);
      try {
        const res = await agreementApi.getAgreementAdmin(investment.id);
        setAgreementData(res?.agreement || null);
      } catch {
        setAgreementData(null);
      } finally {
        setAgreementLoading(false);
      }
    };
    fetchAgreement();
  }, [investment?.id]);

  const investmentCurrency = investment?.currency || "NGN";
  const formatCurrency = useCallback(
    (amount) => {
      const locale = investmentCurrency === "USD" ? "en-US" : "en-NG";
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: investmentCurrency,
        minimumFractionDigits: 2,
      }).format(amount || 0);
    },
    [investmentCurrency],
  );

  const handleRecordPayment = async () => {
    if (!paymentForm.amount) return;
    setSavingPayment(true);
    try {
      await adminApi.recordInvestmentPayment(id, {
        amount: parseFloat(paymentForm.amount),
        paymentDate: paymentForm.paymentDate || undefined,
        dueDate: paymentForm.dueDate || undefined,
      });
      setShowRecordPayment(false);
      setPaymentForm({ amount: "", paymentDate: "", dueDate: "" });
      toast.success("Payment recorded");
      fetchInvestmentPayments();
    } catch {
      toast.error("Failed to record payment");
    } finally {
      setSavingPayment(false);
    }
  };

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

  const handleDownloadContract = async () => {
    if (!contractRef.current) return;
    setContractDownloading(true);
    try {
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename = `contract-${(inv.projectData?.projectName || inv.project?.projectName || "investment").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setContractDownloading(false);
    }
  };

  const getPaymentBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton.Card />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <button
          onClick={() => navigate("/admin/investments")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back to Investments</span>
        </button>
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
  const statusInfo = statusMeta[inv.status] || statusMeta.pending;
  const StatusIcon = statusInfo.icon;
  const investorName = [inv.investor?.firstName, inv.investor?.lastName].filter(Boolean).join(" ") || inv.user?.fullName || "\u2014";
  const investorInitials = (inv.investor?.firstName?.[0] || "") + (inv.investor?.lastName?.[0] || "") || "?";

  const metrics = [
    { label: "Investment Amount", value: formatCurrency(inv.amount), icon: CircleDollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Interest Rate", value: `${inv.interestRatePerAnnum || 0}%`, icon: Percent, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Interest Earned", value: formatCurrency(inv.interestEarned), icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Monthly Repayment", value: formatCurrency(inv.expectedMonthlyRepayment), icon: Banknote, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Payout at Expiry", value: formatCurrency(inv.payoutUponExpiration), icon: Receipt, color: "text-rose-600", bg: "bg-rose-50" },
    {
      label: inv.expectedMonthlyRepaymentDate ? "Next Payment" : "Expected Returns",
      value: inv.expectedMonthlyRepaymentDate ? formatDate(inv.expectedMonthlyRepaymentDate) : formatCurrency(inv.expectedReturns),
      icon: CalendarDays,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => navigate("/admin/investments")}
          className="hover:text-gray-900 transition-colors font-medium"
        >
          Investments
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium truncate">{inv.refNumber || "Detail"}</span>
      </nav>

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
                  <Hash size={11} />
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

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadCertificate}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-tangerine text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-neon-tangerine/25 active:scale-[0.98]"
                >
                  <Download size={15} />
                  {downloading ? "Generating..." : "Certificate"}
                </button>
                <button
                  onClick={() => setAmountModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all border border-white/10 active:scale-[0.98]"
                >
                  <DollarSign size={15} />
                  Edit Amount
                </button>
              </div>

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
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Duration</p>
                <p className="mt-1 text-lg font-bold">{inv.tenure ? `${inv.tenure}mo` : "\u2014"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">Start</p>
                <p className="mt-1 text-sm font-semibold">{formatDateShort(inv.startDate)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-100/50">End</p>
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
                  onClick={() => { navigator.clipboard.writeText(inv.id); toast.success("ID copied"); }}
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
              <InfoRow label="ROI" value={`${inv.roi || inv.interestRatePerAnnum || 0}%`} />
              <InfoRow label="Tenure" value={inv.tenure ? `${inv.tenure} months` : "\u2014"} />
              <InfoRow label="Duration" value={inv.duration ? `${inv.duration} months` : "\u2014"} />
              <InfoRow label="Returns Withdrawn" value={inv.returnsWithdrawn ? "Yes" : "No"} />
              <InfoRow label="Expected Returns" value={formatCurrency(inv.expectedReturns)} />
              <InfoRow label="Start Date" value={formatDate(inv.startDate)} />
              <InfoRow label="End Date" value={formatDate(inv.endDate)} />
              <InfoRow label="Created" value={formatDate(inv.createdAt)} />
              <InfoRow label="Last Updated" value={formatDate(inv.updatedAt)} />
            </div>
          </Card>
        </div>

        <div className="space-y-6 h-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center h-1/2 gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-lavender to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                {investorInitials}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{investorName}</h3>
                <p className="text-xs text-gray-500">Investor</p>
              </div>
            </div>
            <div className="space-y-3 text-sm divide-y divide-gray-100">
              <div className="flex items-center gap-3 text-gray-600 pb-3">
                <Mail size={14} className="shrink-0 text-gray-400" />
                <span className="truncate">{inv.investor?.email || inv.user?.email || "\u2014"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 py-3">
                <Phone size={14} className="shrink-0 text-gray-400" />
                <span className="flex items-center gap-2">{inv.investor?.phone || inv.user?.phone || "\u2014"}{(inv.investor?.phone || inv.user?.phone) && (
                  <a href={`https://wa.me/${(inv.investor?.phone || inv.user?.phone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
                    <MessageCircle size={14} className="text-[#25D366] hover:opacity-80" />
                  </a>
                )}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 pt-3">
                <Hash size={14} className="shrink-0 text-gray-400" />
                <span>{inv.investor?.refNumber || inv.user?.refNumber || "\u2014"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
                {inv.projectData?.projectName || inv.project?.projectName || "No project assigned"}
              </p>
              {inv.projectData?.createdAt && (
                <p className="text-xs text-gray-400 mt-2">
                  Created {formatDate(inv.projectData.createdAt)}
                </p>
              )}
            </div>
            {inv.productId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <Hash size={11} />
                <span className="font-mono">Product: {inv.productId.slice(0, 8)}...</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-neon-tangerine rounded-t-xl -mx-6 -mt-6 mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FileText size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Agreement</h3>
                <p className="text-xs text-gray-500">Signed credit note contract</p>
              </div>
            </div>
            <div className="space-y-3">
              {hasAgreement ? (
                <>
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 size={14} />
                      <span className="font-medium">Signed</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      {agreementData?.signedAt
                        ? `Signed on ${formatDate(agreementData.signedAt)}`
                        : "Agreement has been signed"}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setShowContractModal(true)}
                  >
                    <Eye size={15} /> View Agreement
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleDownloadContract}
                    disabled={contractDownloading}
                  >
                    <Download size={15} />
                    {contractDownloading ? "Generating..." : "Download Agreement (PDF)"}
                  </Button>
                </>
              ) : (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <p className="text-xs text-amber-700">
                    This investment does not have a signed agreement yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden h-auto">
        <div className="border-b w-full border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 tabular-nums">
              Due: {formatCurrency(paymentTotals.investmentTotalDue)}
            </span>
            <Button size="sm" onClick={() => setShowRecordPayment(true)}>
              <Plus size={15} /> Record Payment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-3 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="bg-white rounded-xl border border-emerald-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Payments Recorded</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(paymentTotals.totalPaymentAmountRecorded)}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Total Due</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(paymentTotals.investmentTotalDue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-rose-200/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${paymentTotals.balanceLeft > 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${paymentTotals.balanceLeft > 0 ? "text-rose-700" : "text-emerald-700"}`}>Balance Left</p>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${paymentTotals.balanceLeft > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {formatCurrency(paymentTotals.balanceLeft)}
            </p>
          </div>
        </div>

        <div className="p-6">
          {paymentsLoading ? (
            <Skeleton.Table rows={3} />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left text-gray-500 text-sm border-separate border-spacing-0">
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
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(payment.amount)}</span>
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
                        <Badge variant={getPaymentBadge(payment.status)}>
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
              <p className="text-gray-400 text-sm mt-1 mb-5">Record the first payment to start tracking.</p>
              <Button size="sm" onClick={() => setShowRecordPayment(true)}>
                <Plus size={15} /> Record First Payment
              </Button>
            </div>
          )}
        </div>
      </section>
        

      <Modal
        isOpen={showRecordPayment}
        onClose={() => {
          setShowRecordPayment(false);
          setPaymentForm({ amount: "", paymentDate: "", dueDate: "" });
        }}
        title="Record Payment"
        size="sm"
      >
        <div className="space-y-4">
          {investment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Recording a payment of <span className="font-semibold">{formatCurrency(inv.expectedMonthlyRepayment)}</span> is the expected monthly amount.
            </div>
          )}
          <Input
            label={`Amount (${currencySymbol(investmentCurrency)})`}
            type="number"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            placeholder="e.g. 50000"
            min={1}
            step="0.01"
          />
          <Input
            label="Payment Date"
            type="date"
            value={paymentForm.paymentDate}
            onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
          />
          <Input
            label="Due Date"
            type="date"
            value={paymentForm.dueDate}
            onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRecordPayment(false);
                setPaymentForm({ amount: "", paymentDate: "", dueDate: "" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={savingPayment || !paymentForm.amount}>
              {savingPayment ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        title="Private Credit Note Agreement"
        size="xl"
      >
        <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5">
          <CreditNoteAgreement
            investorName={investorName}
            principalAmount={inv.amount}
            currency={investmentCurrency}
            tenorMonths={inv.tenure}
            monthlyRatePercent={inv.interestRatePerAnnum}
            propertyName={inv.projectData?.projectName || inv.project?.projectName}
            signatureUrl={agreementData?.signatureUrl}
            signatureFullName={agreementData?.fullName}
            signatureDate={agreementData?.signedAt}
          />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button onClick={handleDownloadContract} disabled={contractDownloading}>
            <Download size={15} />
            {contractDownloading ? "Generating..." : "Download (PDF)"}
          </Button>
          <Button variant="outline" onClick={() => setShowContractModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <div style={{ position: "fixed", top: 0, left: "-9999px" }}>
        <div ref={contractRef}>
          <CreditNoteAgreement
            investorName={investorName}
            principalAmount={inv.amount}
            currency={investmentCurrency}
            tenorMonths={inv.tenure}
            monthlyRatePercent={inv.interestRatePerAnnum}
            propertyName={inv.projectData?.projectName || inv.project?.projectName}
            signatureUrl={agreementData?.signatureUrl}
            signatureFullName={agreementData?.fullName}
            signatureDate={agreementData?.signedAt}
          />
        </div>
      </div>

      <AmountUpdateModal
        open={amountModalOpen}
        onClose={() => setAmountModalOpen(false)}
        investment={investment}
        onSuccess={() => { fetchInvestment(); fetchInvestmentPayments(); }}
      />
    </div>
  );
}
