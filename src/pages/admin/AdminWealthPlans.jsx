import { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
import { adminWealthApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Input, Modal } from "../../components/common";
import toast from "react-hot-toast";
import { formatNaira } from '../../utils/format';

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminWealthPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showContribute, setShowContribute] = useState(false);
  const [contributionForm, setContributionForm] = useState({ amount: "", reference: "" });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminWealthApi.getAllPlans();
      setPlans(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setPlans([]);
      setError(err?.response?.data?.message || err.message || "Failed to load wealth plans");
      toast.error("Failed to load wealth plans");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleContribute = async () => {
    if (!contributionForm.amount || !selectedPlan) return;
    setSaving(true);
    try {
      await adminWealthApi.recordContribution(selectedPlan.id, {
        amount: parseFloat(contributionForm.amount),
        reference: contributionForm.reference || null,
      });
      setShowContribute(false);
      setContributionForm({ amount: "", reference: "" });
      setSelectedPlan(null);
      toast.success("Contribution recorded");
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record contribution");
    }
    finally { setSaving(false); }
  };

  const filtered = plans.filter((p) => {
    const q = search.toLowerCase();
    return (p.planUser?.firstName || "").toLowerCase().includes(q)
      || (p.planUser?.lastName || "").toLowerCase().includes(q)
      || (p.planUser?.email || "").toLowerCase().includes(q);
  });

  const totalContributed = plans.reduce((s, p) => s + parseFloat(p.totalContributed || 0), 0);

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-24 w-full" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Wealth Plans ({plans.length})</h1>
      <div className="bg-dark-lavender rounded-xl p-6 text-white">
        <p className="text-sm text-emerald-100 mb-1">Total Contributed Across All Plans</p>
        <p className="text-2xl md:text-3xl font-bold">{formatNaira(totalContributed)}</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by user..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
      </div>
      <div className="overflow-x-auto -mx-6">
        {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monthly</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contributed</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.planUser?.firstName} {p.planUser?.lastName}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(p.monthlyContribution)}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(p.totalContributed)}</td>
                <td className="px-6 py-4 text-gray-500">{p.duration || "--"} mo</td>
                <td className="px-6 py-4"><Badge variant={p.status === "active" ? "success" : p.status === "completed" ? "info" : "danger"}>{p.status}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedPlan(p); setShowContribute(true); }}>Record Payment</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No wealth plans found.</p>}
      </Card>
      </div>

      <Modal isOpen={showContribute} onClose={() => { setShowContribute(false); setContributionForm({ amount: "", reference: "" }); }} title="Record Contribution" size="sm">
        {selectedPlan && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">{selectedPlan.planUser?.firstName} {selectedPlan.planUser?.lastName}</p>
              <p className="text-xs text-gray-500">Monthly: {formatNaira(selectedPlan.monthlyContribution)}</p>
            </div>
            <Input label="Amount (₦)" type="number" value={contributionForm.amount} onChange={(e) => setContributionForm({ ...contributionForm, amount: e.target.value })} placeholder="e.g. 50000" />
            <Input label="Reference (Optional)" value={contributionForm.reference} onChange={(e) => setContributionForm({ ...contributionForm, reference: e.target.value })} placeholder="Payment reference" />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => { setShowContribute(false); setContributionForm({ amount: "", reference: "" }); }}>Cancel</Button>
              <Button onClick={handleContribute} disabled={saving || !contributionForm.amount}>{saving ? "Recording..." : "Record Payment"}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
