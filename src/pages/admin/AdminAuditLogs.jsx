import { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
import { adminAuditApi } from "../../services/api";
import { Card, Skeleton, Badge, Pagination } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "--";

const actionVariant = (action) => {
  if (action?.includes("approved")) return "success";
  if (action?.includes("rejected")) return "danger";
  if (action?.includes("created") || action?.includes("paid")) return "info";
  return "default";
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAuditApi.getAll({ page, limit: 50 });
      setLogs(Array.isArray(res) ? res : res?.data ?? []);
      const pg = res?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch {
      setLogs([]);
      setError("Failed to load audit logs");
      toast.error("Failed to load audit logs");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (l.auditAdmin?.firstName || "").toLowerCase().includes(q)
      || (l.auditAdmin?.lastName || "").toLowerCase().includes(q)
      || (l.action || "").toLowerCase().includes(q)
      || (l.resource || "").toLowerCase().includes(q)
      || (l.auditLogUser?.firstName || "").toLowerCase().includes(q)
      || (l.auditLogUser?.lastName || "").toLowerCase().includes(q);
  });

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Audit Logs ({logs.length})</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search admin, action, resource..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine outline-none text-sm" />
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
          <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {l.auditAdmin?.firstName} {l.auditAdmin?.lastName}
                  <span className="text-gray-400 text-xs ml-1">({l.auditAdmin?.email})</span>
                </td>
                <td className="px-6 py-4"><Badge variant={actionVariant(l.action)} size="sm">{l.action}</Badge></td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">{l.resource}</span>
                  {l.resourceId && <span className="text-gray-400 text-xs ml-1">#{l.resourceId?.slice(0, 8)}</span>}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {l.auditLogUser ? `${l.auditLogUser.firstName} ${l.auditLogUser.lastName}` : "-"}
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(l.timestamp || l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No audit logs found.</p>}
      </Card>
      </div>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
    </div>
  );
}
