import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Shield, CalendarDays, TrendingUp, DollarSign, Activity } from "lucide-react";
import { adminApi, userApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Input, Modal } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "--";

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
      const u = data?.data || data?.user || data;
      setUser(u);
      setEditForm({ firstName: u.firstName || "", lastName: u.lastName || "", phone: u.phone || "", role: u.role || "investor" });
    } catch (err) {
      setUser(null);
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
      setShowEdit(false);
      fetchUser();
    } catch (err) { /* silent */ }
    finally { setSaving(false); }
  };

  const roleVariant = (role) => {
    switch (role) {
      case "admin": return "warning";
      case "super_admin": return "danger";
      case "compliance_officer": return "info";
      case "investment_manager": return "brand";
      default: return "default";
    }
  };

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Card /><Skeleton.Card /></div>;
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span>
        </button>
        <Card><p className="text-lg font-semibold text-gray-900">User not found</p></Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span>
      </button>

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 text-white overflow-hidden">
          <div className="p-4 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center gap-3 text-sm text-cyan-100">
                  <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                  {user.phone && <span className="flex items-center gap-1"><Phone size={14} /> {user.phone}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={roleVariant(user.role)}>{user.role || "investor"}</Badge>
                  <span className="text-sm text-cyan-100">Ref: {user.refNumber || "--"}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => setShowEdit(true)}>Edit User</Button>
          </div>
        </div>
      </section>

      {stats && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Active Investments", value: stats.activeInvestments || stats.totalInvestments || 0, icon: TrendingUp, color: "bg-blue-500" },
            { label: "Total Invested", value: formatNaira(stats.totalInvested || stats.totalAmount || 0), icon: DollarSign, color: "bg-green-500" },
            { label: "Total Interest", value: formatNaira(stats.totalInterest || stats.interestEarned || 0), icon: Activity, color: "bg-brand-500" },
            { label: "Payments Recorded", value: formatNaira(stats.totalPayments || 0), icon: CalendarDays, color: "bg-yellow-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-3"><s.icon className="h-5 w-5 text-gray-600" /></div>
              <p className="mt-4 text-xl md:text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </section>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Status", value: user.status || "active" },
            { label: "Investor Type", value: user.investorType || "individual" },
            { label: "Email Verified", value: user.isVerified ? "Yes" : "No" },
            { label: "Phone Verified", value: user.isPhoneVerified ? "Yes" : "No" },
            { label: "2FA Enabled", value: user.twoFactorEnabled ? "Yes" : "No" },
            { label: "Location", value: user.location || "--" },
            { label: "Joined", value: formatDate(user.createdAt) },
            { label: "Last Updated", value: formatDate(user.updatedAt) },
          ].map((d) => (
            <div key={d.label} className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">{d.label}</span>
              <span className="text-sm font-semibold text-gray-900">{d.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            <Input label="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
          </div>
          <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none">
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
