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

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [totalsByCurrency, setTotalsByCurrency] = useState(null);
  const [stats, setStats] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordResetting, setPasswordResetting] = useState(false);
  const [passwordResult, setPasswordResult] = useState(null);

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
      setEditForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        phone: u.phone || "",
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
        {/* Account Details */}
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

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit User"
        size="md"
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
          <Input
            label="Phone"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
          />
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
    </div>
  );
}
