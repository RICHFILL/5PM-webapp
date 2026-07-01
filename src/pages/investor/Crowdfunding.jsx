import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Users, TrendingUp, Search, Calendar, Clock } from "lucide-react";
import { campaignApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import { formatNaira } from '../../utils/format';


export default function Crowdfunding() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await campaignApi.getCampaigns();
        setCampaigns(Array.isArray(res) ? res : res?.data ?? []);
      } catch { setCampaigns([]); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = campaigns.filter((c) =>
    (c.title || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-neon-tangerine rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Crowdfunding Campaigns</h1>
        <p className="text-blue-200">Pool funds with other investors to back promising real estate and projects</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none transition-all" />
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const progress = c.targetAmount > 0 ? (c.raisedAmount / c.targetAmount) * 100 : 0;
            const daysLeft = c.deadline ? Math.max(0, Math.ceil((new Date(c.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : null;
            return (
              <Card key={c.id} className="flex flex-col overflow-hidden p-0 hover:shadow-lg transition-shadow">
                <div className="h-40 bg-neon-tangerine flex items-center justify-center">
                  {c.images?.[0] ? (
                    <img src={c.images[0]} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <Target size={48} className="text-white/60" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <Badge variant={c.status === "active" ? "success" : "default"} size="sm">{c.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.description || "No description available."}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div className="bg-neon-tangerine h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{progress.toFixed(1)}% funded</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Raised</p>
                      <p className="text-sm font-bold text-gray-900">{formatNaira(c.raisedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="text-sm font-bold text-gray-900">{formatNaira(c.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min Investment</p>
                      <p className="text-sm font-bold text-neon-tangerine">{formatNaira(c.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Investors</p>
                      <p className="text-sm font-bold text-gray-900">{c.investorCount || 0}</p>
                    </div>
                  </div>
                  {daysLeft !== null && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <Clock size={12} />
                      <span>{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    </div>
                  )}
                  <Button onClick={() => navigate(`/crowdfunding/${c.id}`)} className="w-full mt-auto" size="sm">
                    View Campaign
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No campaigns found.</p></Card>
      )}
    </div>
  );
}
