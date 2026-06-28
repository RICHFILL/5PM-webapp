import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { authApi } from "../../services/api";

function OtpInput({ length, value, onChange }) {
  const inputRefs = useRef([]);
  const handleChange = (index, val) => {
    if (val.length > 1) return;
    const newValue = value.map((d, i) => i === index ? val : d);
    onChange(newValue);
    if (val && index < length - 1) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };
  return (
    <div className="flex gap-3 justify-center">
      {value.map((digit, i) => (
        <input key={i} ref={(el) => (inputRefs.current[i] = el)} type="text" inputMode="numeric" maxLength={1}
          value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
      ))}
    </div>
  );
}

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
  const [step, setStep] = useState("register");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*]/.test(formData.password),
  };
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

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
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the complete 6-digit code"); return; }
    setVerifying(true);
    try {
      await authApi.verifyEmail(formData.email, code);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid or expired verification code");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.forgotPassword(formData.email);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none";

  if (step === "verify") {
    return (
      <div>
        <button onClick={() => setStep("register")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} /><span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Mail className="text-brand-500" size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">Enter the 6-digit code sent to <span className="font-semibold text-gray-900">{formData.email}</span></p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleVerifyOtp}>
          <OtpInput length={6} value={otp} onChange={setOtp} />
          <button type="submit" disabled={verifying || otp.join("").length !== 6}
            className="w-full bg-brand-500 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 mt-6">
            {verifying ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Did not receive the code?{" "}
          <button type="button" onClick={handleResend} className="text-brand-500 font-medium hover:text-brand-600">Resend Code</button>
        </p>
      </div>
    );
  }

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
            {Object.entries({ "At least 8 characters": passwordChecks.minLength, "One uppercase letter": passwordChecks.hasUppercase, "One number": passwordChecks.hasNumber, "One special character (!@#$%^&*)": passwordChecks.hasSpecial }).map(([label, check]) => (
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
            I agree to the <Link to="/terms" className="text-brand-500 font-medium">Terms & Conditions</Link> and <Link to="/terms" className="text-brand-500 font-medium">Privacy Policy</Link>
          </span>
        </label>
        <button type="submit" disabled={loading || !agreeTerms || !Object.values(passwordChecks).every(Boolean) || !passwordsMatch}
          className="w-full bg-brand-500 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-600 transition-all duration-200 disabled:opacity-50">
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <hr className="my-6" />
      <p className="text-center text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-brand-500 font-medium">Sign in here</Link></p>
    </div>
  );
}

export default Register;
