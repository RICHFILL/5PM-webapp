import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Percent, Clock } from "lucide-react";
import { investmentApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function InvestDetail() {
  const { id } = useParams();
  const [investment, setInvestment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await investmentApi.getInvestmentDetails(id);
        setInvestment(data?.data || data);
      } catch { setInvestment(null); } finally { setLoading(false); }
    };
    if (id) fetch();
  }, [id]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setPaymentsLoading(true);
        const data = await investmentApi.getInvestmentPayments(id);
        const paymentsData = data?.data || data;
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch { setPayments([]); } finally { setPaymentsLoading(false); }
    };
    if (id) fetchPayments();
  }, [id]);

  const statusVariant = (status) => {
    switch (status) {
      case "active": return "warning";
      case "completed": return "success";
      case "pending": return "default";
      case "failed": return "danger";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card><p className="text-center text-gray-500 py-12">Investment not found.</p></Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/investments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors">
        <ArrowLeft size={16} /> Back to Investments
      </Link>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{investment.projectData?.projectName || investment.project?.projectName || "Investment"}</h1>
            <p className="text-sm text-gray-500 mt-1">Ref: <span className="font-semibold text-cyan-600">{investment.refNumber || "--"}</span></p>
          </div>
          <Badge variant={statusVariant(investment.status)}>{investment.status || "Unknown"}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><DollarSign size={14} />Amount</div>
            <p className="text-lg font-bold text-gray-900">{formatNaira(investment.amount)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Percent size={14} />Interest Rate</div>
            <p className="text-lg font-bold text-gray-900">{investment.interestRatePerAnnum ?? investment.roi}% p.a.</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Clock size={14} />Tenure</div>
            <p className="text-lg font-bold text-gray-900">{investment.tenure || 0} months</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Calendar size={14} />Start Date</div>
            <p className="text-lg font-bold text-gray-900">{formatDate(investment.startDate)}</p>
          </div>
        </div>
      </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Interest Earned</p>
          <p className="text-xl font-bold text-gray-900">{formatNaira(investment.interestEarned)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Monthly Repayment</p>
          <p className="text-xl font-bold text-gray-900">{formatNaira(investment.expectedMonthlyRepayment)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Payout on Expiration</p>
          <p className="text-xl font-bold text-gray-900">{formatNaira(investment.payoutUponExpiration)}</p>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Records</h3>
        {paymentsLoading ? (
          <Skeleton.Table rows={4} />
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-[0.18em]">
                  <th className="text-left pb-3 font-semibold px-6">Amount</th>
                  <th className="text-left pb-3 font-semibold px-6">Payment Date</th>
                  <th className="text-left pb-3 font-semibold px-6">Due Date</th>
                  <th className="text-right pb-3 font-semibold px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id || p._id || i} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 font-semibold text-gray-900 px-6">{formatNaira(p.amount)}</td>
                    <td className="py-3 text-gray-600 px-6">{formatDate(p.paymentDate)}</td>
                    <td className="py-3 text-gray-600 px-6">{formatDate(p.dueDate)}</td>
                    <td className="py-3 text-right px-6">
                      <Badge variant={statusVariant(p.status)}>{p.status || "--"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-8">No payment records yet.</p>}
      </Card>
    </div>
  );
}
