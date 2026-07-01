import { useState, useEffect } from "react";
import { Search, Gift, Plus, CheckCircle, XCircle, Clock, ChevronDown, Loader } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input, Pagination } from "../../components/common";
import toast from "react-hot-toast";
import { formatNaira } from '../../utils/format';

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
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ investmentId: "", amount: "", type: "monthly" });
  const [saving, setSaving] = useState(false);
  const [investSearch, setInvestSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetch = async () => {
    try {
      const data = await adminApi.getDistributions({ page, limit: 20 });
      setDistributions(Array.isArray(data) ? data : data?.data ?? data?.distributions ?? []);
      const pg = data?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch (err) {
      setDistributions([]);
      toast.error("Failed to load distributions");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const fetchInvestments = async () => {
    try {
      const data = await adminApi.getInvestments();
      setInvestments(Array.isArray(data) ? data : data?.data ?? []);
    } catch { /* ignore */ }
  };



  const selectedInvest = investments.find((i) => (i.id || i._id) === form.investmentId);

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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create distribution");
    }
    finally { setSaving(false); }
  };

  const handleApprove = async (id) => {
    try {
      await adminApi.approveDistribution(id);
      toast.success("Distribution approved");
      fetch();
    } catch { toast.error("Failed to approve distribution"); }
  };

  const handlePay = async (id) => {
    try {
      await adminApi.payDistribution(id);
      toast.success("Distribution paid");
      fetch();
    } catch { toast.error("Failed to pay distribution"); }
  };

  const filtered = distributions.filter((d) => {
    const q = search.toLowerCase();
    return (d.investment?.refNumber || "").toLowerCase().includes(q)
      || (d.user?.firstName || "").toLowerCase().includes(q)
      || (d.user?.lastName || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Distributions ({distributions.length})</h1>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus size={16} /> New Distribution</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by reference or user..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
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
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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
                <td className="px-6 py-4 text-right">
                  {d.status === "pending" && (
                    <Button size="sm" onClick={() => handleApprove(d.id || d._id)}>
                      <CheckCircle size={14} /> Approve
                    </Button>
                  )}
                  {d.status === "approved" && (
                    <Button size="sm" variant="secondary" onClick={() => handlePay(d.id || d._id)}>
                      <Loader size={14} /> Pay
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No distributions found.</p>}
      </Card>
      </div>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setForm({ investmentId: "", amount: "", type: "monthly" }); }} title="New Distribution" size="md">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment</label>
            <button type="button" onClick={() => { fetchInvestments(); setShowDropdown(!showDropdown); setInvestSearch(""); }}
              className="w-full flex items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine">
              <span className={selectedInvest ? "text-gray-900" : "text-gray-400"}>
                {selectedInvest ? `${selectedInvest.refNumber || "--"} - ${selectedInvest.investor?.firstName || selectedInvest.user?.firstName || ""} ${selectedInvest.investor?.lastName || selectedInvest.user?.lastName || ""}` : "Select an investment..."}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-100">
                  <input type="text" value={investSearch} onChange={(e) => setInvestSearch(e.target.value)} placeholder="Search by ref or name..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-neon-tangerine" autoFocus />
                </div>
                {investments.filter((i) => {
                  const q = investSearch.toLowerCase();
                  return (i.refNumber || "").toLowerCase().includes(q)
                    || (i.investor?.firstName || i.user?.firstName || "").toLowerCase().includes(q)
                    || (i.investor?.lastName || i.user?.lastName || "").toLowerCase().includes(q);
                }).map((i) => (
                  <button key={i.id || i._id} type="button" onClick={() => { setForm({ ...form, investmentId: i.id || i._id }); setShowDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neon-tangerine/10 transition-colors ${form.investmentId === (i.id || i._id) ? "bg-neon-tangerine/10 font-semibold" : ""}`}>
                    <span className="text-gray-900">{i.refNumber || "--"}</span>
                    <span className="text-gray-500 ml-2">{(i.investor?.firstName || i.user?.firstName || "")} {(i.investor?.lastName || i.user?.lastName || "")}</span>
                  </button>
                )) || <p className="text-center text-gray-400 py-4 text-sm">No investments found.</p>}
              </div>
            )}
          </div>
          <Input label="Amount (Ã¢â€šÂ¦)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 50000" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none">
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
