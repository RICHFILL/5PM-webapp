import { useState, useEffect } from "react";
import { Search, Phone, Filter, AlertCircle, PhoneCall, CheckCircle, XCircle } from "lucide-react";
import { callbackApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "pending": return "warning";
    case "called": return "success";
    case "missed": return "danger";
    default: return "default";
  }
};

const statusFilters = ["all", "pending", "called", "missed"];

const timeLabel = (t) => {
  const labels = { anytime: "Anytime", morning: "Morning", afternoon: "Afternoon", evening: "Evening" };
  return labels[t] || t;
};

export default function AdminCallbacks() {
  const [callbacks, setCallbacks] = useState([]);
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
      const data = await callbackApi.getAll(filters);
      setCallbacks(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setCallbacks([]);
      setError("Failed to load callback requests");
      toast.error("Failed to load callback requests");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await callbackApi.updateStatus(id, status);
      toast.success(`Marked as ${status}`);
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
      fetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = callbacks.filter((c) => {
    const q = search.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Callback Requests ({callbacks.length})</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preferred Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4">
                    <a href={`tel:${c.phone}`} className="text-neon-tangerine hover:underline font-medium">{c.phone}</a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{timeLabel(c.preferredTime)}</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant(c.status)}>{c.status}</Badge></td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(selected?.id === c.id ? null : c)}
                        className="p-1.5 text-gray-400 hover:text-neon-tangerine transition-colors rounded-lg hover:bg-gray-100"
                        title="View details">
                        <Phone size={16} />
                      </button>
                      {c.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(c.id, "called")}
                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                            title="Mark as called">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => updateStatus(c.id, "missed")}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                            title="Mark as missed">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No callback requests found.</p>}
        </Card>
      </div>

      {selected && (
        <Card className="p-6 border-l-4 border-l-dark-lavender">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selected.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                <a href={`tel:${selected.phone}`} className="text-neon-tangerine hover:underline">{selected.phone}</a>
                {selected.email ? ` — ${selected.email}` : ""}
              </p>
              <p className="text-sm text-gray-500">Preferred: {timeLabel(selected.preferredTime)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
            </div>
            <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
          </div>
          {selected.message && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap mb-4">{selected.message}</div>
          )}
          {selected.status === "pending" && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => updateStatus(selected.id, "called")}>
                <CheckCircle size={14} /> Mark as Called
              </Button>
              <Button size="sm" variant="danger" onClick={() => updateStatus(selected.id, "missed")}>
                <XCircle size={14} /> Mark as Missed
              </Button>
              <a href={`tel:${selected.phone}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark-lavender hover:text-dark-lavender/80 ml-auto">
                <PhoneCall size={14} /> Call Now
              </a>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
