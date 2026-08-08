import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  CalendarDays,
  TrendingUp,
  DollarSign,
  Activity,
  Building2,
  Shield,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  MapPin,
  Edit3,
  Trash2,
  Award,
  Eye,
  Wallet,
  KeyRound,
  CheckCircle2,
  CreditCard,
  Globe,
  Landmark,
  Home,
  FileText,
  ExternalLink,
  Layers,
  Banknote,
  Receipt,
  Plus,
  Star,
} from "lucide-react";
import { adminApi, userApi } from "../../services/api";
import {
  Card,
  Skeleton,
  Badge,
  Button,
  Input,
  Modal,
} from "../../components/common";
import { formatCurrencyAmount } from "../../utils/currency";
import toast from "react-hot-toast";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "--";

const num = (v) => Number(v) || 0;

const roleVariant = (role) => {
  switch (role) {
    case "admin":
      return "warning";
    case "super_admin":
      return "danger";
    case "compliance_officer":
      return "info";
    case "investment_manager":
      return "brand";
    case "finance_officer":
      return "success";
    default:
      return "default";
  }
};

const statusVariant = (status) => {
  switch (status) {
    case "approved":
    case "paid":
    case "completed":
    case "Success":
      return "success";
    case "pending":
    case "Pending":
    case "processing":
      return "warning";
    case "rejected":
    case "Failed":
      return "danger";
    default:
      return "default";
  }
};

const parseDoc = (val) => {
  if (!val) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return null; }
  }
  return val;
};

const formatBankSnapshot = (bd) => {
  if (!bd) return "--";
  if (bd.bankName) {
    return [bd.bankName, bd.accountNumber, bd.accountName].filter(Boolean).join(" · ");
  }
  return bd.walletAddress || "--";
};

function DetailsRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div
        className={`w-9 h-9 rounded-lg ${color || "bg-gray-100"} flex items-center justify-center shrink-0`}
      >
        <Icon size={16} className={color ? "text-white" : "text-gray-500"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function DocumentLink({ doc, label }) {
  if (!doc?.url) return null;
  return (
    <a href={doc.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 text-sm text-neon-tangerine/80 hover:bg-neon-tangerine/10 transition-colors border border-gray-200">
      <ExternalLink size={14} />
      <span className="truncate">{label}</span>
    </a>
  );
}

const TABS = [
  { key: "overview", label: "Overview", icon: Layers },
  { key: "kyc", label: "KYC", icon: Shield },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "transactions", label: "Transactions", icon: Receipt },
  { key: "withdrawals", label: "Withdrawals & Distributions", icon: Banknote },
];

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [totalsByCurrency, setTotalsByCurrency] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    streetAddress: "",
    postalCode: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordResetting, setPasswordResetting] = useState(false);
  const [passwordResult, setPasswordResult] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    id: "", bankName: "", accountNumber: "", accountName: "", walletAddress: "", isDefault: false,
  });
  const [savingBank, setSavingBank] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUserDetail(id);
      const u = data?.data?.user || data?.user || data;
      const inv = data?.data?.investments || data?.investments || [];
      const tbc = data?.data?.totalsByCurrency || data?.totalsByCurrency || null;
      setUser(u);
      setInvestments(Array.isArray(inv) ? inv : []);
      setTotalsByCurrency(Array.isArray(tbc) && tbc.length > 0 ? tbc : null);
      setKyc(data?.data?.kyc || data?.kyc || null);
      setWallet(data?.data?.wallet || data?.wallet || null);
      setTransactions(Array.isArray(data?.data?.transactions) ? data.data.transactions : []);
      setWithdrawals(Array.isArray(data?.data?.withdrawals) ? data.data.withdrawals : []);
      setDistributions(Array.isArray(data?.data?.distributions) ? data.data.distributions : []);
      setBankAccounts(Array.isArray(data?.data?.bankAccounts) ? data.data.bankAccounts : []);
      setEditForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        phone: u.phone || "",
        location: u.location || "",
        dateOfBirth: u.dateOfBirth || "",
        gender: u.gender || "",
        country: u.country || "",
        state: u.state || "",
        city: u.city || "",
        streetAddress: u.streetAddress || "",
        postalCode: u.postalCode || "",
        role: u.role || "investor",
      });
    } catch (err) {
      setUser(null);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await userApi.getUserStats(id);
      const s = data?.data || data || null;
      setStats(s);
      const tbc = s?.totalsByCurrency || null;
      if (Array.isArray(tbc) && tbc.length > 0) setTotalsByCurrency(tbc);
    } catch (err) {
      setStats(null);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, [fetchUser, fetchStats]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateUser(id, editForm);
      if (editForm.role !== user?.role) {
        await adminApi.assignUserRole(id, editForm.role);
      }
      setShowEdit(false);
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const [verifying, setVerifying] = useState(false);

  const handleVerifyEmail = async (verify) => {
    setVerifying(true);
    try {
      if (verify) {
        await adminApi.verifyUserEmail(user.email);
        toast.success("Email verified");
      } else {
        await adminApi.unverifyUserEmail(user.email);
        toast.success("Email unverified");
      }
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update email verification");
    } finally {
      setVerifying(false);
    }
  };

  const activeCount = investments.filter((i) => i.status === "active").length;

  const openBankModal = (account) => {
    setBankForm(account
      ? { id: account.id, bankName: account.bankName || "", accountNumber: account.accountNumber || "", accountName: account.accountName || "", walletAddress: account.walletAddress || "", isDefault: !!account.isDefault }
      : { id: "", bankName: "", accountNumber: "", accountName: "", walletAddress: "", isDefault: false });
    setShowBankModal(true);
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      const payload = {
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        accountName: bankForm.accountName,
        walletAddress: bankForm.walletAddress,
        isDefault: bankForm.isDefault,
      };
      if (bankForm.id) await adminApi.updateUserBankAccount(id, bankForm.id, payload);
      else await adminApi.addUserBankAccount(id, payload);
      setShowBankModal(false);
      toast.success(bankForm.id ? "Bank account updated" : "Bank account added");
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save bank account");
    } finally {
      setSavingBank(false);
    }
  };

  const handleDeleteBank = async (account) => {
    if (!window.confirm(`Delete this ${account.bankName || "USDT wallet"} for ${user.firstName} ${user.lastName}?`)) return;
    try {
      await adminApi.deleteUserBankAccount(id, account.id);
      toast.success("Bank account deleted");
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete bank account");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>
        <Card>
          <p className="text-lg font-semibold text-gray-900">User not found</p>
        </Card>
      </div>
    );
  }

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const addressProof = parseDoc(kyc?.addressProof);
  const structuredAddress = addressProof && !addressProof.url ? addressProof : null;

  const kycDocs = [
    { key: "passportPhoto", label: "Passport Photo" },
    { key: "idDocument", label: "ID Document" },
    { key: "addressProof", label: "Utility Bill" },
    { key: "selfie", label: "Selfie" },
  ].map(({ key, label }) => ({ key, label, doc: parseDoc(kyc?.[key]) }))
    .filter(({ doc }) => doc?.url);

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <section className="space-y-4">
        {totalsByCurrency ? (
          totalsByCurrency.map((tc) => (
            <div key={tc.currency}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{tc.currency} Summary</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="inline-flex rounded-xl bg-blue-50 p-3"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
                  <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900">{tc.activeInvestments ?? tc.totalInvestments ?? 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Active Investments</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="inline-flex rounded-xl bg-emerald-50 p-3"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
                  <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(tc.totalInvested, tc.currency)}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Invested</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="inline-flex rounded-xl bg-amber-50 p-3"><Activity className="h-5 w-5 text-amber-600" /></div>
                  <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(tc.totalInterestEarned, tc.currency)}</p>
                  <p className="text-xs text-gray-500 mt-1">Interest Earned</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="inline-flex rounded-xl bg-violet-50 p-3"><CalendarDays className="h-5 w-5 text-violet-600" /></div>
                  <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(tc.totalExpectedMonthlyRepayment, tc.currency)}</p>
                  <p className="text-xs text-gray-500 mt-1">Monthly Repayment</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl bg-blue-50 p-3"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
              <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-xs text-gray-500 mt-1">Active Investments</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl bg-emerald-50 p-3"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
              <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(investments.reduce((s, i) => s + num(i.amount), 0))}</p>
              <p className="text-xs text-gray-500 mt-1">Total Invested</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl bg-amber-50 p-3"><Activity className="h-5 w-5 text-amber-600" /></div>
              <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(investments.reduce((s, i) => s + num(i.interestEarned), 0))}</p>
              <p className="text-xs text-gray-500 mt-1">Interest Earned</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl bg-violet-50 p-3"><CalendarDays className="h-5 w-5 text-violet-600" /></div>
              <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{formatCurrencyAmount(num(user?.totalPaymentAmountRecorded))}</p>
              <p className="text-xs text-gray-500 mt-1">Payments Recorded</p>
            </div>
          </div>
        )}
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Account Details
              </h3>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <DetailsRow
              icon={User}
              label="Full Name"
              value={`${user.firstName || ""} ${user.lastName || ""}`}
              color="bg-blue-100"
            />
            <DetailsRow
              icon={Mail}
              label="Email Address"
              value={user.email || "--"}
              color="bg-emerald-100"
            />
            <DetailsRow
              icon={Phone}
              label="Phone Number"
              value={user.phone || "--"}
              color="bg-amber-100"
            />
            <DetailsRow
              icon={CalendarDays}
              label="Date of Birth"
              value={user.dateOfBirth || "--"}
              color="bg-rose-100"
            />
            <DetailsRow
              icon={User}
              label="Gender"
              value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "--"}
              color="bg-fuchsia-100"
            />
            <DetailsRow
              icon={Award}
              label="Role"
              value={
                <Badge variant={roleVariant(user.role)}>
                  {user.role || "investor"}
                </Badge>
              }
              color="bg-violet-100"
            />
            <DetailsRow
              icon={CheckCircle}
              label="Email Verified"
              value={
                <button
                  onClick={() => handleVerifyEmail(!user.isVerified)}
                  disabled={verifying}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    user.isVerified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  } disabled:opacity-50`}
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                  <span className="text-[10px] opacity-70">({user.isVerified ? "click to unverify" : "click to verify"})</span>
                </button>
              }
              color={user.isVerified ? "bg-emerald-100" : "bg-red-100"}
            />
            <DetailsRow
              icon={Smartphone}
              label="Phone Verified"
              value={user.isPhoneVerified ? "Yes" : "No"}
              color={user.isPhoneVerified ? "bg-emerald-100" : "bg-red-100"}
            />
            <DetailsRow
              icon={Shield}
              label="2FA Enabled"
              value={user.twoFactorEnabled ? "Yes" : "No"}
              color={user.twoFactorEnabled ? "bg-emerald-100" : "bg-gray-100"}
            />
          </div>
        </Card>

        {/* Activity & Metadata */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Activity & Metadata
              </h3>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <DetailsRow
              icon={MapPin}
              label="Location"
              value={user.location || "--"}
              color="bg-rose-100"
            />
            <DetailsRow
              icon={Globe}
              label="Country"
              value={user.country || "--"}
              color="bg-cyan-100"
            />
            <DetailsRow
              icon={Landmark}
              label="State"
              value={user.state || "--"}
              color="bg-indigo-100"
            />
            <DetailsRow
              icon={Home}
              label="City"
              value={user.city || "--"}
              color="bg-teal-100"
            />
            <DetailsRow
              icon={Home}
              label="Street Address"
              value={user.streetAddress || "--"}
              color="bg-amber-100"
            />
            <DetailsRow
              icon={MapPin}
              label="Postal Code"
              value={user.postalCode || "--"}
              color="bg-orange-100"
            />
            <DetailsRow
              icon={Building2}
              label="Investor Type"
              value={user.investorType || "individual"}
              color="bg-cyan-100"
            />
            <DetailsRow
              icon={Wallet}
              label="Balance Left"
              value={formatCurrencyAmount(num(user.balanceLeft))}
              color="bg-emerald-100"
            />
            <DetailsRow
              icon={DollarSign}
              label="Total Due"
              value={formatCurrencyAmount(num(user.totalDue))}
              color="bg-amber-100"
            />
            <DetailsRow
              icon={CalendarDays}
              label="Joined"
              value={formatDate(user.createdAt)}
              color="bg-indigo-100"
            />
            <DetailsRow
              icon={Clock}
              label="Last Updated"
              value={formatDate(user.updatedAt)}
              color="bg-indigo-100"
            />
            <DetailsRow
              icon={Eye}
              label="User ID"
              value={user.id ? `${user.id.slice(0, 12)}...` : "--"}
              color="bg-gray-100"
            />
          </div>
        </Card>
      </div>

      {/* Bank Accounts */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Bank Accounts ({bankAccounts.length})
              </h3>
            </div>
            <Button size="sm" onClick={() => openBankModal(null)}>
              <Plus size={14} className="mr-1" /> Add Account
            </Button>
          </div>
        </div>
        <div className="p-4">
          {bankAccounts.length === 0 ? (
            <p className="text-sm text-gray-500">No saved bank accounts for this user.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bankAccounts.map((account) => (
                <div key={account.id} className="rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {account.bankName || "USDT Wallet"}
                      </p>
                      {account.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                          <Star size={10} /> Default
                        </span>
                      )}
                    </div>
                    {account.bankName ? (
                      <p className="text-sm text-gray-600 mt-1">
                        {account.accountNumber} · {account.accountName || "--"}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1 font-mono break-all">
                        {account.walletAddress || "--"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openBankModal(account)}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBank(account)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Investments Table */}
      {investments.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Investments ({investments.length})
                </h3>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Curr
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {investments.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/investments/${inv.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {inv.refNumber || (inv.id ? inv.id.slice(0, 8) : "--")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrencyAmount(num(inv.amount), inv.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${(inv.currency || "NGN") === "USD" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{inv.currency || "NGN"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          inv.status === "active"
                            ? "success"
                            : inv.status === "completed"
                              ? "default"
                              : "warning"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {inv.tenure ? `${inv.tenure} months` : "--"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(inv.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );

  const renderKyc = () => {
    if (!kyc) {
      return (
        <Card>
          <p className="text-gray-500">No KYC submission found for this user.</p>
        </Card>
      );
    }
    const kycStatus = kyc.status || "pending";
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                KYC Status
              </h3>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <DetailsRow icon={Shield} label="Status" value={<Badge variant={statusVariant(kycStatus)}>{kycStatus}</Badge>} color="bg-violet-100" />
            <DetailsRow icon={CalendarDays} label="Date of Birth" value={kyc.dateOfBirth || "--"} color="bg-rose-100" />
            <DetailsRow icon={User} label="Gender" value={kyc.gender ? kyc.gender.charAt(0).toUpperCase() + kyc.gender.slice(1) : "--"} color="bg-fuchsia-100" />
            <DetailsRow icon={CreditCard} label="BVN" value={kyc.bvn ? `****${String(kyc.bvn).slice(-4)}` : "--"} color="bg-amber-100" />
            <DetailsRow icon={CreditCard} label="NIN" value={kyc.nin ? `****${String(kyc.nin).slice(-4)}` : "--"} color="bg-emerald-100" />
            <DetailsRow icon={Clock} label="Submitted" value={formatDate(kyc.createdAt)} color="bg-indigo-100" />
            <DetailsRow icon={CalendarDays} label="Reviewed At" value={kyc.reviewedAt ? formatDate(kyc.reviewedAt) : "--"} color="bg-indigo-100" />
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Address & Documents
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {structuredAddress ? (
              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Country</span><span className="font-semibold">{structuredAddress.country || "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">State</span><span className="font-semibold">{structuredAddress.state || "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">City</span><span className="font-semibold">{structuredAddress.city || "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Address</span><span className="font-semibold">{structuredAddress.address || "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Postal Code</span><span className="font-semibold">{structuredAddress.postalCode || "--"}</span></div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No structured address provided.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kycDocs.length > 0 ? (
                kycDocs.map(({ key, label, doc }) => (
                  <DocumentLink key={key} doc={doc} label={label} />
                ))
              ) : (
                <p className="text-sm text-gray-400 col-span-2">No documents uploaded.</p>
              )}
            </div>
            {kyc.adminComment && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <span className="font-semibold">Rejection reason: </span>{kyc.adminComment}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderWallet = () => {
    if (!wallet) {
      return (
        <Card>
          <p className="text-gray-500">No wallet found for this user.</p>
        </Card>
      );
    }
    const items = [
      { label: "NGN Balance", value: formatCurrencyAmount(num(wallet.balance), "NGN") },
      { label: "USD Balance", value: formatCurrencyAmount(num(wallet.usdBalance), "USD") },
      { label: "USDT Balance", value: `${num(wallet.usdtBalance).toLocaleString()} USDT` },
      { label: "Total Invested", value: formatCurrencyAmount(num(wallet.totalInvested), "NGN") },
      { label: "Total Returns", value: formatCurrencyAmount(num(wallet.totalReturns), "NGN") },
    ];
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="inline-flex rounded-xl bg-emerald-50 p-3"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
            <p className="mt-4 text-lg font-bold text-gray-900 truncate">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderTransactions = () => {
    if (transactions.length === 0) {
      return (
        <Card>
          <p className="text-gray-500">No transactions found for this user.</p>
        </Card>
      );
    }
    return (
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium capitalize text-gray-900">{t.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.description || "--"}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{formatCurrencyAmount(num(t.amount), t.currency)}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{t.currency || "NGN"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(t.date || t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const renderWithdrawals = () => {
    if (withdrawals.length === 0 && distributions.length === 0) {
      return (
        <Card>
          <p className="text-gray-500">No withdrawals or distributions found for this user.</p>
        </Card>
      );
    }
    return (
      <div className="space-y-6">
        {withdrawals.length > 0 && (
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Withdrawals ({withdrawals.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Processed</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{formatCurrencyAmount(num(w.amount), "NGN")}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(w.status)}>{w.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-[220px]">
                        <span title={JSON.stringify(w.bankDetails || {})}>{formatBankSnapshot(w.bankDetails)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(w.requestDate || w.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{w.processedDate ? formatDate(w.processedDate) : "--"}</td>
                      <td className="px-6 py-4 text-gray-600">{w.notes || "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {distributions.length > 0 && (
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Distributions ({distributions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {distributions.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{formatCurrencyAmount(num(d.amount), "NGN")}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{d.type || "--"}</td>
                      <td className="px-6 py-4 text-gray-600">{d.period ? (typeof d.period === "string" ? d.period : (d.period?.month || d.period?.quarter || "--")) : "--"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{d.paidAt ? formatDate(d.paidAt) : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <button
        onClick={() => navigate("/admin/users")}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      {/* Profile Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative px-6 md:px-10 py-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-3xl border border-white/10 shadow-lg">
                  {initials}
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${user.status === "active" ? "bg-emerald-400" : "bg-gray-400"}`}
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} /> {user.email}
                  </span>
                  {user.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} /> {user.phone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Award size={14} /> Ref: {user.refNumber || "--"}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant={roleVariant(user.role)}>
                    {user.role || "investor"}
                  </Badge>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === "active" ? "bg-emerald-400/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"}`}
                  >
                    {user.status || "active"}
                  </span>
                  {kyc && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        kyc.status === "approved"
                          ? "bg-emerald-400/20 text-emerald-300"
                          : kyc.status === "rejected"
                            ? "bg-red-400/20 text-red-300"
                            : "bg-amber-400/20 text-amber-300"
                      }`}
                    >
                      KYC: {kyc.status || "pending"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-sm"
                onClick={() => setShowEdit(true)}
              >
                <Edit3 size={16} /> Edit
              </Button>
              <Button
                variant="outline"
                className="text-amber-300 border-amber-400/30 hover:bg-amber-500/20 bg-amber-500/10 backdrop-blur-sm"
                onClick={() => { setPasswordResult(null); setShowPasswordModal(true); }}
              >
                <KeyRound size={16} /> Reset Password
              </Button>
              <Button
                variant="outline"
                className="text-red-300 border-red-400/30 hover:bg-red-500/20 bg-red-500/10 backdrop-blur-sm"
                onClick={async () => {
                  if (
                    window.confirm(
                      `Delete user ${user.firstName} ${user.lastName}? This cannot be undone.`,
                    )
                  ) {
                    try {
                      await adminApi.deleteUser(id);
                      toast.success("User deleted");
                      navigate("/admin/users");
                    } catch (err) {
                      toast.error(
                        err?.response?.data?.message || "Failed to delete user",
                      );
                    }
                  }
                }}
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ key, label, icon: TabIcon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-neon-tangerine text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <TabIcon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "kyc" && renderKyc()}
      {activeTab === "wallet" && renderWallet()}
      {activeTab === "transactions" && renderTransactions()}
      {activeTab === "withdrawals" && renderWithdrawals()}

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit User"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />
            <Input
              label="Location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) =>
                  setEditForm({ ...editForm, dateOfBirth: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={editForm.gender}
                onChange={(e) =>
                  setEditForm({ ...editForm, gender: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Country"
              value={editForm.country}
              onChange={(e) =>
                setEditForm({ ...editForm, country: e.target.value })
              }
            />
            <Input
              label="State"
              value={editForm.state}
              onChange={(e) =>
                setEditForm({ ...editForm, state: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={editForm.city}
              onChange={(e) =>
                setEditForm({ ...editForm, city: e.target.value })
              }
            />
            <Input
              label="Postal Code"
              value={editForm.postalCode}
              onChange={(e) =>
                setEditForm({ ...editForm, postalCode: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <textarea
              rows={2}
              value={editForm.streetAddress}
              onChange={(e) =>
                setEditForm({ ...editForm, streetAddress: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none"
            >
              <option value="investor">Investor</option>
              <option value="compliance_officer">Compliance Officer</option>
              <option value="finance_officer">Finance Officer</option>
              <option value="investment_manager">Investment Manager</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Reset Password" size="sm">
        {passwordResult ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Password Reset Successful</p>
              <p className="text-sm text-gray-500 mt-1">A new password has been sent to {user.email}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Temporary Password</p>
              <p className="text-lg font-mono font-bold text-gray-900 tracking-wider select-all">{passwordResult}</p>
            </div>
            <p className="text-xs text-gray-400">Share this password with the user. They will be prompted to change it on next login.</p>
            <div className="flex justify-center pt-1">
              <Button onClick={() => setShowPasswordModal(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <KeyRound size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Reset password for {user.firstName} {user.lastName}?</p>
                <p className="text-sm text-amber-700 mt-1">
                  A new temporary password will be generated and emailed to <strong>{user.email}</strong>. They will need to change it after logging in.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                setPasswordResetting(true);
                try {
                  const res = await adminApi.resetUserPassword(id);
                  setPasswordResult(res.tempPassword);
                  toast.success("Password reset email sent");
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Failed to reset password");
                  setShowPasswordModal(false);
                } finally {
                  setPasswordResetting(false);
                }
              }} disabled={passwordResetting}>
                {passwordResetting ? "Resetting..." : "Generate & Send"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bank Account Modal */}
      <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title={bankForm.id ? "Edit Bank Account" : "Add Bank Account"} size="md">
        <form onSubmit={handleSaveBank} className="space-y-4">
          <Input
            label="Bank Name"
            value={bankForm.bankName}
            onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
            placeholder="e.g., GTBank"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account Number"
              value={bankForm.accountNumber}
              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="0123456789"
              maxLength={10}
            />
            <Input
              label="Account Name"
              value={bankForm.accountName}
              onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
              placeholder="Enter account name"
            />
          </div>
          <Input
            label="USDT Wallet Address (optional)"
            value={bankForm.walletAddress}
            onChange={(e) => setBankForm({ ...bankForm, walletAddress: e.target.value })}
            placeholder="TRC20 wallet address for USDT payouts"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={bankForm.isDefault}
              onChange={(e) => setBankForm({ ...bankForm, isDefault: e.target.checked })}
            />
            Set as default account
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowBankModal(false)}>Cancel</Button>
            <Button type="submit" disabled={savingBank}>
              {savingBank ? "Saving..." : bankForm.id ? "Save Changes" : "Add Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
