import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle2, XCircle, Send, Home, ExternalLink,
  Calendar, MessageSquare, TrendingUp, CheckCircle,
} from "lucide-react";
import { propertyApi, agreementApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import { formatNaira } from "../../utils/format";
import useAuthStore from "../../store/authStore";
import AgreementSigningModal from "../../components/agreement/AgreementSigningModal";
import toast from "react-hot-toast";

const statusConfig = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  completed: { label: "Completed", variant: "success", icon: CheckCircle },
  declined: { label: "Declined", variant: "danger", icon: XCircle },
};

export default function MyRequests() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investError, setInvestError] = useState(null);

  const [investReq, setInvestReq] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [agreementData, setAgreementData] = useState(null);
  const [investing, setInvesting] = useState(false);

  const investorName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Investor";

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

  const openInvest = (req) => {
    setInvestReq(req);
    setAgreementSigned(false);
    setAgreementData(null);
    setShowAgreement(true);
  };

  const handleAgreementConfirm = async (payload) => {
    if (!investReq) return;
    setInvesting(true);
    try {
      const res = await propertyApi.completeRequest(investReq.id);
      const investment = res?.data || res;
      const investmentId = investment?.id;

      if (investmentId) {
        try {
          const formData = new FormData();
          if (payload.signature.type === "typed") {
            formData.append("signatureType", "typed");
          } else {
            const blob = await fetch(payload.signature.data).then((r) => r.blob());
            formData.append("signature", blob, "signature.png");
            formData.append("signatureType", payload.signature.type);
          }
          formData.append("fullName", payload.fullName);
          formData.append("signedAt", payload.signedAt);
          const agreementRes = await agreementApi.submitAgreement(investmentId, formData);
          setAgreementData(agreementRes?.agreement || {
            signatureUrl: payload.signature.type !== "typed" ? payload.signature.data : null,
            fullName: payload.signature.type === "typed" ? payload.signature.data : payload.fullName,
            signedAt: payload.signedAt,
          });
        } catch (agreementErr) {
          console.warn("Agreement submission non-fatal:", agreementErr);
          setAgreementData({
            signatureUrl: payload.signature.type !== "typed" ? payload.signature.data : null,
            fullName: payload.signature.type === "typed" ? payload.signature.data : payload.fullName,
            signedAt: payload.signedAt,
          });
        }
      }

      setAgreementSigned(true);
      setRequests((prev) =>
        prev.map((r) => (r.id === investReq.id ? { ...r, status: "completed" } : r))
      );
    } catch (err) {
      setInvestError(err?.response?.data?.message || err.message || "Investment failed");
      alert(err?.response?.data?.message || err.message || "Investment failed");
      toast.error(err?.response?.data?.message || err.message || "Investment failed");
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
            const prop = req.property || {};
            const images = typeof prop.images === "string"
              ? (() => { try { return JSON.parse(prop.images); } catch { return []; } })()
              : (prop.images || []);
            const firstImage = images[0];

            return (
              <Card key={req.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-xl bg-dark-lavender/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {firstImage ? (
                        <img src={firstImage} alt={prop.title} className="w-full h-full object-cover" />
                      ) : (
                        <Home size={28} className="text-dark-lavender/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {prop.title || "Property"}
                        </h3>
                        <Badge variant={config.variant} size="sm">
                          <StatusIcon size={12} className="inline mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        <span>
                          <strong>{req.desiredUnits}</strong> unit{req.desiredUnits > 1 ? "s" : ""}
                          {prop.unitPrice ? ` at ${formatNaira(Number(prop.unitPrice))} each` : ""}
                        </span>
                        {prop.unitPrice && (
                          <span className="font-medium text-gray-800">
                            Total: {formatNaira(req.desiredUnits * Number(prop.unitPrice))}
                          </span>
                        )}
                        {prop.duration && (
                          <span>{prop.duration} months</span>
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
                      <Button size="sm" onClick={() => openInvest(req)}>
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

      <AgreementSigningModal
        isOpen={showAgreement}
        onClose={() => { setShowAgreement(false); setAgreementSigned(false); }}
        onConfirm={handleAgreementConfirm}
        investorName={investorName}
        principalAmount={totalCost}
        currency="NGN"
        tenorMonths={property.duration}
        monthlyRatePercent={property.expectedROI}
        propertyName={property.title}
        submitting={investing}
        signedSuccess={agreementSigned}
      />

    </div>
  );
}
