import { useState, useEffect } from "react";
import { Search, Target, Plus, Calendar, Clock } from "lucide-react";
import { adminCampaignApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "active": return "success";
    case "funded": return "info";
    case "draft": return "default";
    case "cancelled": return "danger";
    default: return "default";
  }
};

const defaultForm = { title: "", description: "", targetAmount: "", minInvestment: "", deadline: "", status: "draft" };

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await adminCampaignApi.getAllCampaigns({ status: statusFilter });
      setCampaigns(Array.isArray(res) ? res : res?.data ?? []);
    } catch { setCampaigns([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const handleSave = async () => {
    if (!form.title || !form.targetAmount) return;
    setSaving(true);
    try {
      await adminCampaignApi.createCampaign({
        title: form.title,
        description: form.description,
        targetAmount: parseFloat(form.targetAmount),
        minInvestment: form.minInvestment ? parseFloat(form.minInvestment) : 0,
        deadline: form.deadline || null,
        status: form.status,
      });
      setShowModal(false);
      setForm(defaultForm);
      fetch();
    } catch { /* silent */ } finally { setSaving(false); }
  };

  const filtered = campaigns.filter((c) =>
    (c.title || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Crowdfunding Campaigns ({campaigns.length})</h1>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={16} /> Create Campaign</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "active", "draft", "funded", "cancelled"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Raised</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => {
              const progress = c.targetAmount > 0 ? (c.raisedAmount / c.targetAmount) * 100 : 0;
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                  <td className="px-6 py-4 text-gray-600">{formatNaira(c.targetAmount)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatNaira(c.raisedAmount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={statusVariant(c.status)}>{c.status || "draft"}</Badge></td>
                  <td className="px-6 py-4 text-gray-500">{c.deadline ? formatDate(c.deadline) : "--"}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(c.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No campaigns found.</p>}
      </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); }} title="Create Campaign" size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Campaign name" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Amount (₦)" type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="e.g. 10000000" />
            <Input label="Min Investment (₦)" type="number" value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} placeholder="e.g. 50000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none" placeholder="Campaign description" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.targetAmount}>
              {saving ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
