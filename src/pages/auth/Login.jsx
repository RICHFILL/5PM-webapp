import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { authApi } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordError = password && (
    password.length < 12
      ? "At least 12 characters required"
      : !/[a-z]/.test(password)
        ? "Needs a lowercase letter"
        : !/[A-Z]/.test(password)
          ? "Needs an uppercase letter"
          : !/[0-9]/.test(password)
            ? "Needs a number"
            : !/[!@#$%^&*]/.test(password)
              ? "Needs a special character (!@#$%^&*)"
              : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const token = response.accessToken || response.token;
      if (response.user) {
        login(token, response.user);
      } else {
        localStorage.setItem("authToken", token);
        login(token, { email });
      }
      const redirectTo = response.user?.role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = redirectTo;
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.message?.toLowerCase().includes('not verified')) {
        window.location.href = '/verify-email';
        return;
      }
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
        Investor Portal
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Sign in to view your investment portfolio
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none ${passwordError ? "border-red-300" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>
        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm text-neon-tangerine hover:text-neon-tangerine/80 font-medium">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neon-tangerine text-white font-semibold py-2.5 rounded-lg hover:bg-neon-tangerine/80 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-neon-tangerine hover:text-neon-tangerine/80 font-medium">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
