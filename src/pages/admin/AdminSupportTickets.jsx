import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, Filter, AlertCircle } from "lucide-react";
import { adminTicketApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "open": return "warning";
    case "in_progress": return "info";
    case "resolved": return "success";
    case "closed": return "default";
    default: return "default";
  }
};

const statusFilters = ["all", "open", "in_progress", "resolved", "closed"];

export default function AdminSupportTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      const data = await adminTicketApi.getAllTickets(filters);
      setTickets(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setTickets([]);
      setError("Failed to load tickets");
      toast.error("Failed to load tickets");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (t.subject || "").toLowerCase().includes(q)
      || (t.ticketUser?.firstName || "").toLowerCase().includes(q)
      || (t.ticketUser?.lastName || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Support Tickets ({tickets.length})</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter size={16} className="text-gray-400" />
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-neon-tangerine text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s.replace("_", " ")}
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/support/${t.id}`)}>
                <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">{t.subject}</td>
                <td className="px-6 py-4 text-gray-600">{t.ticketUser?.firstName} {t.ticketUser?.lastName}</td>
                <td className="px-6 py-4"><Badge variant="default">{t.category}</Badge></td>
                <td className="px-6 py-4">
                  <Badge variant={t.priority === "urgent" ? "danger" : t.priority === "high" ? "warning" : "default"}>{t.priority}</Badge>
                </td>
                <td className="px-6 py-4"><Badge variant={statusVariant(t.status)}>{t.status?.replace("_", " ")}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No tickets found.</p>}
      </Card>
      </div>
    </div>
  );
}
