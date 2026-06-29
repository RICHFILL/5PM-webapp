import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Clock, Search, ExternalLink, AlertCircle } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Pagination } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "approved": return "success";
    case "under-review": return "warning";
    case "rejected": return "danger";
    default: return "default";
  }
};

export default function AdminKyc() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getKycRequests({ page, limit: 20 });
      setRequests(Array.isArray(data) ? data : data?.data ?? data?.kyc ?? []);
      const pg = data?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch (err) {
      setRequests([]);
      setError(err?.response?.data?.message || err.message || "Failed to load KYC requests");
      toast.error("Failed to load KYC requests");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleReview = async (status) => {
    if (!selected) return;
    try {
      await adminApi.reviewKyc(selected.id || selected._id, status, status === "rejected" ? rejectionNote : "");
      setRequests((prev) => prev.map((r) => (r.id || r._id) === (selected.id || selected._id) ? { ...r, status } : r));
      setSelected(null);
      setRejectionNote("");
      setConfirmReject(false);
      toast.success(`KYC ${status}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update KYC");
    }
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (r.user?.firstName || "").toLowerCase().includes(q)
      || (r.user?.lastName || "").toLowerCase().includes(q)
      || (r.user?.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">KYC Management ({requests.length})</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
                    <button onClick={fetchData} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-6">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id || r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{r.user?.firstName} {r.user?.lastName}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{r.user?.email}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(r.createdAt)}</td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant(r.status)}>{r.status || "pending"}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" onClick={() => setSelected(r)} disabled={r.status === "approved" || r.status === "rejected"}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No KYC requests found.</p>}
      </Card>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectionNote(""); setConfirmReject(false); }} title="Review KYC Request" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Name</span><span className="font-semibold">{selected.user?.firstName} {selected.user?.lastName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Email</span><span className="font-semibold">{selected.user?.email}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Status</span><Badge variant={statusVariant(selected.status)}>{selected.status}</Badge></div>
              {selected.user?.phone && <div className="flex justify-between text-sm"><span className="text-gray-600">Phone</span><span className="font-semibold">{selected.user.phone}</span></div>}
            </div>

            {(selected.documents?.length > 0 || selected.documentUrls?.length > 0) && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</p>
                <div className="grid grid-cols-2 gap-3">
                  {(selected.documents || selected.documentUrls || []).map((doc, i) => (
                    <a key={i} href={doc.url || doc} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 text-sm text-brand-600 hover:bg-brand-50 transition-colors border border-gray-200">
                      <ExternalLink size={14} />
                      <span className="truncate">{doc.name || `Document ${i + 1}`}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selected.status !== "approved" && selected.status !== "rejected" && (
              <>
                {confirmReject ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (required)</label>
                      <textarea value={rejectionNote} onChange={(e) => setRejectionNote(e.target.value)} rows={3} placeholder="Explain why this KYC is being rejected..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setConfirmReject(false)}>Back</Button>
                      <Button variant="danger" className="flex-1" onClick={() => handleReview("rejected")} disabled={!rejectionNote.trim()}>
                        <XCircle size={16} /> Confirm Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="danger" className="flex-1" onClick={() => setConfirmReject(true)}>
                      <XCircle size={16} /> Reject
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => handleReview("under-review")}>
                      <Clock size={16} /> Mark Review
                    </Button>
                    <Button className="flex-1" onClick={() => handleReview("approved")}>
                      <CheckCircle size={16} /> Approve
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
