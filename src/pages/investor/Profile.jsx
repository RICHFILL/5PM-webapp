import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Building, Calendar, Lock, Bell, LogOut, Edit2, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { userApi, kycApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

function Profile() {
  const { user: localUser, logout, setUser } = useAuthStore();
  const [user, setUserData] = useState(localUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kycStatus, setKycStatus] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "", location: "" });

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
        }
        if (kyc) setKycStatus(kyc?.status || kyc?.data?.status || null);
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
      const data = updated?.data || updated;
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
    });
    setShowEditModal(true);
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const kycBadgeVariant = (status) => {
    switch (status) {
      case "approved": return "success";
      case "under-review": return "warning";
      case "rejected": return "danger";
      default: return "default";
    }
  };

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
            <div className="flex items-start gap-3">
              <Mail className="text-neon-tangerine mt-1 shrink-0" size={20} />
              <div><p className="text-gray-600 text-sm">Email</p><p className="font-medium text-gray-900">{user?.email}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-neon-tangerine mt-1 shrink-0" size={20} />
              <div><p className="text-gray-600 text-sm">Phone</p><p className="font-medium text-gray-900">{user?.phone || "Not provided"}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-neon-tangerine mt-1 shrink-0" size={20} />
              <div><p className="text-gray-600 text-sm">Location</p><p className="font-medium text-gray-900">{user?.location || "Not provided"}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Building className="text-neon-tangerine mt-1 shrink-0" size={20} />
              <div><p className="text-gray-600 text-sm">Investor Type</p><p className="font-medium text-gray-900">Individual Investor</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-neon-tangerine mt-1 shrink-0" size={20} />
              <div><p className="text-gray-600 text-sm">Joined</p><p className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p></div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
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
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status</h3>
            <div className="flex items-center gap-3">
              {kycStatus === "approved" ? (
                <CheckCircle size={24} className="text-green-500" />
              ) : kycStatus === "under-review" ? (
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
                   kycStatus === "under-review" ? "Your documents are being reviewed" :
                   kycStatus === "rejected" ? "Your verification was rejected. Please re-submit" :
                   "Complete KYC to unlock full access"}
                </p>
              </div>
            </div>
            {kycStatus !== "approved" && (
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => window.location.href = "/kyc"}>
                Complete KYC
              </Button>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); setError(""); }} title="Change Password"  size="lg">
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

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile"  size="lg">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleEditProfile} className="space-y-4">
          <Input label="First Name" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} required />
          <Input label="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} required />
          <Input label="Phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
          <Input label="Location" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
