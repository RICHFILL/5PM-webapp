import { useState, useEffect } from "react";
import { Search, Wallet, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Input } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminApi.getWallets();
        setWallets(Array.isArray(data) ? data : data?.data ?? data?.wallets ?? []);
      } catch (err) {
        setWallets([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = wallets.filter((w) => {
    const q = search.toLowerCase();
    return (w.user?.firstName || "").toLowerCase().includes(q)
      || (w.user?.lastName || "").toLowerCase().includes(q)
      || (w.user?.email || "").toLowerCase().includes(q);
  });

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-24 w-full" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
      <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-xl p-6 text-white">
        <p className="text-sm text-cyan-100 mb-1">Total Wallet Balance</p>
        <p className="text-3xl font-bold">{formatNaira(totalBalance)}</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by user..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((w) => (
              <tr key={w.id || w._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{w.user?.firstName} {w.user?.lastName}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{w.user?.email}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{formatNaira(w.balance || 0)}</td>
                <td className="px-6 py-4">
                  <Badge variant={w.currency === "USD" ? "warning" : "default"}>{w.currency || "NGN"}</Badge>
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(w.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No wallets found.</p>}
      </Card>
    </div>
  );
}
