import { useState, useEffect } from "react";
import { Search, Award, Home } from "lucide-react";
import { tokenApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenApi.getMyTokens();
        setTokens(Array.isArray(res) ? res : res?.data ?? []);
      } catch { setTokens([]); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Token Registry ({tokens.length})</h1>
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
                <td className="px-6 py-4 font-mono text-sm text-brand-600">{t.tokenId}</td>
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
