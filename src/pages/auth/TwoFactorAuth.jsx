import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authApi } from "../../services/api";
import useAuth from "../../hooks/useAuth";

function TwoFactorAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) document.getElementById(`2fa-code-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      document.getElementById(`2fa-code-${index - 1}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = code.join("");
    if (token.length !== 6) { setError("Please enter the complete 6-digit code"); return; }
    setLoading(true);
    try {
      const response = await authApi.verify2FA(token);
      if (response.token) login(response.token, response.user);
      setVerified(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Invalid 2FA code");
    } finally { setLoading(false); }
  };

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
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
        <div className="w-14 h-14 mx-auto mb-4 bg-neon-tangerine/10 rounded-2xl flex items-center justify-center">
          <Shield className="text-neon-tangerine" size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center mb-8">
          {code.map((digit, i) => (
            <input key={i} id={`2fa-code-${i}`} type="text" inputMode="numeric" maxLength={1}
              value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine outline-none" required />
          ))}
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all disabled:opacity-50">
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Having trouble? <button className="text-neon-tangerine font-medium hover:text-neon-tangerine/80">Use recovery code</button>
      </p>
    </div>
  );
}

export default TwoFactorAuth;
