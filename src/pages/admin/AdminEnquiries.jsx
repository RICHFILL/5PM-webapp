import { useState, useEffect } from "react";
import { Search, Mail, Filter, AlertCircle, Eye, CheckCheck, MessageSquare } from "lucide-react";
import { contactApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "new": return "warning";
    case "read": return "info";
    case "replied": return "success";
    default: return "default";
  }
};

const statusFilters = ["all", "new", "read", "replied"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      const data = await contactApi.getAllEnquiries(filters);
      setEnquiries(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setEnquiries([]);
      setError("Failed to load enquiries");
      toast.error("Failed to load enquiries");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await contactApi.updateEnquiryStatus(id, status);
      toast.success(`Marked as ${status}`);
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
      fetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    return (e.name || "").toLowerCase().includes(q)
      || (e.email || "").toLowerCase().includes(q)
      || (e.subject || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Enquiries ({enquiries.length})</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search enquiries..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter size={16} className="text-gray-400" />
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-neon-tangerine text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s}
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
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{e.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <a href={`mailto:${e.email}`} className="hover:text-neon-tangerine">{e.email}</a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{e.phone || "—"}</td>
                  <td className="px-6 py-4 text-gray-900 max-w-[200px] truncate">{e.subject}</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant(e.status)}>{e.status}</Badge></td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(e.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(selected?.id === e.id ? null : e)}
                        className="p-1.5 text-gray-400 hover:text-neon-tangerine transition-colors rounded-lg hover:bg-gray-100"
                        title="View details">
                        <Eye size={16} />
                      </button>
                      {e.status === "new" && (
                        <button onClick={() => updateStatus(e.id, "read")}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                          title="Mark as read">
                          <CheckCheck size={16} />
                        </button>
                      )}
                      {(e.status === "new" || e.status === "read") && (
                        <button onClick={() => updateStatus(e.id, "replied")}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                          title="Mark as replied">
                          <MessageSquare size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No enquiries found.</p>}
        </Card>
      </div>

      {selected && (
        <Card className="p-6 border-l-4 border-l-neon-tangerine">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-1">
                From: {selected.name} ({selected.email}){selected.phone ? ` — ${selected.phone}` : ""}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
            </div>
            <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</div>
          <div className="flex items-center gap-2 mt-4">
            {selected.status === "new" && (
              <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "read")}>
                <CheckCheck size={14} /> Mark as Read
              </Button>
            )}
            {(selected.status === "new" || selected.status === "read") && (
              <Button size="sm" variant="primary" onClick={() => updateStatus(selected.id, "replied")}>
                <MessageSquare size={14} /> Mark as Replied
              </Button>
            )}
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-tangerine hover:text-neon-tangerine/80 ml-auto">
              <Mail size={14} /> Reply via Email
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
