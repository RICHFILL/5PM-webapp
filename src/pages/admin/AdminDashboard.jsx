import { useState, useEffect } from "react";
import { Users, ShieldCheck, TrendingUp, DollarSign, Activity, Building2, Wallet, CalendarDays, CheckCircle, Clock } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res?.data || res);
      } catch (err) {
        setData(null);
        toast.error("Failed to load dashboard data");
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-4 gap-4"><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /></div>
        <div className="grid md:grid-cols-2 gap-4"><Skeleton.Card /><Skeleton.Card /></div>
      </div>
    );
  }

  const stats = data?.stats || data || {};
  const monthlyInv = data?.monthlyInvestments || [];
  const recentWithdrawals = data?.pendingWithdrawalsList || [];
  const recentApprovals = data?.recentApprovals || [];

  const statCards = [
    { label: "Total Users", value: stats.totalInvestors || 0, icon: Users, color: "bg-blue-500" },
    { label: "Active Investments", value: stats.activeInvestments || 0, icon: TrendingUp, color: "bg-green-500" },
    { label: "Total Invested", value: formatNaira(stats.totalInvestmentValue || 0), icon: DollarSign, color: "bg-neon-tangerine" },
    { label: "Pending KYC", value: stats.pendingKYCReviews || 0, icon: ShieldCheck, color: "bg-yellow-500" },
    { label: "Active Projects", value: stats.activeProjects || 0, icon: Building2, color: "bg-purple-500" },
    { label: "Approved This Month", value: stats.approvedThisMonth || 0, icon: CalendarDays, color: "bg-cyan-500" },
    { label: "Total Deposits", value: formatNaira(stats.totalDeposits || 0), icon: Wallet, color: "bg-emerald-500" },
    { label: "Total Withdrawals", value: formatNaira(stats.totalWithdrawals || 0), icon: Activity, color: "bg-orange-500" },
  ];

  const maxMonthly = Math.max(...monthlyInv.map(m => m.value), 1);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-white`}>
                <s.icon size={20} />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Investments</h3>
          {monthlyInv.length > 0 ? (
            <div className="space-y-2">
              {monthlyInv.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-8">{m.month}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-tangerine rounded-full transition-all" style={{ width: `${(m.value / maxMonthly) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-20 text-right">{formatNaira(m.value)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No investment data yet.</p>}
        </Card>

        {data?.investmentDistribution?.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Project</h3>
            <div className="space-y-3">
              {data.investmentDistribution.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-900">{p.project}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(p.total)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentWithdrawals.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-yellow-500" /> Pending Withdrawals</h3>
            <div className="space-y-3">
              {recentWithdrawals.slice(0, 5).map((w) => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.withdrawalUser?.firstName} {w.withdrawalUser?.lastName}</p>
                    <p className="text-xs text-gray-500">{formatDate(w.requestDate || w.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(w.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {recentApprovals.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Recent Approvals</h3>
            <div className="space-y-3">
              {recentApprovals.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.investor?.firstName} {a.investor?.lastName}</p>
                    <p className="text-xs text-gray-500">{a.projectData?.projectName || a.project || "--"}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(a.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {(stats.totalPaymentAmountRecorded > 0 || stats.totalBalanceLeft > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500">Payments Recorded</p>
            <p className="text-xl font-bold text-gray-900">{formatNaira(stats.totalPaymentAmountRecorded)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500">Balance Left</p>
            <p className="text-xl font-bold text-gray-900">{formatNaira(stats.totalBalanceLeft)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500">Completed Investments</p>
            <p className="text-xl font-bold text-gray-900">{stats.completedInvestments || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
