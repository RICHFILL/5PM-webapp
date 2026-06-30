import { useState, useEffect } from "react";
import { Award, AlertCircle } from "lucide-react";
import { adminTokenApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminTokenApi.getAllTokens();
      setTokens(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setTokens([]);
      setError("Failed to load tokens");
      toast.error("Failed to load tokens");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Token Registry ({tokens.length})</h1>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Token ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Units</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Issued</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tokens.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-neon-tangerine/80">{t.tokenId}</td>
                <td className="px-6 py-4 text-gray-900">{t.propertyData?.title || "—"}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{t.units}</td>
                <td className="px-6 py-4"><Badge variant={t.status === "active" ? "success" : "default"}>{t.status}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tokens.length === 0 && <p className="text-gray-500 text-center py-12">No tokens issued.</p>}
      </Card>
      </div>
    </div>
  );
}
