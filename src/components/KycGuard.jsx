import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, ShieldCheck, Clock, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { kycApi } from "../services/api";
import { Spinner, Button } from "./common";

export default function KycGuard({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await kycApi.getStatus();
        setStatus(res?.kyc?.status || null);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === "approved") {
    return children;
  }

  if (status === "pending" || status === "under_review") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <Clock size={40} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">KYC Under Review</h2>
          <p className="text-sm text-gray-600">
            Your KYC verification is currently{" "}
            <span className="font-semibold">{status === "under_review" ? "under review" : "pending"}</span>.
            You'll be able to access all investment features once it's approved.
          </p>
          <p className="text-xs text-gray-400">This usually takes 1-2 business days.</p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle size={40} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">KYC Rejected</h2>
          <p className="text-sm text-gray-600">
            Your KYC verification was rejected. Please resubmit with correct information to access investment features.
          </p>
          <Button onClick={() => navigate("/kyc")}>
            Resubmit KYC <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-neon-tangerine/20 flex items-center justify-center mx-auto">
          <Shield size={40} className="text-neon-tangerine/80" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">KYC Verification Required</h2>
        <p className="text-sm text-gray-600">
          You need to complete your KYC (Know Your Customer) verification before you can access investment features, fund your wallet, or make transactions.
        </p>
        <Button onClick={() => navigate("/kyc")}>
          Complete KYC Now <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
