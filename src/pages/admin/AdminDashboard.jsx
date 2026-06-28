import { useState, useEffect } from "react";
import { Users, ShieldCheck, Wallet, TrendingUp, DollarSign, Activity } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

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
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-4 gap-4"><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /></div>
        <Skeleton.Card />
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: data?.totalUsers || 0, icon: Users, color: "bg-blue-500" },
    { label: "Active Investments", value: data?.activeInvestments || 0, icon: TrendingUp, color: "bg-green-500" },
    { label: "Total Invested", value: formatNaira(data?.totalInvested), icon: DollarSign, color: "bg-brand-500" },
    { label: "Pending KYC", value: data?.pendingKyc || 0, icon: ShieldCheck, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
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
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
        <p className="text-gray-600">Welcome to the 5PM Nexus Invest admin portal. Use the sidebar to manage users, KYC requests, wallets, investments, and more.</p>
      </Card>
    </div>
  );
}
