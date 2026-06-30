import { useState, useEffect, useMemo } from "react";
import { FileText, Download, Filter, Calendar, TrendingUp, DollarSign, PiggyBank } from "lucide-react";
import { investmentApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import ReturnHistoryChart from "../../components/charts/ReturnHistoryChart";
import InvestmentPerformanceChart from "../../components/charts/InvestmentPerformanceChart";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const periods = ["This Month", "Last 3 Months", "Last 6 Months", "This Year", "All Time"];

export default function Reports() {
  const { user } = useAuthStore();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("All Time");

  const returnHistoryData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const currentMonth = new Date().getMonth();
    return months.map((month, i) => ({
      month,
      return: i <= currentMonth ? investments.reduce((sum, inv) => sum + Number(inv.interestEarned || 0) * ((i + 1) / 12), 0) : 0,
    }));
  }, [investments]);

  const performanceData = useMemo(() => {
    return investments.map((inv) => ({
      name: inv.project?.projectName || inv.refNumber || "Investment",
      invested: Number(inv.amount || 0),
      returns: Number(inv.interestEarned || 0),
    }));
  }, [investments]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await investmentApi.getMyInvestments();
        setInvestments(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        setInvestments([]);
      } finally { setLoading(false); }
    };
    if (user) fetch();
  }, [user]);

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalReturns = investments.reduce((sum, inv) => sum + (inv.interestEarned || 0), 0);
  const activeCount = investments.filter((inv) => inv.status === "active").length;

  const handleExport = () => {
    const headers = ["Reference", "Project", "Amount", "ROI", "Tenure", "Status", "Start Date", "End Date"];
    const rows = investments.map((inv) => [
      inv.refNumber, inv.project?.projectName || "N/A", inv.amount,
      `${inv.interestRatePerAnnum}%`, `${inv.tenure} months`,
      inv.status, formatDate(inv.startDate), formatDate(inv.endDate),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "investment-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Investment performance and analytics</p>
        </div>
        <Button onClick={handleExport} variant="outline"><Download size={16} /> Export CSV</Button>
      </div>

      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        {periods.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              period === p ? "bg-neon-tangerine text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {p}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-neon-tangerine rounded-xl p-5 text-white">
          <p className="text-sm text-cyan-100 mb-1">Total Invested</p>
          <p className="text-xl md:text-2xl font-bold">{formatNaira(totalInvested)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><TrendingUp size={14} className="text-green-500" />Total Returns</div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{formatNaira(totalReturns)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><PiggyBank size={14} className="text-neon-tangerine" />Active Investments</div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Return History</h3>
          <ReturnHistoryChart data={returnHistoryData} />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Performance</h3>
          <InvestmentPerformanceChart data={performanceData} />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-[0.18em]">
                  <th className="text-left pb-3 font-semibold">Ref #</th>
                  <th className="text-left pb-3 font-semibold">Project</th>
                  <th className="text-left pb-3 font-semibold">Amount</th>
                  <th className="text-left pb-3 font-semibold">Returns</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                  <th className="text-left pb-3 font-semibold">Start Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3"><span className="font-semibold text-cyan-600">{inv.refNumber}</span></td>
                    <td className="py-3 font-medium text-gray-900">{inv.project?.projectName || "Investment"}</td>
                    <td className="py-3 font-semibold text-gray-900">{formatNaira(inv.amount)}</td>
                    <td className="py-3 font-semibold text-green-600">{formatNaira(inv.interestEarned)}</td>
                    <td className="py-3">
                      <Badge variant={inv.status === "active" ? "warning" : inv.status === "completed" ? "success" : "default"}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-600">{formatDate(inv.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-8">No investment data available.</p>}
      </Card>
    </div>
  );
}
