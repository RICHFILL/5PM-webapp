import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, CircleDollarSign, CalendarDays } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "active": return "success";
    case "pending": return "warning";
    case "completed": return "info";
    case "cancelled": return "danger";
    default: return "default";
  }
};

export default function AdminInvestments() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminApi.getInvestments();
        setInvestments(Array.isArray(data) ? data : data?.data ?? data?.investments ?? []);
      } catch (err) {
        setInvestments([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = investments.filter((inv) => {
    const q = search.toLowerCase();
    return (inv.refNumber || "").toLowerCase().includes(q)
      || (inv.investor?.firstName || "").toLowerCase().includes(q)
      || (inv.investor?.lastName || "").toLowerCase().includes(q)
      || (inv.investor?.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Investments ({investments.length})</h1>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by reference or user..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-6">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((inv) => (
              <tr key={inv.id || inv._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/investments/${inv.id || inv._id}`)}>
                <td className="px-6 py-4 font-medium text-gray-900">{inv.refNumber || "--"}</td>
                <td className="px-6 py-4 text-gray-600">{(inv.investor?.firstName || inv.user?.firstName || "")} {(inv.investor?.lastName || inv.user?.lastName || "")}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(inv.amount)}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant(inv.status)}>{inv.status || "pending"}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(inv.startDate)}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(inv.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No investments found.</p>}
      </Card>
    </div>
  );
}
