import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, TrendingUp, Home, ExternalLink } from "lucide-react";
import { tokenApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function MyTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listToken, setListToken] = useState(null);
  const [listPrice, setListPrice] = useState("");
  const [listUnits, setListUnits] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await tokenApi.getMyTokens();
      setTokens(Array.isArray(res) ? res : res?.data ?? []);
    } catch { setTokens([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleList = async () => {
    if (!listPrice || !listUnits) return;
    setSaving(true);
    try {
      await tokenApi.listToken({ tokenId: listToken.id, units: parseFloat(listUnits), askingPrice: parseFloat(listPrice) });
      setListToken(null);
      fetch();
    } catch { /* silent */ } finally { setSaving(false); }
  };

  if (loading) return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={4} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-dark-lavender rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Digital Asset Tokens</h1>
        <p className="text-amber-200">Your tokenized real estate holdings with digital ownership certificates</p>
      </div>

      {tokens.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <Card key={token.id} className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{token.tokenId}</p>
                  <p className="text-xs text-gray-500">{token.propertyData?.title || "Property Token"}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Units</p>
                  <p className="text-lg font-bold text-gray-900">{token.units}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge variant="success" size="sm">{token.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setListToken(token); setListPrice(""); setListUnits(""); }}>
                  List for Sale
                </Button>
                <Link to={`/tokens/marketplace`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Marketplace
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12 space-y-3">
            <Award size={48} className="text-gray-300 mx-auto" />
            <p className="text-gray-500">No tokens yet. Invest in properties to receive digital asset tokens.</p>
            <Link to="/properties"><Button variant="outline" size="sm">Browse Properties</Button></Link>
          </div>
        </Card>
      )}

      <Modal isOpen={!!listToken} onClose={() => setListToken(null)} title="List Token for Sale" size="md">
        <div className="space-y-4">
          <div className="bg-dark-lavender/10 rounded-xl p-3">
            <p className="text-sm font-semibold">{listToken?.tokenId} — {listToken?.units} units available</p>
          </div>
          <Input label="Units to Sell" type="number" value={listUnits} onChange={(e) => setListUnits(e.target.value)} placeholder="e.g. 5" max={listToken?.units} />
          <Input label="Asking Price (₦)" type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)} placeholder="e.g. 500000" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setListToken(null)}>Cancel</Button>
            <Button onClick={handleList} disabled={saving || !listPrice || !listUnits}>List for Sale</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
