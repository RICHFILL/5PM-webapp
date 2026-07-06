import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp, Users, CheckCircle2, DollarSign, Clock, AlertCircle } from "lucide-react";
import { reitApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import { formatNaira } from '../../utils/format';


export default function ReitPools() {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investPool, setInvestPool] = useState(null);
  const [shares, setShares] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("form");
  const [investmentPending, setInvestmentPending] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reitApi.getPools();
        setPools(Array.isArray(res) ? res : res?.data ?? []);
      } catch { setPools([]); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleInvest = async () => {
    if (!shares || parseFloat(shares) <= 0) return;
    setSaving(true);
    try {
      const investRes = await reitApi.invest(investPool.id, { shares: parseFloat(shares) });
      const isPending = investRes?.status === "pending" || investRes?.investmentStatus === "pending" || investRes?.data?.status === "pending";
      setInvestmentPending(isPending);
      const res = await reitApi.getPools();
      setPools(Array.isArray(res) ? res : res?.data ?? []);
      setStep("confirmation");
    } catch { /* silent */ } finally { setSaving(false); }
  };

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><div className="grid md:grid-cols-2 gap-6"><Skeleton.Card /><Skeleton.Card /></div></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-dark-lavender rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Digital REIT Pools</h1>
        <p className="text-purple-200">Invest in professionally managed real estate investment trusts</p>
      </div>

      {pools.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {pools.map((pool) => {
            const soldShares = parseFloat(pool.totalShares) - parseFloat(pool.availableShares);
            const pct = pool.totalShares > 0 ? (soldShares / pool.totalShares) * 100 : 0;
            return (
              <Card key={pool.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{pool.name}</h3>
                    <p className="text-sm text-gray-500">{pool.properties?.length || 0} properties in pool</p>
                  </div>
                  <Badge variant={pool.status === "open" ? "success" : "default"}>{pool.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pool.description || "No description."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Share Price</p>
                    <p className="text-sm font-bold text-gray-900">{formatNaira(pool.sharePrice)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Monthly Yield</p>
                    <p className="text-sm font-bold text-purple-600">{pool.monthlyYield ?? pool.annualYield}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="text-sm font-bold text-gray-900">{pool.availableShares}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">{pct.toFixed(0)}% funded ({soldShares} / {pool.totalShares} shares)</p>
                {pool.status === "open" && (
                  <Button onClick={() => { setInvestPool(pool); setStep("form"); setShares(""); }} className="w-full mt-auto" size="sm">
                    Buy Shares
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No REIT pools available yet.</p></Card>
      )}

      <Modal isOpen={!!investPool} onClose={() => setInvestPool(null)}
        title={step === "form" ? "Buy REIT Shares" : "Purchase Confirmed"} size="md">
        {step === "form" && investPool ? (
          <div className="space-y-4">
            <div className="bg-dark-lavender/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Pool</span><span className="font-semibold">{investPool.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Share Price</span><span className="font-semibold">{formatNaira(investPool.sharePrice)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Available</span><span className="font-semibold">{investPool.availableShares} shares</span></div>
            </div>
            <Input label="Number of Shares" type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="e.g. 10" min={1} max={investPool.availableShares} />
            {shares && parseFloat(shares) > 0 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Total Cost</span><span className="text-xl font-bold text-purple-600">{formatNaira(parseFloat(shares) * parseFloat(investPool.sharePrice))}</span></div>
              </div>
            )}
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setInvestPool(null)}>Cancel</Button>
              <Button onClick={handleInvest} disabled={saving || !shares || parseFloat(shares) <= 0}>Buy Shares</Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            {investmentPending ? (
              <>
                <Clock className="text-yellow-500 mx-auto" size={48} />
                <h3 className="text-lg font-semibold">Pending Approval</h3>
                <p className="text-sm text-gray-500">Your investment is awaiting verification.</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-green-600 mx-auto" size={48} />
                <h3 className="text-lg font-semibold">Investment Successful!</h3>
                <p className="text-sm text-gray-500">Your investment has been recorded.</p>
              </>
            )}
            <Button onClick={() => setInvestPool(null)} variant="secondary">Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
