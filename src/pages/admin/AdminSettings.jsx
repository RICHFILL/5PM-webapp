import { useState, useEffect } from "react";
import {
  Settings, Globe, Shield, Bell, Lock, Save, Eye, EyeOff, CheckCircle, XCircle,
  AlertCircle, RefreshCw, Database, Loader,
} from "lucide-react";
import { adminAuthApi, adminKycSettingsApi, adminSettingsApi } from "../../services/api";
import { Card, Skeleton, Button, Toggle, Input } from "../../components/common";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

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

function Section({ icon: Icon, iconBg, iconColor, title, description, children }) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={22} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </Card>
  );
}

function ProviderBadge({ label, configured, loading: provLoading }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${configured ? 'bg-green-100' : 'bg-gray-100'}`}>
          {provLoading ? (
            <Loader size={16} className="text-gray-400 animate-spin" />
          ) : configured ? (
            <CheckCircle size={18} className="text-green-600" />
          ) : (
            <XCircle size={18} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 truncate">
            {provLoading ? "Checking..." : configured ? "Connected" : "Not configured"}
          </p>
        </div>
      </div>
      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        configured ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {configured ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
}

export default function AdminSettings() {
  const logout = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [kycMode, setKycMode] = useState("manual");
  const [kycSaving, setKycSaving] = useState(false);

  const [platform, setPlatform] = useState({ site_name: "", support_email: "", contact_phone: "" });
  const [platformDirty, setPlatformDirty] = useState(false);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [maintenanceDirty, setMaintenanceDirty] = useState(false);

  const [notifications, setNotifications] = useState({});

  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [providers, setProviders] = useState(null);
  const [providersLoading, setProvidersLoading] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [lockoutThreshold, setLockoutThreshold] = useState("5");
  const [securityDirty, setSecurityDirty] = useState(false);

  const fetchProviders = async () => {
    setProvidersLoading(true);
    try {
      const res = await adminSettingsApi.getProviders();
      setProviders(res);
    } catch {
      setProviders(null);
    } finally {
      setProvidersLoading(false);
    }
  };

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
        site_name: plat.name || all.site_name || "",
        support_email: all.support_email?.email || "",
        contact_phone: all.contact_phone?.phone || "",
      });
      const raw = all.email_notifications;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      setNotifications(parsed && typeof parsed === 'object' ? parsed : {});

      const maint = all.maintenance_mode || {};
      setMaintenanceMode(maint.enabled || false);
      setMaintenanceMsg(maint.message || "");

      setSessionTimeout(String(all.session_timeout?.minutes || "60"));
      setLockoutThreshold(String(all.account_lockout?.attempts || "5"));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load settings");
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); fetchProviders(); }, []);

  const handleKycToggle = async () => {
    const newMode = kycMode === "manual" ? "automatic" : "manual";
    if (newMode === "automatic") {
      const confirmed = window.confirm(
        "Switching to automatic mode will auto-verify KYC submissions using the configured provider. Continue?"
      );
      if (!confirmed) return;
    }
    setKycSaving(true);
    try {
      const res = await adminKycSettingsApi.updateMode(newMode);
      setKycMode(res?.mode || newMode);
      toast.success(`KYC mode set to ${newMode}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update KYC mode");
    } finally {
      setKycSaving(false);
    }
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
    } finally {
      setSaving(false);
    }
  };

  const handleMaintenanceSave = async () => {
    setSaving(true);
    try {
      await adminSettingsApi.update("maintenance_mode", {
        enabled: maintenanceMode,
        message: maintenanceMsg || undefined,
      });
      setMaintenanceDirty(false);
      toast.success(maintenanceMode ? "Maintenance mode enabled" : "Maintenance mode disabled");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update maintenance mode");
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        adminSettingsApi.update("session_timeout", { minutes: parseInt(sessionTimeout, 10) || 60 }),
        adminSettingsApi.update("account_lockout", { attempts: parseInt(lockoutThreshold, 10) || 5 }),
      ]);
      setSecurityDirty(false);
      toast.success("Security settings saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save security settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPasswordSaving(true);
    try {
      await adminAuthApi.changePassword(passwordForm.current, passwordForm.new);
      toast.success("Password changed successfully. Logging out...");
      setTimeout(() => {
        logout();
        window.location.href = "/admin/login";
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleNotificationToggle = async (key) => {
    const current = typeof notifications === 'object' && !Array.isArray(notifications) ? notifications : {};
    const updated = { ...current, [key]: !current[key] };
    setNotifications(updated);
    try {
      await adminSettingsApi.update("email_notifications", updated);
    } catch {
      setNotifications(notifications);
      toast.error("Failed to update notification setting");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Settings size={20} className="text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage platform configuration and preferences</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline shrink-0">
            Retry
          </button>
        </div>
      )}

      <Section icon={Globe} iconBg="bg-blue-500/10" iconColor="text-blue-600" title="Platform" description="Site name and contact information">
        <div className="space-y-3">
          <Input
            label="Site Name"
            value={platform.site_name}
            onChange={(e) => { setPlatform({ ...platform, site_name: e.target.value }); setPlatformDirty(true); }}
            placeholder="e.g. 5PM Nexus Invest"
          />
          <Input
            label="Support Email"
            type="email"
            value={platform.support_email}
            onChange={(e) => { setPlatform({ ...platform, support_email: e.target.value }); setPlatformDirty(true); }}
            placeholder="e.g. support@5pmnexus.com"
          />
          <Input
            label="Contact Phone"
            value={platform.contact_phone}
            onChange={(e) => { setPlatform({ ...platform, contact_phone: e.target.value }); setPlatformDirty(true); }}
            placeholder="e.g. +234 800 000 0000"
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handlePlatformSave} disabled={saving || !platformDirty} size="sm">
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Section>

      <Section icon={Shield} iconBg="bg-neon-tangerine/10" iconColor="text-neon-tangerine" title="KYC Verification" description="Configure how KYC submissions are verified">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <Toggle
            enabled={kycMode === "automatic"}
            onChange={handleKycToggle}
            disabled={kycSaving}
            label={kycMode === "automatic" ? "Automatic Mode" : "Manual Mode"}
            description={kycMode === "automatic" ? "KYC submissions are auto-verified on submit" : "KYC submissions require admin review and approval"}
          />
        </div>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            kycMode === "automatic" ? "text-neon-tangerine bg-neon-tangerine/10" : "text-amber-700 bg-amber-50"
          }`}>
            {kycMode === "automatic" ? <CheckCircle size={12} /> : <Shield size={12} />}
            {kycMode === "automatic" ? "Automatic" : "Manual (Default)"}
          </span>
          <span className="text-xs text-gray-400">Changes take effect immediately for new submissions.</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="font-medium text-gray-900 mb-2">How it works</p>
          <div className="flex gap-3">
            <span className="font-medium text-gray-900 shrink-0 w-20">Manual</span>
            <span>Admins review uploaded documents and approve/reject each submission.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-medium text-gray-900 shrink-0 w-20">Automatic</span>
            <span>System validates BVN, NIN, face match, and AML checks via the configured provider. If all pass, KYC is auto-approved.</span>
          </div>
        </div>
      </Section>

      <Section icon={Database} iconBg="bg-purple-500/10" iconColor="text-purple-600" title="Connected Services" description="Third-party integrations and API connections">
        <div className="space-y-3">
          <ProviderBadge label="Dojah (KYC Provider)" configured={providers?.dojah?.configured} loading={providersLoading} />
          <div className="flex justify-end">
            <button
              onClick={fetchProviders}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
              disabled={providersLoading}
            >
              <RefreshCw size={12} className={providersLoading ? "animate-spin" : ""} />
              Refresh status
            </button>
          </div>
        </div>
      </Section>

      <Section icon={Bell} iconBg="bg-purple-500/10" iconColor="text-purple-600" title="Email Notifications" description="Control which activities trigger email notifications">
        <div className="space-y-2">
          {NOTIFICATION_EVENTS.map((ev) => (
            <div key={ev.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm font-medium text-gray-700">{ev.label}</span>
              <Toggle enabled={!!notifications[ev.key]} onChange={() => handleNotificationToggle(ev.key)} />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Lock} iconBg="bg-red-500/10" iconColor="text-red-600" title="Security" description="Password and session configuration">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Session & Lockout</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={sessionTimeout}
                onChange={(e) => { setSessionTimeout(e.target.value); setSecurityDirty(true); }}
                placeholder="60"
                min={5}
                max={1440}
              />
              <Input
                label="Lockout Threshold (attempts)"
                type="number"
                value={lockoutThreshold}
                onChange={(e) => { setLockoutThreshold(e.target.value); setSecurityDirty(true); }}
                placeholder="5"
                min={1}
                max={20}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSecuritySave} disabled={saving || !securityDirty} size="sm">
                <Save size={14} /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm font-medium text-gray-900 mb-3">Change Admin Password</p>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <Button onClick={handleChangePassword} disabled={passwordSaving} size="sm">
                <Lock size={14} /> {passwordSaving ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={AlertCircle} iconBg="bg-amber-500/10" iconColor="text-amber-600" title="Maintenance" description="Put the platform in maintenance mode">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <Toggle
            enabled={maintenanceMode}
            onChange={() => { setMaintenanceMode(!maintenanceMode); setMaintenanceDirty(true); }}
            label={maintenanceMode ? "Maintenance Mode Active" : "Maintenance Mode"}
            description={maintenanceMode ? "Users will see a maintenance notice" : "Platform is fully accessible"}
          />
        </div>
        {maintenanceMode && (
          <div className="mt-3">
            <Input
              label="Maintenance Message (optional)"
              value={maintenanceMsg}
              onChange={(e) => { setMaintenanceMsg(e.target.value); setMaintenanceDirty(true); }}
              placeholder="e.g. Scheduled maintenance tonight from 2-4 AM"
            />
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button onClick={handleMaintenanceSave} disabled={saving || !maintenanceDirty} size="sm">
            <Save size={14} /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Section>
    </div>
  );
}
