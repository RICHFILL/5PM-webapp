import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "../../services/api";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const getEmail = () => {
    const stateEmail = location.state?.email;
    if (stateEmail) return stateEmail;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.email || '';
    } catch { return ''; }
  };

  const email = getEmail();

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`verify-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await authApi.resendVerification(email);
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = code.join("");
    if (token.length !== 6) { setError("Please enter the complete 6-digit code"); return; }
    if (!email) { setError("Email not found. Please log in again."); return; }
    setLoading(true);
    try {
      await authApi.verifyEmail(email, token);
      setVerified(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Invalid or expired verification code");
    } finally { setLoading(false); }
  };

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /><span className="text-sm font-medium">Back</span>
      </Link>
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center">
          <Mail className="text-brand-500" size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">Enter the 6-digit code sent to</p>
        <p className="text-sm font-semibold text-gray-900">{email || 'your email'}</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center mb-8">
          {code.map((digit, i) => (
            <input key={i} id={`verify-code-${i}`} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              required />
          ))}
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-brand-500 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-600 transition-all disabled:opacity-50">
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Did not receive the code?{" "}
        <button type="button" onClick={handleResend} disabled={loading} className="text-brand-500 font-medium hover:text-brand-600 disabled:opacity-50">Resend Code</button>
      </p>
    </div>
  );
}

export default VerifyEmail;
