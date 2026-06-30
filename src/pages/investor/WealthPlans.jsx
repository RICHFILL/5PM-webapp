import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, TrendingUp, CalendarDays, PiggyBank, Clock } from "lucide-react";
import { wealthApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function WealthPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await wealthApi.getMyPlans();
        setPlans(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        setPlans([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Card /><Skeleton.Card /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Salary Wealth Plans</h1>
          <p className="text-gray-600">Build wealth through consistent monthly contributions</p>
        </div>
        <Button onClick={() => navigate("/wealth-plans/create")}><Plus size={16} /> New Plan</Button>
      </div>

      {plans.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <PiggyBank size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Wealth Plans Yet</h3>
            <p className="text-gray-500 mb-6">Start building wealth with a structured savings plan.</p>
            <Button onClick={() => navigate("/wealth-plans/create")}>Create Your First Plan</Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/wealth-plans/${plan.id}`)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neon-tangerine/20 flex items-center justify-center">
                    <PiggyBank className="text-neon-tangerine" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Wealth Plan</h3>
                    <p className="text-sm text-gray-500">{plan.employerName || "Self sponsored"}</p>
                  </div>
                </div>
                <Badge variant={plan.status === "active" ? "success" : plan.status === "completed" ? "info" : "danger"}>{plan.status}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monthly Contribution</p>
                  <p className="font-semibold text-gray-900">{formatNaira(plan.monthlyContribution)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Contributed</p>
                  <p className="font-semibold text-gray-900">{formatNaira(plan.totalContributed)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{plan.duration || "--"} months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Started</p>
                  <p className="font-semibold text-gray-900">{formatDate(plan.startDate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
