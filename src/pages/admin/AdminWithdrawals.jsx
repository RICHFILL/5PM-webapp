import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle, XCircle, ArrowRight, Loader } from "lucide-react";
import { adminWithdrawalApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input, Pagination } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (s) => {
  switch (s) {
    case "completed": return "success";
    case "approved": return "info";
    case "processing": return "warning";
    case "pending": return "warning";
    case "rejected": return "danger";
    default: return "default";
  }
};

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionItem, setActionItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminWithdrawalApi.getAll(params);
      setWithdrawals(Array.isArray(res) ? res : res?.data ?? []);
      const pg = res?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch {
      setWithdrawals([]);
      setError("Failed to load withdrawals");
      toast.error("Failed to load withdrawals");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter, page]);

  const handleAction = async (id, action) => {
    setSaving(true);
    try {
      if (action === "approve") await adminWithdrawalApi.approve(id);
      else if (action === "process") await adminWithdrawalApi.markProcessing(id);
      else if (action === "complete") await adminWithdrawalApi.markCompleted(id);
      else if (action === "reject") await adminWithdrawalApi.reject(id, rejectNotes);
      setActionItem(null);
      setRejectNotes("");
      toast.success(`Withdrawal ${action}d`);
      fetch();
    } catch {
      toast.error(`Failed to ${action} withdrawal`);
    } finally { setSaving(false); }
  };

  const filtered = withdrawals.filter((w) => {
    const q = search.toLowerCase();
    return (w.withdrawalUser?.firstName || "").toLowerCase().includes(q)
      || (w.withdrawalUser?.lastName || "").toLowerCase().includes(q)
      || (w.withdrawalUser?.email || "").toLowerCase().includes(q);
  });

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Withdrawal Management ({withdrawals.length})</h1>
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "pending", "approved", "processing", "completed", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <div className="overflow-x-auto -mx-6">
        <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Requested</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{w.withdrawalUser?.firstName} {w.withdrawalUser?.lastName}</td>
                <td className="px-6 py-4 text-gray-600">{w.withdrawalUser?.email}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(w.amount)}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(w.requestDate || w.createdAt)}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant(w.status)}>{w.status}</Badge></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {w.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => { setActionItem(w); setActionType("reject"); setRejectNotes(""); }}>
                          <XCircle size={14} /> Reject
                        </Button>
                        <Button size="sm" onClick={() => { setActionItem(w); setActionType("approve"); }}>
                          <CheckCircle size={14} /> Approve
                        </Button>
                      </>
                    )}
                    {w.status === "approved" && (
                      <Button size="sm" onClick={() => handleAction(w.id, "process")}>
                        <ArrowRight size={14} /> Process
                      </Button>
                    )}
                    {w.status === "processing" && (
                      <Button size="sm" variant="secondary" onClick={() => handleAction(w.id, "complete")}>
                        <Loader size={14} /> Complete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No withdrawals found.</p>}
      </Card>
      </div>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      {actionItem && actionType === "approve" && (
        <Modal isOpen={true} onClose={() => setActionItem(null)} title="Approve Withdrawal" size="sm">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Approve withdrawal of {formatNaira(actionItem.amount)} for {actionItem.withdrawalUser?.firstName} {actionItem.withdrawalUser?.lastName}?
            </p>
            <p className="text-xs text-gray-500">The user will be notified, and you can process the payment afterward.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setActionItem(null)}>Cancel</Button>
              <Button onClick={() => handleAction(actionItem.id, "approve")} disabled={saving}>
                <CheckCircle size={16} /> Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {actionItem && actionType === "reject" && (
        <Modal isOpen={true} onClose={() => { setActionItem(null); setRejectNotes(""); }} title="Reject Withdrawal" size="sm">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Reject withdrawal of {formatNaira(actionItem.amount)} for {actionItem.withdrawalUser?.firstName}?</p>
            <Input label="Notes (reason)" type="text" value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} placeholder="Reason for rejection..." />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setActionItem(null); setRejectNotes(""); }}>Cancel</Button>
              <Button variant="danger" onClick={() => handleAction(actionItem.id, "reject")} disabled={saving}>
                <XCircle size={16} /> Reject & Reverse Funds
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
