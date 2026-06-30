import { useState, useEffect } from "react";
import { Settings, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { adminKycSettingsApi } from "../../services/api";
import { Card, Skeleton, Button, Toggle } from "../../components/common";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [mode, setMode] = useState("manual");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminKycSettingsApi.getMode();
      setMode(res?.mode || "manual");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load settings");
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleToggle = async () => {
    const newMode = mode === "manual" ? "automatic" : "manual";
    if (newMode === "automatic") {
      const confirmed = window.confirm(
        "Switching to automatic mode will auto-verify KYC submissions using the built-in provider. BVN/NIN format checks and document completeness will be validated. Continue?"
      );
      if (!confirmed) return;
    }
    setSaving(true);
    try {
      const res = await adminKycSettingsApi.updateMode(newMode);
      setMode(res?.mode || newMode);
      toast.success(`KYC verification mode set to ${newMode}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={24} className="text-gray-700" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-tangerine/20 flex items-center justify-center shrink-0">
            <Shield size={24} className="text-neon-tangerine/80" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">KYC Verification Mode</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose how KYC submissions are verified. Manual requires admin approval. Automatic uses the built-in provider to verify BVN/NIN and document completeness.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Toggle
                enabled={mode === "automatic"}
                onChange={handleToggle}
                label={mode === "automatic" ? "Automatic Mode" : "Manual Mode"}
                description={mode === "automatic" ? "KYC submissions are auto-verified on submit" : "KYC submissions require admin review and approval"}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              {mode === "automatic" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-neon-tangerine bg-neon-tangerine/10 px-2.5 py-1 rounded-full">
                  <CheckCircle size={12} />
                  Automatic
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  <Shield size={12} />
                  Manual (Default)
                </span>
              )}
              <span className="text-xs text-gray-400">Changes take effect immediately for new submissions.</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">About KYC Modes</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex gap-3">
            <span className="font-medium text-gray-900 shrink-0 w-20">Manual</span>
            <span>Admins review uploaded documents and approve/reject each submission. This is the default mode.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium text-gray-900 shrink-0 w-20">Automatic</span>
            <span>On submission, the system validates BVN (11 digits), NIN (11 digits), and checks for required documents. If all checks pass, KYC is auto-approved. Admin can still override from the KYC management page.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
