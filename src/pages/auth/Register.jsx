import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { authApi } from "../../services/api";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordChecks = {
    minLength: formData.password.length >= 12,
    hasLowercase: /[a-z]/.test(formData.password),
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*]/.test(formData.password),
  };
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLabel = strengthScore <= 1 ? "Weak" : strengthScore <= 2 ? "Fair" : strengthScore <= 3 ? "Good" : "Strong";
  const strengthColor = strengthScore <= 1 ? "bg-red-500" : strengthScore <= 2 ? "bg-orange-400" : strengthScore <= 3 ? "bg-yellow-400" : "bg-green-500";
  const strengthTextColor = strengthScore <= 1 ? "text-red-600" : strengthScore <= 2 ? "text-orange-500" : strengthScore <= 3 ? "text-yellow-600" : "text-green-600";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!agreeTerms) { setError("You must agree to the Terms & Conditions"); return; }
    if (!Object.values(passwordChecks).every(Boolean)) { setError("Password does not meet requirements"); return; }
    if (!passwordsMatch) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const response = await authApi.register(formData.email, formData.password, formData.firstName, formData.lastName);
      const token = response.token || response.accessToken;
      localStorage.setItem("authToken", token);
      if (response.user) login(token, response.user);
      else login(token, { firstName: formData.firstName, lastName: formData.lastName, email: formData.email });
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none";

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-600 mb-6">Join 5PM Nexus Invest to start investing</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="investor@example.com" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {formData.password && (
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
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className={inputClass} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formData.confirmPassword && !passwordsMatch && <p className="text-red-600 text-sm mt-1">Passwords do not match</p>}
          {passwordsMatch && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><Check size={16} /> Passwords match</p>}
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 rounded border-gray-300 cursor-pointer mt-1" />
          <span className="text-sm text-gray-600">
            I agree to the <Link to="/terms" className="text-neon-tangerine font-medium">Terms & Conditions</Link> and <Link to="/terms" className="text-neon-tangerine font-medium">Privacy Policy</Link>
          </span>
        </label>
        <button type="submit" disabled={loading || !agreeTerms || !Object.values(passwordChecks).every(Boolean) || !passwordsMatch}
          className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all duration-200 disabled:opacity-50">
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <hr className="my-6" />
      <p className="text-center text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-neon-tangerine font-medium">Sign in here</Link></p>
    </div>
  );
}

export default Register;
