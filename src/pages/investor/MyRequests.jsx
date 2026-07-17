import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle2, XCircle, Send, Home, ExternalLink,
  Calendar, MessageSquare, Wallet, TrendingUp, AlertCircle, CheckCircle,
} from "lucide-react";
import { propertyApi, walletApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal } from "../../components/common";
import { formatNaira } from "../../utils/format";

const statusConfig = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  completed: { label: "Completed", variant: "success", icon: CheckCircle },
  declined: { label: "Declined", variant: "danger", icon: XCircle },
};

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [investReq, setInvestReq] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [investing, setInvesting] = useState(false);
  const [investError, setInvestError] = useState("");
  const [investSuccess, setInvestSuccess] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await propertyApi.getMyRequests();
      setRequests(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openInvestModal = async (req) => {
    setInvestReq(req);
    setInvestError("");
    setInvestSuccess(null);
    try {
      const balRes = await walletApi.getBalance();
      setWalletBalance(parseFloat(balRes?.balance) || 0);
    } catch {
      setWalletBalance(0);
    }
  };

  const closeInvestModal = () => {
    setInvestReq(null);
    setInvestError("");
    setInvestSuccess(null);
    setInvesting(false);
  };

  const handleInvest = async () => {
    if (!investReq) return;
    setInvesting(true);
    setInvestError("");
    try {
      const res = await propertyApi.completeRequest(investReq.id);
      const investment = res?.data || res;
      setInvestSuccess(investment);
      setRequests((prev) =>
        prev.map((r) => (r.id === investReq.id ? { ...r, status: "completed" } : r))
      );
    } catch (err) {
      setInvestError(err?.response?.data?.message || err.message || "Investment failed");
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="space-y-4">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
      </div>
    );
  }

  const property = investReq?.property || {};
  const totalCost = investReq ? (investReq.desiredUnits * Number(property.unitPrice || 0)) : 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-dark-lavender to-purple-700 rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">My Investment Requests</h1>
        <p className="text-purple-200">Track your property investment requests and their status</p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Send size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No requests yet</h3>
          <p className="text-sm text-gray-500 mb-6">You haven't submitted any investment requests yet.</p>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const config = statusConfig[req.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const property = req.property || {};
            const images = typeof property.images === "string"
              ? (() => { try { return JSON.parse(property.images); } catch { return []; } })()
              : (property.images || []);
            const firstImage = images[0];

            return (
              <Card key={req.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-xl bg-dark-lavender/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {firstImage ? (
                        <img src={firstImage} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <Home size={28} className="text-dark-lavender/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {property.title || "Property"}
                        </h3>
                        <Badge variant={config.variant} size="sm">
                          <StatusIcon size={12} className="inline mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        <span>
                          <strong>{req.desiredUnits}</strong> unit{req.desiredUnits > 1 ? "s" : ""}
                          {property.unitPrice ? ` at ${formatNaira(Number(property.unitPrice))} each` : ""}
                        </span>
                        {property.unitPrice && (
                          <span className="font-medium text-gray-800">
                            Total: {formatNaira(req.desiredUnits * Number(property.unitPrice))}
                          </span>
                        )}
                        {property.duration && (
                          <span>{property.duration} months</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(req.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      {req.message && (
                        <p className="text-sm text-gray-500 mt-2 flex items-start gap-1.5">
                          <MessageSquare size={13} className="mt-0.5 shrink-0" />
                          <span className="italic">"{req.message}"</span>
                        </p>
                      )}
                      {req.adminNote && (
                        <p className="text-sm text-gray-500 mt-1.5 pl-5 border-l-2 border-gray-200">
                          Admin note: {req.adminNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {req.status === "approved" && (
                      <Button size="sm" onClick={() => openInvestModal(req)}>
                        <TrendingUp size={14} className="mr-1" />
                        Invest Now
                      </Button>
                    )}
                    <Link
                      to={`/properties/${req.propertyId}`}
                      className="p-2 text-gray-400 hover:text-dark-lavender hover:bg-dark-lavender/5 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!investReq} onClose={closeInvestModal} title="Confirm Investment" size="md">
        {investSuccess ? (
          <div className="text-center space-y-5 py-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Investment Successful!</h3>
            <p className="text-sm text-gray-600">
              You have successfully purchased {investReq?.desiredUnits} unit{investReq?.desiredUnits > 1 ? "s" : ""} in{" "}
              <strong>{property.title}</strong> for <strong>{formatNaira(totalCost)}</strong>.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/investments")}>
                View Portfolio
              </Button>
              <Button variant="outline" onClick={closeInvestModal}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-dark-lavender/10 flex items-center justify-center">
                {property.images?.[0] ? (
                  <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Home size={24} className="text-dark-lavender/40" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{property.title}</p>
                <p className="text-sm text-gray-500">
                  {investReq?.desiredUnits} unit{investReq?.desiredUnits > 1 ? "s" : ""} requested
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Units</span>
                <span className="font-medium">{investReq?.desiredUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit price</span>
                <span className="font-medium">{formatNaira(Number(property.unitPrice || 0))}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-900">Total cost</span>
                <span className="font-semibold text-gray-900">{formatNaira(totalCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  <Wallet size={14} /> Wallet balance
                </span>
                <span className={`font-medium ${walletBalance >= totalCost ? "text-green-600" : "text-red-600"}`}>
                  {formatNaira(walletBalance)}
                </span>
              </div>
            </div>

            {investError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{investError}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={closeInvestModal} disabled={investing}>
                Cancel
              </Button>
              <Button onClick={handleInvest} disabled={investing || walletBalance < totalCost}>
                {investing ? "Processing..." : "Confirm & Invest"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
