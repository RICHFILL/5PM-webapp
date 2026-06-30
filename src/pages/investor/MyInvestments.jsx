import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { userApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton, Badge } from "../../components/common";

export default function MyInvestments() {
  const navigate = useNavigate();
  const { user: localUser } = useAuthStore();
  const id = localUser?.id || localUser?._id;

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({ totalPaymentAmountRecorded: 0, totalDue: 0, balanceLeft: 0 });

  const fetchUserData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [userData, statsData] = await Promise.all([
        userApi.getUserById(id),
        userApi.getUserStats(id),
      ]);
      const fetchedUser = userData?.data || userData;
      setUser(fetchedUser);
      setStats(statsData?.data || statsData);
      setInvestments(fetchedUser?.investments || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally { setLoading(false); }
  }, [id]);

  const fetchUserPayments = useCallback(async () => {
    if (!id) return;
    try {
      setPaymentsLoading(true);
      const paymentsData = await userApi.getUserPayments(id);
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData?.data ?? []);
      setPaymentTotals({
        totalPaymentAmountRecorded: paymentsData?.totals?.totalPaymentAmountRecorded ?? 0,
        totalDue: paymentsData?.totals?.totalDue ?? 0,
        balanceLeft: paymentsData?.totals?.balanceLeft ?? 0,
      });
    } catch {
      setPayments([]);
    } finally { setPaymentsLoading(false); }
  }, [id]);

  useEffect(() => { fetchUserData(); fetchUserPayments(); }, [fetchUserData, fetchUserPayments]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "warning";
      case "completed": return "success";
      default: return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  const formatCurrency = (amount) => `₦${(amount || 0).toLocaleString()}`;
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Good morning, {localUser?.firstName}</h1>
        <p className="text-gray-600 text-sm md:text-base">Welcome back to your investment dashboard</p>
      </div>

      <div className="bg-dark-lavender rounded-2xl p-4 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
              <span className="text-xl md:text-3xl font-bold">{user?.user?.firstName?.[0] || "U"}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 truncate">{user?.user?.firstName} {user?.user?.lastName}</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 md:gap-6 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-2"><Mail className="w-3 h-3 md:w-4 md:h-4 shrink-0" /><span className="truncate">{user?.user?.email}</span></div>
                <div className="flex items-center gap-1 md:gap-2"><Phone className="w-3 h-3 md:w-4 md:h-4 shrink-0" /><span>{user?.user?.phone}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 md:mt-8">
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Total Amount Invested</p><p className="text-lg md:text-2xl font-bold">{formatCurrency(stats?.totalInvested || 0)}</p></div>
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Total Interest Earned</p><p className="text-lg md:text-2xl font-bold">{formatCurrency(stats?.totalInterestEarned || 0)}</p></div>
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Expected Monthly Repayment</p><p className="text-lg md:text-2xl font-bold">{formatCurrency(stats?.totalExpectedMonthlyRepayment || 0)}</p></div>
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Payout Upon Expiration</p><p className="text-lg md:text-2xl font-bold">{formatCurrency(stats?.totalPayoutUponExpiration || 0)}</p></div>
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Active Investments</p><p className="text-lg md:text-2xl font-bold">{(stats?.activeInvestments || 0).toLocaleString()}</p></div>
          <div><p className="text-cyan-100 text-xs md:text-sm mb-0.5 md:mb-1">Total Investments</p><p className="text-lg md:text-2xl font-bold">{stats?.totalInvestments || 0}</p></div>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Investments ({investments.length})</h3>
        </div>
        {investments.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ref #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Interest Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenure</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investments.map((inv) => (
                  <tr key={inv.id || inv._id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/investments/${inv.id || inv._id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-cyan-600">{inv.refNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 capitalize">{inv.projectData?.projectName || inv.project?.projectName || "Investment"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(inv.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inv.interestRatePerAnnum ?? inv.roi}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{inv.tenure || 0} Month(s)</p>
                      <p className="text-xs text-gray-500">{formatDate(inv.startDate)} - {formatDate(inv.endDate)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(inv.status)}>{inv.status?.charAt(0).toUpperCase() + inv.status?.slice(1)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-12">No investments found</p>}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
        </div>
        <div className="grid gap-3 md:gap-4 border-b border-gray-100 pb-4 md:pb-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total Payment Recorded</p>
            <p className="mt-1 md:mt-2 text-lg md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.totalPaymentAmountRecorded)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total Due</p>
            <p className="mt-1 md:mt-2 text-lg md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.totalDue)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 md:p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Balance Left</p>
            <p className="mt-1 md:mt-2 text-lg md:text-2xl font-semibold text-gray-900">{formatCurrency(paymentTotals.balanceLeft)}</p>
          </div>
        </div>
        <div className="mt-6">
          {paymentsLoading ? (
            <Skeleton.Table rows={3} />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id || payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.investmentRel?.refNumber || payment.investment?.refNumber || "--"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{formatDate(payment.paymentDate)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{formatDate(payment.dueDate)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getPaymentStatusColor(payment.status)}>{payment.status || "--"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-500 text-center py-12">No payment records found.</p>}
        </div>
      </Card>
    </div>
  );
}
