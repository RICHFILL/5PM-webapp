import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Banknote, CheckCircle2, Clock, AlertCircle, Percent, Calendar, TrendingUp } from "lucide-react";
import { loanApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import { formatNaira } from '../../utils/format';

const statusConfig = {
  active: { variant: "success", icon: CheckCircle2, label: "Active", color: "text-green-600", bg: "bg-green-50" },
  pending: { variant: "warning", icon: Clock, label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
  repaid: { variant: "info", icon: CheckCircle2, label: "Repaid", color: "text-blue-600", bg: "bg-blue-50" },
  defaulted: { variant: "danger", icon: AlertCircle, label: "Defaulted", color: "text-red-600", bg: "bg-red-50" },
};

export default function LoanDetail() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await loanApi.getLoanDetail(id);
        setLoan(res?.data || res);
      } catch { setLoan(null); } finally { setLoading(false); }
    };
    if (id) fetch();
  }, [id]);

  if (loading) return <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6"><Skeleton className="h-6 w-24" /><Skeleton.Card /></div>;
  if (!loan) return <div className="p-4 md:p-8 max-w-4xl mx-auto"><Card><p className="text-center text-gray-500 py-12">Loan not found.</p></Card></div>;

  const cfg = statusConfig[loan.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;
  const progress = loan.amount > 0 ? Math.min((loan.repaidAmount / loan.amount) * 100, 100) : 0;
  const monthlyPayment = loan.amount / loan.term;
  const remainingBalance = loan.amount - loan.repaidAmount;
  const repayments = loan.repayments || [];
  const paidCount = repayments.filter((r) => r.status === "paid").length;
  const totalPayments = repayments.length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link to="/loans" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-neon-tangerine transition-colors">
        <ArrowLeft size={16} /> Back to Loans
      </Link>

      {/* Loan Header Card */}
      <Card className="overflow-hidden border-0">
        <div className="bg-gradient-to-br from-dark-lavender via-dark-lavender to-purple-900 p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${loan.status === "active" ? "bg-green-400" : loan.status === "pending" ? "bg-amber-400" : loan.status === "repaid" ? "bg-blue-400" : "bg-red-400"}`} />
                <span className="text-xs uppercase tracking-wider text-purple-200">{cfg.label}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">{formatNaira(loan.amount)}</h1>
              <p className="text-purple-200 text-sm mt-1">
                {loan.term} months &middot; {loan.interestRate}% p.a.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Banknote size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
          {[
            { label: "Monthly Payment", value: formatNaira(monthlyPayment), icon: TrendingUp },
            { label: "Repaid", value: formatNaira(loan.repaidAmount), icon: CheckCircle2, color: "text-green-600" },
            { label: "Remaining", value: formatNaira(remainingBalance), icon: Clock, color: "text-amber-600" },
            { label: "Progress", value: `${progress.toFixed(0)}%`, icon: Percent },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div key={stat.label} className="bg-white p-4 md:p-5">
                <div className="flex items-center gap-2 mb-1">
                  <StatIcon size={14} className={stat.color || "text-gray-400"} />
                  <span className="text-[11px] uppercase tracking-wider text-gray-500">{stat.label}</span>
                </div>
                <p className={`text-lg font-bold mt-1 ${stat.color || "text-gray-900"}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {loan.status === "active" && (
          <div className="px-4 md:px-5 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Repayment Progress ({paidCount}/{totalPayments} payments)</span>
              <span className="font-semibold text-green-600">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </Card>

      {/* Purpose */}
      {loan.purpose && (
        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Loan Purpose</p>
              <p className="text-sm text-gray-700">{loan.purpose}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Repayment Schedule */}
      {repayments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900">Repayment Schedule</h3>
              <p className="text-xs text-gray-500 mt-0.5">{paidCount} of {totalPayments} payments completed</p>
            </div>
            <Badge variant="default" size="sm">{totalPayments} payments</Badge>
          </div>
          <div className="space-y-1">
            {repayments.map((r, idx) => (
              <div key={r.id} className={`flex items-center justify-between p-3.5 rounded-xl ${
                r.status === "paid" ? "bg-green-50/50" : r.status === "overdue" ? "bg-red-50/50" : "bg-gray-50/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    r.status === "paid" ? "bg-green-100" : r.status === "overdue" ? "bg-red-100" : "bg-gray-100"
                  }`}>
                    {r.status === "paid" ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : r.status === "overdue" ? (
                      <AlertCircle size={16} className="text-red-500" />
                    ) : (
                      <Clock size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Payment {idx + 1}</p>
                    <p className="text-xs text-gray-500">{new Date(r.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${r.status === "paid" ? "text-green-600" : r.status === "overdue" ? "text-red-600" : "text-gray-900"}`}>
                    {r.status === "paid" ? "" : r.status === "overdue" ? "" : ""}{formatNaira(r.amount)}
                  </p>
                  <Badge variant={r.status === "paid" ? "success" : r.status === "overdue" ? "danger" : "default"} size="sm">{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
