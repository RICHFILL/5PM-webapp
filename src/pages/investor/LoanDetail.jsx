import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Banknote, CheckCircle2, Clock } from "lucide-react";
import { loanApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import { formatNaira } from '../../utils/format';


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

  const progress = loan.amount > 0 ? (loan.repaidAmount / loan.amount) * 100 : 0;
  const monthlyPayment = loan.amount / loan.term;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <Link to="/loans" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors">
        <ArrowLeft size={16} /> Back to Loans
      </Link>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{formatNaira(loan.amount)} Loan</h1>
            <p className="text-sm text-gray-500">{loan.term} months at {loan.interestRate}% p.a.</p>
          </div>
          <Badge variant={loan.status === "active" ? "success" : loan.status === "pending" ? "warning" : "default"} size="lg">{loan.status}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-lg font-bold text-gray-900">{formatNaira(loan.amount)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Repaid</p>
            <p className="text-lg font-bold text-green-600">{formatNaira(loan.repaidAmount)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="text-lg font-bold text-gray-900">{formatNaira(monthlyPayment)}</p>
          </div>
        </div>

        {loan.status === "active" && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>Repayment Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
          </div>
        )}

        {loan.purpose && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Purpose</p>
            <p className="text-sm text-gray-700">{loan.purpose}</p>
          </div>
        )}
      </Card>

      {loan.repayments?.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment Schedule</h3>
          <div className="space-y-2">
            {loan.repayments.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  {r.status === "paid" ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : (
                    <Clock size={18} className="text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatNaira(r.amount)}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(r.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={r.status === "paid" ? "success" : r.status === "overdue" ? "danger" : "default"} size="sm">{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
