import { useState, useEffect } from "react";
import { Download, Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getReports();
        setData(res?.data || res);
      } catch (err) {
        setData(null);
        toast.error("Failed to load reports");
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleExport = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Users", data?.totalUsers || 0],
      ["Active Investments", data?.activeInvestments || 0],
      ["Total Invested", data?.totalInvested || 0],
      ["Total Interest Paid", data?.totalInterestPaid || 0],
      ["Pending KYC", data?.pendingKyc || 0],
    ];
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "admin-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><div className="grid md:grid-cols-2 gap-4"><Skeleton.Card /><Skeleton.Card /></div></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Reports</h1>
        <Button onClick={handleExport} variant="outline" size="sm"><Download size={16} /> Export CSV</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2"><Users size={16} className="text-blue-500" /><span className="text-gray-600">Total Users</span></div>
              <span className="font-bold text-gray-900">{data?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-green-500" /><span className="text-gray-600">Active Investments</span></div>
              <span className="font-bold text-gray-900">{data?.activeInvestments || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2"><DollarSign size={16} className="text-brand-500" /><span className="text-gray-600">Total Invested</span></div>
              <span className="font-bold text-gray-900">{formatNaira(data?.totalInvested)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2"><Activity size={16} className="text-yellow-500" /><span className="text-gray-600">Pending KYC</span></div>
              <span className="font-bold text-gray-900">{data?.pendingKyc || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2"><DollarSign size={16} className="text-purple-500" /><span className="text-gray-600">Total Interest Paid</span></div>
              <span className="font-bold text-gray-900">{formatNaira(data?.totalInterestPaid)}</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Report</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            This report provides a high-level overview of platform activity and key metrics. Use the export button to download the data as a CSV file for further analysis in your preferred spreadsheet application.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-4">
            For more detailed reports on specific areas (users, investments, KYC), please use the dedicated management pages accessible from the sidebar.
          </p>
        </Card>
      </div>
    </div>
  );
}
