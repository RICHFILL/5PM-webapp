import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal } from "../../components/common";

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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminApi.getKycRequests();
        setRequests(Array.isArray(data) ? data : data?.data ?? data?.kyc ?? []);
      } catch (err) {
        setRequests([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleReview = async (status) => {
    if (!selected) return;
    try {
      await adminApi.reviewKyc(selected.id || selected._id, status, "");
      setRequests((prev) => prev.map((r) => (r.id || r._id) === (selected.id || selected._id) ? { ...r, status } : r));
      setSelected(null);
    } catch (err) { /* silent */ }
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (r.user?.firstName || "").toLowerCase().includes(q)
      || (r.user?.lastName || "").toLowerCase().includes(q)
      || (r.user?.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">KYC Management ({requests.length})</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Review KYC Request" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Name</span><span className="font-semibold">{selected.user?.firstName} {selected.user?.lastName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Email</span><span className="font-semibold">{selected.user?.email}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Status</span><Badge variant={statusVariant(selected.status)}>{selected.status}</Badge></div>
            </div>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={() => handleReview("rejected")}>
                <XCircle size={16} /> Reject
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => handleReview("under-review")}>
                <Clock size={16} /> Mark Review
              </Button>
              <Button className="flex-1" onClick={() => handleReview("approved")}>
                <CheckCircle size={16} /> Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
