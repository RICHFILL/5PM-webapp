import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Target, Users, TrendingUp, CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";
import { campaignApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvest, setShowInvest] = useState(false);
  const [amount, setAmount] = useState("");
  const [investStep, setInvestStep] = useState("form");
  const [investLoading, setInvestLoading] = useState(false);
  const [investError, setInvestError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await campaignApi.getCampaignDetail(id);
        setCampaign(res?.data || res);
      } catch { setCampaign(null); } finally { setLoading(false); }
    };
    if (id) fetch();
  }, [id]);

  const progress = campaign?.targetAmount > 0
    ? (campaign.raisedAmount / campaign.targetAmount) * 100 : 0;

  const daysLeft = campaign?.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleInvest = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (campaign.minInvestment && amt < parseFloat(campaign.minInvestment)) {
      setInvestError(`Minimum investment is ${formatNaira(campaign.minInvestment)}`);
      return;
    }
    setInvestLoading(true); setInvestError("");
    try {
      await campaignApi.invest(id, { amount: amt });
      const res = await campaignApi.getCampaignDetail(id);
      setCampaign(res?.data || res);
      setInvestStep("confirmation");
    } catch (err) {
      setInvestError(err?.response?.data?.message || err.message || "Investment failed");
    } finally { setInvestLoading(false); }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-48 w-full" />
        <Skeleton.Card />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card><p className="text-center text-gray-500 py-12">Campaign not found.</p></Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/crowdfunding" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors">
        <ArrowLeft size={16} /> Back to Campaigns
      </Link>

      <div className="h-48 md:h-56 rounded-2xl bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center overflow-hidden">
        {campaign.images?.[0] ? (
          <img src={campaign.images[0]} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <Target size={64} className="text-white/60" />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                {campaign.projectData && (
                  <p className="text-sm text-gray-500 mt-1">Project: {campaign.projectData.projectName}</p>
                )}
              </div>
              <Badge variant={campaign.status === "active" ? "success" : "default"} size="lg">{campaign.status}</Badge>
            </div>
            <p className="text-gray-600 leading-relaxed">{campaign.description || "No description available."}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investors</h3>
            {campaign.investments?.length > 0 ? (
              <div className="space-y-3">
                {campaign.investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-navy-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {inv.investor?.firstName} {inv.investor?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatNaira(inv.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No investments yet. Be the first!</p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Progress</h3>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
              <div className="bg-brand-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{progress.toFixed(1)}% funded</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Raised</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{formatNaira(campaign.raisedAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Target</p>
                <p className="text-lg font-semibold text-gray-900">{formatNaira(campaign.targetAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Min Investment</p>
                <p className="text-lg font-semibold text-brand-500">{formatNaira(campaign.minInvestment)}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <TrendingUp size={20} className="text-brand-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Investors</p>
              <p className="text-sm font-bold text-gray-900">{campaign.investments?.length || 0}</p>
            </div>
            {daysLeft !== null && (
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Clock size={20} className="text-brand-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Days Left</p>
                <p className="text-sm font-bold text-gray-900">{daysLeft}</p>
              </div>
            )}
          </div>

          {campaign.status === "active" && (
            <Button className="w-full" onClick={() => { setShowInvest(true); setInvestStep("form"); setAmount(""); setInvestError(""); }}>
              Invest Now
            </Button>
          )}
        </div>
      </div>

      <Modal isOpen={showInvest} onClose={() => setShowInvest(false)}
        title={investStep === "form" ? "Invest in Campaign" : "Investment Confirmed"} size="md">
        {investStep === "form" ? (
          <div className="space-y-4">
            <div className="bg-navy-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Campaign</span><span className="font-semibold">{campaign.title}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Min Investment</span><span className="font-semibold">{formatNaira(campaign.minInvestment)}</span></div>
            </div>
            <Input label="Amount (₦)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount" min={campaign.minInvestment} />
            {investError && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{investError}</p>}
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowInvest(false)}>Cancel</Button>
              <Button onClick={handleInvest} disabled={investLoading || !amount || parseFloat(amount) <= 0}>
                {investLoading ? "Processing..." : `Invest ${formatNaira(amount || 0)}`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Investment Successful!</h3>
            <p className="text-sm text-gray-600">You have invested {formatNaira(amount)} in {campaign.title}.</p>
            <Button onClick={() => setShowInvest(false)} variant="secondary">Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
