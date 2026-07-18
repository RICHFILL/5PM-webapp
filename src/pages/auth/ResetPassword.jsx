import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff, Check } from "lucide-react";
import { authApi } from "../../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    minLength: password.length >= 12,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLabel = strengthScore <= 1 ? "Weak" : strengthScore <= 2 ? "Fair" : strengthScore <= 3 ? "Good" : "Strong";
  const strengthColor = strengthScore <= 1 ? "bg-red-500" : strengthScore <= 2 ? "bg-orange-400" : strengthScore <= 3 ? "bg-yellow-400" : "bg-green-500";
  const strengthTextColor = strengthScore <= 1 ? "text-red-600" : strengthScore <= 2 ? "text-orange-500" : strengthScore <= 3 ? "text-yellow-600" : "text-green-600";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!Object.values(passwordChecks).every(Boolean)) { setError("Password does not meet requirements"); return; }
    if (!passwordsMatch) { setError("Passwords do not match"); return; }
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

  const inputClass = `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${!Object.values(passwordChecks).every(Boolean) ? "focus:ring-red-500" : "focus:ring-neon-tangerine"} focus:border-transparent outline-none`;

  return (
    <div>
      <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /><span className="text-sm font-medium">Back to Login</span>
      </Link>
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 bg-neon-tangerine/10 rounded-2xl flex items-center justify-center">
          <Lock className="text-neon-tangerine" size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {password && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={strengthTextColor}>{strengthLabel}</span>
                  <span className="text-gray-400">{strengthScore}/5</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${strengthColor} h-2 rounded-full transition-all duration-300`} style={{ width: `${(strengthScore / 5) * 100}%` }}></div>
                </div>
              </div>
            )}
            {Object.entries({ "At least 12 characters": passwordChecks.minLength, "One lowercase letter": passwordChecks.hasLowercase, "One uppercase letter": passwordChecks.hasUppercase, "One number": passwordChecks.hasNumber, "One special character (!@#$%^&*)": passwordChecks.hasSpecial }).map(([label, check]) => (
              <div key={label} className={`flex items-center gap-2 ${check ? "text-green-600" : "text-gray-500"}`}>
                <Check size={16} /> <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required className={inputClass} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && <p className="text-red-600 text-sm mt-1">Passwords do not match</p>}
          {passwordsMatch && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><Check size={16} /> Passwords match</p>}
        </div>
        <button type="submit" disabled={loading || !Object.values(passwordChecks).every(Boolean) || !passwordsMatch}
          className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all disabled:opacity-50">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
