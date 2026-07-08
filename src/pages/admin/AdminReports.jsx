import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp, Users, DollarSign, Activity, Wallet, Download, Calendar,
  CheckCircle, Clock, XCircle, Target, BarChart3, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";
import toast from "react-hot-toast";
import { formatNaira } from "../../utils/format";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function StatCard({ icon: Icon, label, value, sub, trend, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center`}>
          <Icon size={20} className={color.text} />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function MetricRow({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && <Icon size={15} className={color || "text-gray-400 shrink-0"} />}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-4">{value}</span>
    </div>
  );
}

function TableCard({ title, headers, rows, onExport, exportLabel }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {onExport && (
          <button onClick={onExport} className="inline-flex items-center gap-1.5 text-xs font-medium text-neon-tangerine hover:text-neon-tangerine/80">
            <Download size={13} /> {exportLabel || "CSV"}
          </button>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No data available</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {headers.map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 px-4 first:pl-4 sm:first:pl-0 last:pr-4 sm:last:pr-0 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2.5 text-sm text-gray-700 px-4 first:pl-4 sm:first:pl-0 last:pr-4 sm:last:pr-0 whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getReports();
        setData(res?.data || res);
        const now = new Date();
        setDateLabel(`${MONTHS[now.getMonth()]} ${now.getFullYear()}`);
      } catch (err) {
        setData(null);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleExportAll = () => {
    if (!data) return;
    const lines = ["5PM Nexus Invest - Admin Report", `Generated: ${new Date().toISOString().split('T')[0]}`, ""];
    const sections = [
      ["Users", ["Metric", "Value"], [[`Total Users`, data.users?.total], [`New This Month`, data.users?.newThisMonth], [`KYC Approved`, data.users?.kycApproved]]],
      ["Investments", ["Metric", "Value"], [[`Total Invested`, formatNaira(data.investments?.totalInvested)], [`Active`, data.investments?.active], [`Completed`, data.investments?.completed], [`Total Interest Paid`, formatNaira(data.investments?.totalInterestPaid)], [`Avg ROI`, `${data.investments?.avgRoi}%`]]],
      ["KYC", ["Metric", "Value"], [[`Pending`, data.kyc?.pending], [`Approved`, data.kyc?.approved], [`Rejected`, data.kyc?.rejected]]],
      ["Financials", ["Metric", "Value"], [[`Total Deposits`, formatNaira(data.financials?.totalDeposits)], [`Total Withdrawals`, formatNaira(data.financials?.totalWithdrawals)], [`Interest Paid`, formatNaira(data.financials?.totalInterestPaid)]]],
    ];
    sections.forEach(([title, headers, rows]) => {
      lines.push(`--- ${title} ---`);
      lines.push(headers.join(","));
      rows.forEach((r) => lines.push(r.join(",")));
      lines.push("");
    });
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = useMemo(() => {
    if (!data?.trends?.monthly) return [];
    return data.trends.monthly.map((r) => {
      const d = new Date(r.month);
      return { name: MONTHS[d.getMonth()], value: Number(r.value) };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
        <div className="grid md:grid-cols-2 gap-4"><Skeleton.Card /><Skeleton.Card /></div>
      </div>
    );
  }

  const d = data || {};
  const us = d.users || {};
  const inv = d.investments || {};
  const kyc = d.kyc || {};
  const fin = d.financials || {};
  const txs = d.recentTransactions || [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <BarChart3 size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500">Platform performance and activity overview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
            <Calendar size={13} /> {dateLabel}
          </span>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 bg-neon-tangerine text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-neon-tangerine/90 transition-colors"
          >
            <Download size={15} /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={us.total?.toLocaleString() || "0"} sub={`${us.newThisMonth || 0} new this month`} color={{ bg: "bg-blue-50", text: "text-blue-600" }} />
        <StatCard icon={TrendingUp} label="Active Investments" value={inv.active?.toLocaleString() || "0"} sub={`${inv.completed || 0} completed`} color={{ bg: "bg-green-50", text: "text-green-600" }} />
        <StatCard icon={DollarSign} label="Total Invested" value={formatNaira(inv.totalInvested)} sub={`${inv.totalCount || 0} total investments`} color={{ bg: "bg-neon-tangerine/10", text: "text-neon-tangerine" }} />
        <StatCard icon={Activity} label="Pending KYC" value={kyc.pending?.toLocaleString() || "0"} sub={`${kyc.approved || 0} approved`} color={{ bg: "bg-amber-50", text: "text-amber-600" }} />
        <StatCard icon={Wallet} label="Total Deposits" value={formatNaira(fin.totalDeposits)} sub={`${d.pendingDeposits || 0} pending`} color={{ bg: "bg-emerald-50", text: "text-emerald-600" }} />
        <StatCard icon={Target} label="Avg ROI" value={`${inv.avgRoi || 0}%`} sub="Across active investments" color={{ bg: "bg-purple-50", text: "text-purple-600" }} />
        <StatCard icon={ArrowUpRight} label="Net Flow" value={formatNaira(fin.netFlow)} sub="Deposits - Withdrawals" trend={fin.netFlow > 0 ? 100 : fin.netFlow < 0 ? -100 : 0} color={{ bg: "bg-cyan-50", text: "text-cyan-600" }} />
        <StatCard icon={DollarSign} label="Interest Paid" value={formatNaira(fin.totalInterestPaid)} color={{ bg: "bg-orange-50", text: "text-orange-600" }} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Monthly Investment Trend</h3>
            <span className="text-xs text-gray-400">{dateLabel}</span>
          </div>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">No investment data this year</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    formatter={(value) => [formatNaira(Number(value)), "Invested"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Bar dataKey="value" fill="#FF6B35" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">KYC Summary</h3>
            <span className="text-xs text-gray-400">{kyc.total || 0} total</span>
          </div>
          <div className="space-y-1">
            <MetricRow label="Approved" value={kyc.approved?.toLocaleString() || "0"} icon={CheckCircle} color="text-green-500" />
            <MetricRow label="Pending Review" value={kyc.pending?.toLocaleString() || "0"} icon={Clock} color="text-amber-500" />
            <MetricRow label="Rejected" value={kyc.rejected?.toLocaleString() || "0"} icon={XCircle} color="text-red-500" />
          </div>
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Investment Breakdown</h4>
            <div className="space-y-1">
              <MetricRow label="Active" value={inv.active?.toLocaleString() || "0"} icon={TrendingUp} color="text-green-500" />
              <MetricRow label="Completed" value={inv.completed?.toLocaleString() || "0"} icon={CheckCircle} color="text-blue-500" />
              <MetricRow label="Pending" value={inv.pending?.toLocaleString() || "0"} icon={Clock} color="text-amber-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Financial Summary</h3>
          <div className="space-y-1">
            <MetricRow label="Total Deposits (Approved)" value={formatNaira(fin.totalDeposits)} icon={Wallet} color="text-emerald-500" />
            <MetricRow label="Total Withdrawals (Approved)" value={formatNaira(fin.totalWithdrawals)} icon={ArrowUpRight} color="text-red-500" />
            <MetricRow label="Interest Paid to Investors" value={formatNaira(fin.totalInterestPaid)} icon={DollarSign} color="text-orange-500" />
            <MetricRow label="Net Platform Flow" value={formatNaira(fin.netFlow)} icon={Activity} color={fin.netFlow >= 0 ? "text-green-500" : "text-red-500"} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-3">User Metrics</h3>
          <div className="space-y-1">
            <MetricRow label="Total Registered" value={us.total?.toLocaleString() || "0"} icon={Users} color="text-blue-500" />
            <MetricRow label="New This Month" value={us.newThisMonth?.toLocaleString() || "0"} icon={Calendar} color="text-purple-500" />
            <MetricRow label="KYC Approved" value={us.kycApproved?.toLocaleString() || "0"} icon={CheckCircle} color="text-green-500" />
            <MetricRow label="Avg ROI" value={`${inv.avgRoi || 0}%`} icon={Target} color="text-neon-tangerine" />
          </div>
        </Card>
      </div>

      <TableCard
        title="Recent Transactions"
        headers={["Date", "Type", "Description", "Amount", "Status"]}
        exportLabel="Export CSV"
        onExport={() => {
          const headers = ["Date", "Type", "Description", "Amount", "Status"];
          const rows = txs.map((t) => [
            new Date(t.createdAt).toLocaleDateString(),
            t.type,
            t.description || "-",
            formatNaira(t.amount),
            t.status,
          ]);
          const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
          URL.revokeObjectURL(url);
        }}
        rows={txs.map((t) => [
          <span className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString("en-GB")}</span>,
          <span className="text-xs font-medium text-gray-700 capitalize">{t.type?.replace(/_/g, " ")}</span>,
          <span className="text-xs text-gray-500">{t.description || "-"}</span>,
          <span className="text-xs font-semibold text-gray-900">{formatNaira(t.amount)}</span>,
          <Badge variant={t.status === "completed" || t.status === "approved" ? "success" : t.status === "pending" ? "warning" : "danger"} className="text-[10px] px-2 py-0.5">{t.status}</Badge>,
        ])}
      />
    </div>
  );
}
