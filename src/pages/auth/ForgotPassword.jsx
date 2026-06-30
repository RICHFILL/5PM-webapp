import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { authApi } from "../../services/api";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess("Check your email for password reset instructions");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, newPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none";

  return (
    <div>
      <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Login</span>
      </Link>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-6">
        {step === 1 ? "Enter your email to receive reset instructions" : "Enter your reset token and new password"}
      </p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>}

      {step === 1 ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="investor@example.com" required className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
            <input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste token from your email" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
