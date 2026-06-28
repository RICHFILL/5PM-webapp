import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "../../services/api";
import { Input } from "../../components/common";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!tokenFromUrl) { setError("Invalid reset link"); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(tokenFromUrl, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /><span className="text-sm font-medium">Back to Login</span>
      </Link>
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center">
          <Lock className="text-brand-500" size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="New Password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required />
        <Input label="Confirm Password" type="password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required />
        <button type="submit" disabled={loading}
          className="w-full bg-brand-500 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-600 transition-all disabled:opacity-50">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
