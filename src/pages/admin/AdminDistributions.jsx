import { useState, useEffect } from "react";
import { Search, Gift, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "paid": return "success";
    case "approved": return "warning";
    case "pending": return "default";
    default: return "default";
  }
};

export default function AdminDistributions() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ investmentId: "", amount: "", type: "monthly" });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const data = await adminApi.getDistributions();
      setDistributions(Array.isArray(data) ? data : data?.data ?? data?.distributions ?? []);
    } catch (err) {
      setDistributions([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!form.investmentId || !form.amount) return;
    setSaving(true);
    try {
      await adminApi.createDistribution({
        investment: form.investmentId,
        amount: parseFloat(form.amount),
        type: form.type,
      });
      setShowCreate(false);
      setForm({ investmentId: "", amount: "", type: "monthly" });
      fetch();
    } catch (err) { /* silent */ }
    finally { setSaving(false); }
  };

  const filtered = distributions.filter((d) => {
    const q = search.toLowerCase();
    return (d.investment?.refNumber || "").toLowerCase().includes(q)
      || (d.user?.firstName || "").toLowerCase().includes(q)
      || (d.user?.lastName || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Distributions ({distributions.length})</h1>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus size={16} /> New Distribution</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by reference or user..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      <div className="overflow-x-auto -mx-6">
        <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Investment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id || d._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium">{d.user?.firstName || "--"} {d.user?.lastName || ""}</td>
                <td className="px-6 py-4 text-gray-600">{d.investment?.refNumber || "--"}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(d.amount)}</td>
                <td className="px-6 py-4"><Badge variant={d.type === "monthly" ? "info" : "default"}>{d.type || "monthly"}</Badge></td>
                <td className="px-6 py-4"><Badge variant={statusVariant(d.status)}>{d.status || "pending"}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No distributions found.</p>}
      </Card>
      </div>

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setForm({ investmentId: "", amount: "", type: "monthly" }); }} title="New Distribution" size="md">
        <div className="space-y-4">
          <Input label="Investment ID" value={form.investmentId} onChange={(e) => setForm({ ...form, investmentId: e.target.value })} placeholder="Investment UUID" />
          <Input label="Amount (₦)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 50000" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowCreate(false); setForm({ investmentId: "", amount: "", type: "monthly" }); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !form.investmentId || !form.amount}>
              {saving ? "Creating..." : "Create Distribution"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
