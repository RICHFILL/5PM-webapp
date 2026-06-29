import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { adminDepositApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input, Pagination } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (s) => {
  switch (s) {
    case "approved": return "success";
    case "pending": return "warning";
    case "rejected": return "danger";
    default: return "default";
  }
};

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionDeposit, setActionDeposit] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminDepositApi.getAll(params);
      const pg = res?.pagination;
      setDeposits(Array.isArray(res) ? res : res?.data ?? []);
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch {
      setDeposits([]);
      setError("Failed to load deposits");
      toast.error("Failed to load deposits");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter, page]);

  const handleApprove = async (id) => {
    setSaving(true);
    try {
      await adminDepositApi.approve(id);
      setActionDeposit(null);
      toast.success("Deposit approved");
      fetch();
    } catch {
      toast.error("Failed to approve deposit");
    } finally { setSaving(false); }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    setSaving(true);
    try {
      await adminDepositApi.reject(id, rejectReason);
      setActionDeposit(null);
      setRejectReason("");
      setConfirmReject(false);
      toast.success("Deposit rejected");
      fetch();
    } catch {
      toast.error("Failed to reject deposit");
    } finally { setSaving(false); }
  };

  const filtered = deposits.filter((d) => {
    const q = search.toLowerCase();
    return (d.depositor?.firstName || "").toLowerCase().includes(q)
      || (d.depositor?.lastName || "").toLowerCase().includes(q)
      || (d.depositor?.email || "").toLowerCase().includes(q);
  });

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Deposit Management ({deposits.length})</h1>
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "pending", "approved", "rejected"].map((s) => (
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{d.depositor?.firstName} {d.depositor?.lastName}</td>
                <td className="px-6 py-4 text-gray-600">{d.depositor?.email}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(d.amount)}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(d.createdAt)}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                <td className="px-6 py-4 text-right">
                  {d.status === "pending" && (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" onClick={() => { setActionDeposit(d); setConfirmReject(false); setRejectReason(""); }}>Review</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No deposits found.</p>}
      </Card>
      </div>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      {actionDeposit && (
        <Modal isOpen={true} onClose={() => { setActionDeposit(null); setRejectReason(""); setConfirmReject(false); }} title="Review Deposit" size="sm">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">User</span><span className="font-semibold">{actionDeposit.depositor?.firstName} {actionDeposit.depositor?.lastName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Amount</span><span className="font-semibold">{formatNaira(actionDeposit.amount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Date</span><span className="font-semibold">{formatDate(actionDeposit.createdAt)}</span></div>
            </div>
            {confirmReject ? (
              <div className="space-y-3">
                <Input label="Rejection Reason (required)" type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmReject(false)}>Back</Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleReject(actionDeposit.id)} disabled={saving || !rejectReason.trim()}>
                    <XCircle size={16} /> Confirm Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => setConfirmReject(true)}>
                  <XCircle size={16} /> Reject
                </Button>
                <Button className="flex-1" onClick={() => handleApprove(actionDeposit.id)} disabled={saving}>
                  <CheckCircle size={16} /> Approve
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
