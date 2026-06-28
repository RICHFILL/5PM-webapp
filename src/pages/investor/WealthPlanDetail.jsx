import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PiggyBank, TrendingUp, CalendarDays, DollarSign, CheckCircle } from "lucide-react";
import { wealthApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "--";

export default function WealthPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wealthApi.getPlanDetail(id);
      setPlan(data?.data || data);
    } catch (err) {
      setPlan(null);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Card /><Skeleton.Card /></div>;
  }

  if (!plan) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span>
        </button>
        <Card><p className="text-lg font-semibold text-gray-900">Plan not found</p></Card>
      </div>
    );
  }

  const contributions = plan.contributions || [];
  const progress = plan.duration > 0 ? Math.min(100, Math.round((contributions.length / plan.duration) * 100)) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span>
      </button>

      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white overflow-hidden">
        <div className="px-4 py-4 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={plan.status === "active" ? "success" : plan.status === "completed" ? "info" : "danger"}>{plan.status}</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Salary Wealth Plan</h2>
              <p className="text-emerald-100">{plan.employerName ? `Employer: ${plan.employerName}` : "Self sponsored"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm min-w-[260px]">
              <div><p className="text-xs uppercase tracking-wide text-emerald-100">Monthly</p><p className="mt-1 text-lg md:text-xl font-bold">{formatNaira(plan.monthlyContribution)}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-emerald-100">Contributed</p><p className="mt-1 text-lg md:text-xl font-bold">{formatNaira(plan.totalContributed)}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-emerald-100">Duration</p><p className="mt-1 text-lg md:text-xl font-bold">{plan.duration || "--"} mo</p></div>
              <div><p className="text-xs uppercase tracking-wide text-emerald-100">Started</p><p className="mt-1 text-sm font-semibold">{formatDate(plan.startDate)}</p></div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">Progress</p>
          <p className="text-sm font-semibold text-gray-900">{contributions.length} / {plan.duration || "--"} months</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution History</h3>
        {contributions.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-[0.18em]">
                  <th className="text-left pb-3 font-semibold">Amount</th>
                  <th className="text-left pb-3 font-semibold">Date</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                  <th className="text-left pb-3 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 font-semibold text-gray-900">{formatNaira(c.amount)}</td>
                    <td className="py-3 text-gray-600">{formatDate(c.date)}</td>
                    <td className="py-3"><Badge variant={c.status === "verified" ? "success" : c.status === "pending" ? "warning" : "danger"}>{c.status}</Badge></td>
                    <td className="py-3 text-gray-500">{c.reference || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-8">No contributions recorded yet.</p>}
      </Card>
    </div>
  );
}
