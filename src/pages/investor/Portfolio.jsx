import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, Wallet, Percent, PieChartIcon, Shield } from "lucide-react";
import { userApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton } from "../../components/common";
import PortfolioGrowthChart from "../../components/charts/PortfolioGrowthChart";
import { formatNaira } from '../../utils/format';


const COLORS = ["#00B8DB", "#1E3A5F", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function Portfolio() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [userData, statsData] = await Promise.all([
          userApi.getUserById(user._id),
          userApi.getUserStats(user._id),
        ]);
        const fetchedUser = userData?.data || userData;
        setInvestments(fetchedUser?.investments || []);
        setStats(statsData?.data || statsData);
      } catch (err) {
        // silent
      } finally { setLoading(false); }
    };
    if (user?._id) fetch();
  }, [user?._id]);

  const allocationData = useMemo(() => {
    if (investments.length === 0) return [];
    const total = investments.reduce((s, inv) => s + Number(inv.amount || 0), 0);
    return investments.map((inv) => ({
      name: inv.project?.projectName || inv.refNumber || "Investment",
      value: total > 0 ? Math.round((Number(inv.amount || 0) / total) * 100) : 0,
    }));
  }, [investments]);

  const performanceData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map((month, i) => ({
      month,
      value: investments.reduce((sum, inv) => {
        const start = inv.startDate ? new Date(inv.startDate).getMonth() : 0;
        return sum + (i >= start ? Number(inv.amount || 0) : 0);
      }, 0),
    }));
  }, [investments]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Portfolio</h1>
        <p className="text-gray-600">Track your investment performance and allocations</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-neon-tangerine rounded-xl p-5 text-white">
          <p className="text-sm text-cyan-100 mb-1">Total Portfolio Value</p>
          <p className="text-xl md:text-2xl font-bold">{formatNaira(stats?.totalInvested)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><TrendingUp size={14} className="text-green-500" />Total Returns</div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{formatNaira(stats?.totalInterestEarned)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Percent size={14} className="text-neon-tangerine" />Avg. ROI</div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">3.5%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Shield size={14} className="text-dark-lavender" />Risk Score</div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">Moderate</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Growth</h3>
          <PortfolioGrowthChart data={performanceData} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {allocationData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Holdings</h3>
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-[0.18em]">
                  <th className="text-left pb-3 font-semibold">Investment</th>
                  <th className="text-left pb-3 font-semibold">Amount</th>
                  <th className="text-left pb-3 font-semibold">ROI</th>
                  <th className="text-left pb-3 font-semibold">Tenure</th>
                  <th className="text-right pb-3 font-semibold">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, i) => (
                  <tr key={inv._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-gray-900">{inv.project?.projectName || "Investment"}</span>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-gray-900">{formatNaira(inv.amount)}</td>
                    <td className="py-3 text-gray-600">{inv.interestRatePerAnnum}%</td>
                    <td className="py-3 text-gray-600">{inv.tenure} months</td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-neon-tangerine">{inv.amount / (stats?.totalInvested || 1) * 100}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-8">No holdings yet. Start investing to build your portfolio.</p>}
      </Card>
    </div>
  );
}
