import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PiggyBank } from "lucide-react";
import { wealthApi } from "../../services/api";
import { Card, Button, Input } from "../../components/common";
import useAuthStore from "../../store/authStore";

export default function CreateWealthPlan() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [cooperatives, setCooperatives] = useState([]);
  const [form, setForm] = useState({
    monthlyContribution: "",
    duration: "",
    employerName: "",
    employeeId: "",
    department: "",
    cooperative: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await wealthApi.getCooperatives();
        setCooperatives(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) { /* silent */ }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.monthlyContribution) return;
    setSaving(true);
    setError("");
    try {
      const data = await wealthApi.createPlan({
        monthlyContribution: parseFloat(form.monthlyContribution),
        duration: form.duration ? parseInt(form.duration) : null,
        employerName: form.employerName || null,
        employeeId: form.employeeId || null,
        department: form.department || null,
        cooperative: form.cooperative || null,
      });
      const plan = data?.data || data;
      navigate(`/wealth-plans/${plan.id}`);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span>
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Wealth Plan</h1>
        <p className="text-gray-600">Set up a structured monthly savings plan</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Monthly Contribution (₦)" type="number" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} placeholder="e.g. 50000" required />
            <Input label="Duration (months)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12" />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Employment Details (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Employer Name" value={form.employerName} onChange={(e) => setForm({ ...form, employerName: e.target.value })} placeholder="Your employer" />
              <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="Staff ID" />
              <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Your department" />
              {cooperatives.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cooperative (Optional)</label>
                  <select value={form.cooperative} onChange={(e) => setForm({ ...form, cooperative: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none">
                    <option value="">Select cooperative</option>
                    {cooperatives.filter((c) => c.status === "active").map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
            <PiggyBank className="text-emerald-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-emerald-800">Consistent savings build lasting wealth</p>
              <p className="text-xs text-emerald-600 mt-1">Your contributions will be invested in income-generating assets. Track your progress anytime.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.monthlyContribution}>
              {saving ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
