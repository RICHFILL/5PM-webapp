import { useState, useEffect } from "react";
import { Settings, Shield, Globe, Bell, AlertCircle, CheckCircle, Save } from "lucide-react";
import { adminKycSettingsApi, adminSettingsApi } from "../../services/api";
import { Card, Skeleton, Button, Toggle, Input } from "../../components/common";
import toast from "react-hot-toast";

const NOTIFICATION_EVENTS = [
  { key: "deposit_approved", label: "Deposit Approved" },
  { key: "investment_created", label: "Investment Created" },
  { key: "kyc_approved", label: "KYC Approved" },
  { key: "kyc_rejected", label: "KYC Rejected" },
  { key: "withdrawal_approved", label: "Withdrawal Approved" },
  { key: "withdrawal_rejected", label: "Withdrawal Rejected" },
  { key: "distribution_paid", label: "Distribution Paid" },
  { key: "wallet_funded", label: "Wallet Funded" },
];

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kycSaving, setKycSaving] = useState(false);
  const [error, setError] = useState("");

  const [kycMode, setKycMode] = useState("manual");
  const [platform, setPlatform] = useState({ site_name: "", support_email: "", contact_phone: "" });
  const [notifications, setNotifications] = useState({});
  const [platformDirty, setPlatformDirty] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const [kycRes, settingsRes] = await Promise.all([
        adminKycSettingsApi.getMode(),
        adminSettingsApi.getAll(),
      ]);
      setKycMode(kycRes?.mode || "manual");

      const all = settingsRes?.data || {};
      const plat = all.site_name || {};
      setPlatform({
        site_name: plat.name || "",
        support_email: all.support_email?.email || "",
        contact_phone: all.contact_phone?.phone || "",
      });
      setNotifications(all.email_notifications || {});
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load settings");
      toast.error("Failed to load settings");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleKycToggle = async () => {
    const newMode = kycMode === "manual" ? "automatic" : "manual";
    if (newMode === "automatic") {
      const confirmed = window.confirm("Switching to automatic mode will auto-verify KYC submissions using the built-in provider. Continue?");
      if (!confirmed) return;
    }
    setKycSaving(true);
    try {
      const res = await adminKycSettingsApi.updateMode(newMode);
      setKycMode(res?.mode || newMode);
      toast.success(`KYC mode set to ${newMode}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update KYC mode");
    } finally { setKycSaving(false); }
  };

  const handlePlatformSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        adminSettingsApi.update("site_name", { name: platform.site_name }),
        adminSettingsApi.update("support_email", { email: platform.support_email }),
        adminSettingsApi.update("contact_phone", { phone: platform.contact_phone }),
      ]);
      setPlatformDirty(false);
      toast.success("Platform settings saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleNotificationToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await adminSettingsApi.update("email_notifications", updated);
      toast.success(`Notification ${updated[key] ? "enabled" : "disabled"}`);
    } catch {
      setNotifications(notifications);
      toast.error("Failed to update notification setting");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
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
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Globe size={24} className="text-blue-600/80" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Platform Settings</h2>
              <p className="text-sm text-gray-500">Configure your platform name and contact details.</p>
            </div>
            <Input label="Site Name" value={platform.site_name} onChange={(e) => { setPlatform({ ...platform, site_name: e.target.value }); setPlatformDirty(true); }} placeholder="e.g. 5PM Nexus Invest" />
            <Input label="Support Email" type="email" value={platform.support_email} onChange={(e) => { setPlatform({ ...platform, support_email: e.target.value }); setPlatformDirty(true); }} placeholder="e.g. support@5pmnexus.com" />
            <Input label="Contact Phone" value={platform.contact_phone} onChange={(e) => { setPlatform({ ...platform, contact_phone: e.target.value }); setPlatformDirty(true); }} placeholder="e.g. +234 800 000 0000" />
            <div className="flex justify-end pt-2">
              <Button onClick={handlePlatformSave} disabled={saving || !platformDirty} size="sm">
                <Save size={14} /> {saving ? "Saving..." : "Save Platform Settings"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-tangerine/20 flex items-center justify-center shrink-0">
            <Shield size={24} className="text-neon-tangerine/80" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">KYC Verification Mode</h2>
            <p className="text-sm text-gray-500 mt-1">Choose how KYC submissions are verified.</p>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Toggle
                enabled={kycMode === "automatic"}
                onChange={handleKycToggle}
                disabled={kycSaving}
                label={kycMode === "automatic" ? "Automatic Mode" : "Manual Mode"}
                description={kycMode === "automatic" ? "KYC submissions are auto-verified on submit" : "KYC submissions require admin review and approval"}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              {kycMode === "automatic" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-neon-tangerine bg-neon-tangerine/10 px-2.5 py-1 rounded-full">
                  <CheckCircle size={12} /> Automatic
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  <Shield size={12} /> Manual (Default)
                </span>
              )}
              <span className="text-xs text-gray-400">Changes take effect immediately for new submissions.</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
            <Bell size={24} className="text-purple-600/80" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Email Notification Preferences</h2>
            <p className="text-sm text-gray-500 mt-1">Control which activities trigger email notifications to users.</p>
            <div className="mt-4 space-y-3">
              {NOTIFICATION_EVENTS.map((ev) => (
                <div key={ev.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{ev.label}</span>
                  <Toggle
                    enabled={!!notifications[ev.key]}
                    onChange={() => handleNotificationToggle(ev.key)}
                  />
                </div>
              ))}
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
            <span>On submission, the system validates BVN (11 digits), NIN (11 digits), and checks for required documents. If all checks pass, KYC is auto-approved.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}