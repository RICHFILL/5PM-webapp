import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Shield,
  Wallet,
  TrendingUp,
  Building,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/common";
import { helpApi } from "../../services/api";

const categoryOptions = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "security", label: "Account & Security", icon: Shield },
  { id: "deposits-withdrawals", label: "Deposits & Withdrawals", icon: Wallet },
  { id: "trading", label: "Investments", icon: TrendingUp },
  { id: "corporate", label: "Corporate Accounts", icon: Building },
  { id: "billing", label: "Billing & Fees", icon: Banknote },
];

const priorityOptions = [
  { id: "low", label: "Low" },
  { id: "normal", label: "Normal" },
  { id: "high", label: "High" },
  { id: "urgent", label: "Urgent" },
];

function HelpCentre() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    priority: "normal",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Please enter a valid email.";
    if (!form.category) next.category = "Please select a category.";
    if (!form.subject.trim()) next.subject = "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 20)
      next.message = "Please describe your issue (at least 20 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      await helpApi.submitTicket({
        name: form.name,
        email: form.email,
        category: form.category,
        priority: form.priority,
        subject: form.subject,
        message: form.message,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err?.response?.data?.message ||
          "Something went wrong sending your request. Please try again.",
      );
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      category: "",
      priority: "normal",
      subject: "",
      message: "",
    });
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div>
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">
              Help Centre
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
              How Can We Help You?
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Tell us what's going on and our support team will get back to you
              within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === "success" ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Request Sent
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                Thanks, {form.name.split(" ")[0] || "there"}. We've received
                your request and will respond to{" "}
                <span className="font-medium text-gray-700">{form.email}</span>{" "}
                within 24 hours.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleReset}
                  className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  Send Another Request
                </Button>
                <Link to="/">
                  <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-6 py-3 rounded-xl text-sm">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6"
            >
              {status === "error" && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={18}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Jane Doe"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="jane@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  What do you need help with?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryOptions.map((cat) => {
                    const Icon = cat.icon;
                    const active = form.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, category: cat.id }))
                        }
                        className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-200 ${
                          active
                            ? "border-neon-tangerine bg-neon-tangerine/5 ring-2 ring-neon-tangerine/30"
                            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            active ? "text-neon-tangerine" : "text-gray-400"
                          }
                        />
                        <span className="text-xs font-semibold text-gray-900">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-2">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((p) => {
                    const active = form.priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, priority: p.id }))
                        }
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                          active
                            ? "bg-neon-tangerine border-neon-tangerine text-white"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={update("subject")}
                  placeholder="Brief summary of your issue"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent ${
                    errors.subject ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us what's happening, including any relevant account or transaction details..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent resize-none ${
                    errors.message ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-neon-tangerine hover:bg-neon-tangerine/80 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                We typically respond within 24 hours. For urgent account
                security issues, mark priority as Urgent.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default HelpCentre;
