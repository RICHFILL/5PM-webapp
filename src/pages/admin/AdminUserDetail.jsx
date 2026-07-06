import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, CalendarDays, TrendingUp, DollarSign, Activity, Building2, Shield, User, Clock, CheckCircle, XCircle, Smartphone, MapPin, Edit3, Trash2, Award, Eye } from "lucide-react";
import { adminApi, userApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Input, Modal } from "../../components/common";
import { formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "--";

const roleVariant = (role) => {
  switch (role) {
    case "admin": return "warning";
    case "super_admin": return "danger";
    case "compliance_officer": return "info";
    case "investment_manager": return "brand";
    case "finance_officer": return "success";
    default: return "default";
  }
};

const statCards = [
  { key: "activeInvestments", label: "Active Investments", icon: TrendingUp, color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
  { key: "totalInvested", label: "Total Invested", icon: DollarSign, color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", currency: true },
  { key: "totalInterest", label: "Total Interest Earned", icon: Activity, color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-600", currency: true },
  { key: "totalPayments", label: "Payments Recorded", icon: CalendarDays, color: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-600", currency: true },
];

function DetailsRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-9 h-9 rounded-lg ${color || "bg-gray-100"} flex items-center justify-center shrink-0`}>
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
  const [stats, setStats] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "", role: "" });
  const [saving, setSaving] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUserDetail(id);
      const u = data?.data?.user || data?.user || data;
      const inv = data?.data?.investments || data?.investments || [];
      setUser(u);
      setInvestments(Array.isArray(inv) ? inv : []);
      setEditForm({ firstName: u.firstName || "", lastName: u.lastName || "", phone: u.phone || "", role: u.role || "investor" });
    } catch (err) {
      setUser(null);
      toast.error("Failed to load user details");
    } finally { setLoading(false); }
  }, [id]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await userApi.getUserStats(id);
      setStats(data?.data || data);
    } catch (err) { /* silent */ }
  }, [id]);

  useEffect(() => { fetchUser(); fetchStats(); }, [fetchUser, fetchStats]);

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
    }
    finally { setSaving(false); }
  };

  const resolveStatValue = (s) => {
    if (s.currency) {
      return formatCurrency(stats?.[s.key] || 0, "NGN");
    }
    return stats?.[s.key] ?? stats?.totalInvestments ?? stats?.totalAmount ?? stats?.interestEarned ?? 0;
  };

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Card /><Skeleton.Card /></div>;
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to Users</span>
        </button>
        <Card><p className="text-lg font-semibold text-gray-900">User not found</p></Card>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Navigation */}
      <button onClick={() => navigate("/admin/users")} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
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
                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${user.status === "active" ? "bg-emerald-400" : "bg-gray-400"}`} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.firstName} {user.lastName}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
                  {user.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {user.phone}</span>}
                  <span className="inline-flex items-center gap-1.5"><Award size={14} /> Ref: {user.refNumber || "--"}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant={roleVariant(user.role)}>{user.role || "investor"}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === "active" ? "bg-emerald-400/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"}`}>
                    {user.status || "active"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-sm" onClick={() => setShowEdit(true)}>
                <Edit3 size={16} /> Edit
              </Button>
              <Button variant="outline" className="text-red-300 border-red-400/30 hover:bg-red-500/20 bg-red-500/10 backdrop-blur-sm" onClick={async () => {
                if (window.confirm(`Delete user ${user.firstName} ${user.lastName}? This cannot be undone.`)) {
                  try {
                    await adminApi.deleteUser(id);
                    toast.success("User deleted");
                    navigate("/admin/users");
                  } catch (err) {
                    toast.error(err?.response?.data?.message || "Failed to delete user");
                  }
                }
              }}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const val = resolveStatValue(s);
            return (
              <div key={s.key} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex rounded-xl ${s.bg} p-3`}>
                  <s.icon className={`h-5 w-5 ${s.text}`} />
                </div>
                <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900 truncate">{val}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </section>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Account Details */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Account Details</h3>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <DetailsRow icon={User} label="Full Name" value={`${user.firstName || ""} ${user.lastName || ""}`} color="bg-blue-100" />
            <DetailsRow icon={Mail} label="Email Address" value={user.email || "--"} color="bg-emerald-100" />
            <DetailsRow icon={Phone} label="Phone Number" value={user.phone || "--"} color="bg-amber-100" />
            <DetailsRow icon={Award} label="Role" value={<Badge variant={roleVariant(user.role)}>{user.role || "investor"}</Badge>} color="bg-violet-100" />
            <DetailsRow icon={CheckCircle} label="Email Verified" value={user.isVerified ? "Yes" : "No"} color={user.isVerified ? "bg-emerald-100" : "bg-red-100"} />
            <DetailsRow icon={Smartphone} label="Phone Verified" value={user.isPhoneVerified ? "Yes" : "No"} color={user.isPhoneVerified ? "bg-emerald-100" : "bg-red-100"} />
            <DetailsRow icon={Shield} label="2FA Enabled" value={user.twoFactorEnabled ? "Yes" : "No"} color={user.twoFactorEnabled ? "bg-emerald-100" : "bg-gray-100"} />
          </div>
        </Card>

        {/* Activity & Metadata */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Activity & Metadata</h3>
            </div>
          </div>
          <div className="p-2 space-y-0.5">
            <DetailsRow icon={MapPin} label="Location" value={user.location || "--"} color="bg-rose-100" />
            <DetailsRow icon={Building2} label="Investor Type" value={user.investorType || "individual"} color="bg-cyan-100" />
            <DetailsRow icon={CalendarDays} label="Joined" value={formatDate(user.createdAt)} color="bg-indigo-100" />
            <DetailsRow icon={Clock} label="Last Updated" value={formatDate(user.updatedAt)} color="bg-indigo-100" />
            <DetailsRow icon={Eye} label="User ID" value={user.id?.slice(0, 12) + "..." || "--"} color="bg-gray-100" />
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
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Investments ({investments.length})</h3>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/investments/${inv.id}`)}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{inv.refNumber || inv.id?.slice(0, 8) || "--"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(inv.amount || inv.totalAmount, "NGN")}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={inv.status === "active" ? "success" : inv.status === "completed" ? "default" : "warning"}>{inv.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{inv.projectData?.title || inv.project || "--"}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(inv.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            <Input label="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
          </div>
          <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none">
              <option value="investor">Investor</option>
              <option value="compliance_officer">Compliance Officer</option>
              <option value="finance_officer">Finance Officer</option>
              <option value="investment_manager">Investment Manager</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
