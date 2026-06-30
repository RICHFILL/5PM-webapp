import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CircleDollarSign, FileText, TrendingUp, Plus } from "lucide-react";
import { adminApi, investmentApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";

export default function InvestmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({ totalPaymentAmountRecorded: 0, investmentTotalDue: 0, balanceLeft: 0 });
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: "", paymentDate: "", dueDate: "" });
  const [savingPayment, setSavingPayment] = useState(false);

  const fetchInvestment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getInvestmentDetail(id);
      setInvestment(response?.data || response);
    } catch (error) {
      setInvestment(null);
      toast.error("Failed to load investment details");
    } finally { setLoading(false); }
  }, [id]);

  const fetchInvestmentPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const response = await investmentApi.getInvestmentPayments(id);
      const data = response?.data || response;
      setPayments(Array.isArray(data) ? data : []);
      setPaymentTotals({
        totalPaymentAmountRecorded: response?.totals?.totalPaymentAmountRecorded ?? 0,
        investmentTotalDue: response?.totals?.investmentTotalDue ?? 0,
        balanceLeft: response?.totals?.balanceLeft ?? 0,
      });
    } catch (error) {
      setPayments([]);
      toast.error("Failed to load payment records");
    } finally { setPaymentsLoading(false); }
  }, [id]);

  useEffect(() => { fetchInvestment(); fetchInvestmentPayments(); }, [fetchInvestment, fetchInvestmentPayments]);

  const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount || 0);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "--";
  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return "warning";
      case "completed": return "success";
      default: return "default";
    }
  };
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
    } finally { setSavingPayment(false); }
  };

  const getPaymentBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button onClick={() => navigate("/admin/investments")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to Investments</span>
        </button>
        <Card><p className="text-lg font-semibold text-gray-900">Investment not found</p></Card>
      </div>
    );
  }

  const infoCards = [
    { label: "Investment Amount", value: formatCurrency(investment?.amount), icon: CircleDollarSign },
    { label: "Interest Rate (p.a.)", value: `${investment?.interestRatePerAnnum ?? 0}%`, icon: TrendingUp },
    { label: "Interest Earned", value: formatCurrency(investment?.interestEarned), icon: FileText },
    { label: "Monthly Repayment", value: formatCurrency(investment?.expectedMonthlyRepayment), icon: CalendarDays },
    { label: "Payout Upon Expiration", value: formatCurrency(investment?.payoutUponExpiration), icon: CalendarDays },
    { label: "Monthly Repayment Date", value: investment?.expectedMonthlyRepaymentDate ? formatDate(investment.expectedMonthlyRepaymentDate) : "--", icon: CalendarDays },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate("/admin/investments")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to Investments</span>
      </button>

      <section className="rounded-3xl bg-dark-lavender text-white overflow-hidden">
          <div className="p-4 md:p-8">
          <div className="flex flex-col gap-4 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadge(investment?.status)}>{(investment?.status || "--").toUpperCase()}</Badge>
                <span className="text-sm text-cyan-100">Reference: {investment?.refNumber || "--"}</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-100">Investment Record</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold capitalize">{investment?.projectData?.projectName || investment?.project?.projectName || "--"}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <div><p className="text-xs uppercase tracking-wide text-cyan-100">Interest Rate</p><p className="mt-2 text-xl md:text-2xl font-bold">{investment?.interestRatePerAnnum || 0}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-cyan-100">Duration</p><p className="mt-2 text-xl md:text-2xl font-bold">{investment?.tenure || 0} mo</p></div>
              <div><p className="text-xs uppercase tracking-wide text-cyan-100">Start</p><p className="mt-2 text-sm font-semibold">{formatDate(investment?.startDate)}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-cyan-100">End</p><p className="mt-2 text-sm font-semibold">{formatDate(investment?.endDate)}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-3"><Icon className="h-5 w-5 text-gray-600" /></div>
              <p className="mt-4 text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
          <Button size="sm" onClick={() => setShowRecordPayment(true)}><Plus size={16} /> Record Payment</Button>
        </div>
        <div className="grid gap-4 border-b border-gray-100 px-6 py-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total Payments Recorded</p>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.totalPaymentAmountRecorded)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total Due</p>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.investmentTotalDue)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Balance Left</p>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.balanceLeft)}</p>
          </div>
        </div>
        <div className="p-6">
          {paymentsLoading ? (
            <Skeleton.Table rows={3} />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id || payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{formatDate(payment.paymentDate)}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{formatDate(payment.dueDate)}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap"><Badge variant={getPaymentBadge(payment.status)}>{payment.status || "--"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-500 text-center py-12">No payment records found.</p>}
        </div>
      </section>

      <Modal isOpen={showRecordPayment} onClose={() => { setShowRecordPayment(false); setPaymentForm({ amount: "", paymentDate: "", dueDate: "" }); }} title="Record Payment" size="sm">
        <div className="space-y-4">
          <Input label="Amount (₦)" type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="e.g. 50000" />
          <Input label="Payment Date" type="date" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })} />
          <Input label="Due Date" type="date" value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowRecordPayment(false); setPaymentForm({ amount: "", paymentDate: "", dueDate: "" }); }}>Cancel</Button>
            <Button onClick={handleRecordPayment} disabled={savingPayment || !paymentForm.amount}>
              {savingPayment ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
