import { useState, useEffect } from "react";
import { Award, Home, Users, CheckCircle2 } from "lucide-react";
import { tokenApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function TokenMarketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyId, setBuyId] = useState(null);
  const [buying, setBuying] = useState(false);
  const [step, setStep] = useState("confirm");

  const fetch = async () => {
    try {
      const res = await tokenApi.getMarketplace();
      setListings(Array.isArray(res) ? res : res?.data ?? []);
    } catch { setListings([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleBuy = async () => {
    setBuying(true);
    try {
      await tokenApi.buyToken(buyId);
      setStep("done");
      fetch();
    } catch { /* silent */ } finally { setBuying(false); }
  };

  if (loading) return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /></div></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Token Marketplace</h1>
        <p className="text-amber-200">Buy and sell tokenized real estate units on the secondary market</p>
      </div>

      {listings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <Card key={l.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{l.tokenData?.tokenId || "Token"}</p>
                  <p className="text-xs text-gray-500">{l.tokenData?.propertyData?.title || "Property Token"}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Units</p>
                  <p className="text-sm font-bold text-gray-900">{l.units}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center col-span-2">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-bold text-amber-600">{formatNaira(l.askingPrice)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-auto">Seller: {l.seller?.firstName} {l.seller?.lastName}</p>
              <Button onClick={() => { setBuyId(l.id); setStep("confirm"); }} className="w-full mt-3" size="sm">Buy Token</Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No tokens listed for sale.</p></Card>
      )}

      <Modal isOpen={!!buyId} onClose={() => setBuyId(null)} title={step === "confirm" ? "Confirm Purchase" : "Purchase Complete"} size="sm">
        {step === "confirm" ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Are you sure you want to purchase this token?</p>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setBuyId(null)}>Cancel</Button>
              <Button onClick={handleBuy} disabled={buying}>{buying ? "Processing..." : "Confirm Purchase"}</Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="text-green-600 mx-auto" size={48} />
            <h3 className="text-lg font-semibold">Token Purchased!</h3>
            <Button onClick={() => setBuyId(null)} variant="secondary">Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
