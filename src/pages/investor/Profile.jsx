import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Building, Calendar, Lock, Bell, LogOut, Edit2, Shield, CheckCircle, AlertTriangle, CreditCard, Globe, Landmark, Home, FileText, Plus, Star, Trash2 } from "lucide-react";
import { userApi, kycApi, bankApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

const parseDoc = (val) => {
  if (!val) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return null; }
  }
  return val;
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-neon-tangerine mt-1 shrink-0" size={20} />
      <div><p className="text-gray-600 text-sm">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
    </div>
  );
}

function Profile() {
  const { user: localUser, logout, setUser } = useAuthStore();
  const [user, setUserData] = useState(localUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [wallet, setWallet] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", phone: "", location: "",
    dateOfBirth: "", gender: "", country: "", state: "", city: "", streetAddress: "", postalCode: "",
  });

  const [bankAccounts, setBankAccounts] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    id: "", bankName: "", accountNumber: "", accountName: "", walletAddress: "", isDefault: false,
  });
  const [bankError, setBankError] = useState("");
  const [savingBank, setSavingBank] = useState(false);

  const fetchBankAccounts = async () => {
    try {
      const res = await bankApi.getBankAccounts();
      setBankAccounts(res?.data ?? (Array.isArray(res) ? res : []));
    } catch { setBankAccounts([]); }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, kyc] = await Promise.all([
          userApi.getProfile(),
          kycApi.getStatus().catch(() => null),
        ]);
        if (profile) {
          setUserData(profile);
          setUser(profile);
          if (profile.kyc) setKycData(profile.kyc);
          if (profile.wallet) setWallet(profile.wallet);
        }
        if (kyc) {
          const k = kyc?.kyc || kyc;
          setKycStatus(k?.status || null);
          if (k) setKycData(k);
        }
        fetchBankAccounts();
      } catch (err) {
        if (err.message?.includes("401")) logout();
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setError("New passwords do not match"); return;
    }
    try {
      setError("");
      await userApi.changePassword(passwordData.current, passwordData.new);
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const updated = await userApi.updateProfile(editForm);
      const data = updated?.user || updated?.data || updated || editForm;
      setUserData(data);
      setUser(data);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = () => {
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      location: user?.location || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      streetAddress: user?.streetAddress || "",
      postalCode: user?.postalCode || "",
    });
    setShowEditModal(true);
  };

  const maskAccount = (n) => (n && n.length > 4 ? `****${String(n).slice(-4)}` : n || "--");

  const openBankModal = (account) => {
    setBankForm(account
      ? { id: account.id, bankName: account.bankName || "", accountNumber: account.accountNumber || "", accountName: account.accountName || "", walletAddress: account.walletAddress || "", isDefault: !!account.isDefault }
      : { id: "", bankName: "", accountNumber: "", accountName: "", walletAddress: "", isDefault: false });
    setBankError("");
    setShowBankModal(true);
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSavingBank(true); setBankError("");
    try {
      const payload = {
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        accountName: bankForm.accountName,
        walletAddress: bankForm.walletAddress,
        isDefault: bankForm.isDefault,
      };
      if (bankForm.id) await bankApi.updateBankAccount(bankForm.id, payload);
      else await bankApi.createBankAccount(payload);
      setShowBankModal(false);
      fetchBankAccounts();
    } catch (err) {
      setBankError(err?.response?.data?.message || err.message || "Failed to save bank account");
    } finally { setSavingBank(false); }
  };

  const handleDeleteBank = async (account) => {
    if (!window.confirm(`Delete this ${account.bankName || "USDT wallet"}?`)) return;
    try {
      setBankError("");
      await bankApi.deleteBankAccount(account.id);
      fetchBankAccounts();
    } catch (err) {
      setBankError(err?.response?.data?.message || err.message || "Failed to delete bank account");
    }
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const kycBadgeVariant = (status) => {
    switch (status) {
      case "approved": return "success";
      case "under-review": case "under_review": return "warning";
      case "rejected": return "danger";
      default: return "default";
    }
  };

  const addressProof = parseDoc(kycData?.addressProof);
  const structuredAddress = addressProof && !addressProof.url
    ? addressProof
    : null;

  const kycDocs = [
    { key: "passportPhoto", label: "Passport Photo" },
    { key: "idDocument", label: "ID Document" },
    { key: "selfie", label: "Selfie" },
    { key: "addressProof", label: "Utility Bill" },
  ].filter(({ key }) => {
    const doc = parseDoc(kycData?.[key]);
    return doc?.url;
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-neon-tangerine rounded-2xl text-white p-4 md:p-8 relative">
        <div className="flex items-end gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center shrink-0">
            <span className="text-2xl md:text-4xl font-bold">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{user?.firstName} {user?.lastName}</h2>
            <p className="text-teal-100">Individual Investor</p>
            {kycStatus && (
              <div className="mt-2">
                <Badge variant={kycBadgeVariant(kycStatus)}>
                  KYC: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
          <button onClick={openEditModal} className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
            <Edit2 size={20} />
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
          <div className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={user?.email} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone || "Not provided"} />
            <InfoRow icon={Calendar} label="Date of Birth" value={user?.dateOfBirth || "Not provided"} />
            <InfoRow icon={Shield} label="Gender" value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not provided"} />
            <InfoRow icon={Building} label="Investor Type" value="Individual Investor" />
            <InfoRow icon={Calendar} label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
          <div className="space-y-4">
            <InfoRow icon={Globe} label="Country" value={user?.country || "Not provided"} />
            <InfoRow icon={MapPin} label="State" value={user?.state || "Not provided"} />
            <InfoRow icon={Landmark} label="City" value={user?.city || "Not provided"} />
            <InfoRow icon={Home} label="Street Address" value={user?.streetAddress || "Not provided"} />
            <InfoRow icon={MapPin} label="Postal Code" value={user?.postalCode || "Not provided"} />
            <InfoRow icon={MapPin} label="Location" value={user?.location || "Not provided"} />
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-3">
              <button onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                <Lock size={20} /> Change Password
              </button>
              <button onClick={() => window.location.href = "/notifications"}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                <Bell size={20} /> Notification Preferences
              </button>
              <button onClick={logout}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-red-600 font-medium">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status</h3>
            <div className="flex items-center gap-3">
              {kycStatus === "approved" ? (
                <CheckCircle size={24} className="text-green-500" />
              ) : kycStatus === "under_review" || kycStatus === "under-review" ? (
                <AlertTriangle size={24} className="text-yellow-500" />
              ) : (
                <Shield size={24} className="text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {kycStatus ? kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1) : "Not Started"}
                </p>
                <p className="text-xs text-gray-500">
                  {kycStatus === "approved" ? "Your identity has been verified" :
                   kycStatus === "under_review" || kycStatus === "under-review" ? "Your documents are being reviewed" :
                   kycStatus === "rejected" ? "Your verification was rejected. Please re-submit" :
                   "Complete KYC to unlock full access"}
                </p>
              </div>
            </div>
            {kycData && (
              <div className="mt-4 space-y-2 text-sm">
                {kycData.bvn && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard size={16} className="text-gray-400" />
                    <span>BVN: <span className="font-mono font-medium text-gray-900">****{String(kycData.bvn).slice(-4)}</span></span>
                  </div>
                )}
                {kycData.nin && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard size={16} className="text-gray-400" />
                    <span>NIN: <span className="font-mono font-medium text-gray-900">****{String(kycData.nin).slice(-4)}</span></span>
                  </div>
                )}
                {structuredAddress && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{[structuredAddress.address, structuredAddress.city, structuredAddress.state, structuredAddress.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {kycDocs.map(({ key, label }) => {
                  const doc = parseDoc(kycData[key]);
                  return (
                    <a key={key} href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neon-tangerine hover:underline">
                      <FileText size={16} /> {label}
                    </a>
                  );
                })}
              </div>
            )}
            {kycStatus !== "approved" && (
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => window.location.href = "/kyc"}>
                Complete KYC
              </Button>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">NGN Balance</p>
                <p className="text-lg font-bold text-gray-900">₦{Number(wallet?.balance ?? 0).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">USD Balance</p>
                <p className="text-lg font-bold text-gray-900">${Number(wallet?.usdBalance ?? 0).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">USDT Balance</p>
                <p className="text-lg font-bold text-gray-900">{Number(wallet?.usdtBalance ?? 0).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Total Invested</p>
                <p className="text-lg font-bold text-gray-900">₦{Number(wallet?.totalInvested ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
            <p className="text-sm text-gray-500">Manage the accounts used for withdrawals</p>
          </div>
          <Button size="sm" onClick={() => openBankModal(null)}>
            <Plus size={16} className="mr-1" /> Add Account
          </Button>
        </div>
        {bankAccounts.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <CreditCard className="mx-auto text-gray-300 mb-2" size={28} />
            <p className="text-gray-500 text-sm">No saved bank accounts yet. Add one to speed up withdrawals.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {account.bankName || "USDT Wallet"}
                    </p>
                    {account.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                        <Star size={10} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {account.bankName
                      ? `${maskAccount(account.accountNumber)}${account.accountName ? ` · ${account.accountName}` : ""}`
                      : account.walletAddress ? `${String(account.walletAddress).slice(0, 16)}...` : "--"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openBankModal(account)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteBank(account)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); setError(""); }} title="Change Password" size="lg">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <div className="space-y-4">
          <Input label="Current Password" type="password" value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} />
          <Input label="New Password" type="password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} />
          <Input label="Confirm New Password" type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} />
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => { setShowPasswordModal(false); setError(""); }} className="flex-1">Cancel</Button>
            <Button onClick={handleChangePassword} className="flex-1">Update Password</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile" size="lg">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleEditProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} required />
            <Input label="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
            <Input label="Location" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select value={editForm.gender} onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Country" value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} placeholder="Nigeria" />
            <Input label="State" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="City" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} />
            <Input label="Postal Code" value={editForm.postalCode} onChange={(e) => setEditForm({...editForm, postalCode: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
            <textarea rows={2} value={editForm.streetAddress} onChange={(e) => setEditForm({...editForm, streetAddress: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine" />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title={bankForm.id ? "Edit Bank Account" : "Add Bank Account"} size="md">
        {bankError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{bankError}</div>}
        <form onSubmit={handleSaveBank} className="space-y-4">
          <Input label="Bank Name" value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} placeholder="e.g., GTBank" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Account Number" value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="0123456789" maxLength={10} />
            <Input label="Account Name" value={bankForm.accountName} onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })} placeholder="Enter account name" />
          </div>
          <Input label="USDT Wallet Address (optional)" value={bankForm.walletAddress} onChange={(e) => setBankForm({ ...bankForm, walletAddress: e.target.value })} placeholder="TRC20 wallet address for USDT payouts" />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={bankForm.isDefault} onChange={(e) => setBankForm({ ...bankForm, isDefault: e.target.checked })} />
            Set as default account
          </label>
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => setShowBankModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={savingBank}>
              {savingBank ? "Saving..." : bankForm.id ? "Save Changes" : "Add Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
