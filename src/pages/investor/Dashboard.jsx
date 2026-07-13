import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, Globe, Wallet, ChevronRight, CheckCircle2, BarChart3, Activity } from "lucide-react";
import { dashboardApi, userApi, investmentApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton } from "../../components/common";
import WithdrawalRequestModal from "../../components/WithdrawalRequestModal";
import { PortfolioGrowthChart, InvestmentPerformanceChart, ReturnHistoryChart } from "../../components/charts";
import { getGreeting } from "../../utils/greetings";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({ totalPaymentAmountRecorded: 0, totalDue: 0, balanceLeft: 0 });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  const [withdrawalConfirmation, setWithdrawalConfirmation] = useState("");

  const fetchUserPayments = useCallback(async (userId) => {
    if (!userId) { setPayments([]); setPaymentsLoading(false); return; }
    try {
      setPaymentsLoading(true);
      const paymentsData = await userApi.getUserPayments(userId);
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData?.data ?? []);
      setPaymentTotals({
        totalPaymentAmountRecorded: paymentsData?.totals?.totalPaymentAmountRecorded ?? 0,
        totalDue: paymentsData?.totals?.totalDue ?? 0,
        balanceLeft: paymentsData?.totals?.balanceLeft ?? 0,
      });
    } catch (err) {
      setPayments([]);
    } finally { setPaymentsLoading(false); }
  }, [user?.id, user?._id]);

  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboard, invData] = await Promise.all([
          dashboardApi.getDashboardData(),
          investmentApi.getMyInvestments(),
        ]);
        setDashboardData(dashboard);
        setInvestments(Array.isArray(invData) ? invData : invData?.data ?? []);
        await fetchUserPayments(user?.id || user?._id);
      } catch (err) {
        setError(err.message);
        if (err.message?.includes("401")) navigate("/login");
      } finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user?.id, user?._id, fetchUserPayments]);

  const portfolioGrowthData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map((month, i) => ({
      month,
      value: investments.reduce((sum, inv) => {
        const start = inv.startDate ? new Date(inv.startDate).getMonth() : 0;
        return sum + (i >= start ? Number(inv.amount || 0) : 0);
      }, 0),
    }));
  }, [investments]);

  const performanceData = useMemo(() => {
    return investments.map((inv) => ({
      name: inv.project?.projectName || inv.refNumber || "Investment",
      invested: Number(inv.amount || 0),
      returns: Number(inv.interestEarned || 0),
    }));
  }, [investments]);

  const returnHistoryData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const currentMonth = new Date().getMonth();
    return months.map((month, i) => ({
      month,
      return: i <= currentMonth ? investments.reduce((sum, inv) => sum + Number(inv.interestEarned || 0) * ((i + 1) / 12), 0) : 0,
    }));
  }, [investments]);

  const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount || 0);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

  const getPaymentStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified": return "bg-emerald-100 text-emerald-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "failed": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const totalInvested = dashboardData?.totalInvested ?? 0;
  const walletBalance = dashboardData?.walletBalance ?? 0;
  const totalInterestEarned = dashboardData?.totalInterestEarned ?? 0;

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton.Card />
          <Skeleton.Card />
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6"><div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">{error}</div></div>;
  }

  const handleWithdrawalRequest = async () => {
    try {
      setError(""); setIsSubmittingWithdrawal(true);
      const { walletApi } = await import("../../services/api");
      const response = await walletApi.requestWithdrawal();
      setShowWithdrawModal(false);
      setWithdrawalConfirmation(response.message || "Withdrawal request sent successfully");
    } catch (err) {
      setError(err.message);
    } finally { setIsSubmittingWithdrawal(false); }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">{getGreeting()}, {user?.firstName+" "+user?.lastName}</h3>
        <p className="text-gray-600 text-sm md:text-base">Complete your KYC to access your investment features</p>
        {/* <p className="text-gray-600 text-sm md:text-base">Welcome back to your investment dashboard</p> */}
      </div>

      <div className="bg-dark-lavender rounded-2xl text-white px-4 py-6 md:px-7 md:py-8 mb-6 md:mb-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <p className="text-white/70 text-sm md:text-base font-medium tracking-wide">Total NGN Wallet Balance</p>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{formatCurrency(walletBalance)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mt-1 md:mt-3">
            <div className="bg-white/10 rounded-lg px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <p className="text-white/60 text-xs md:text-sm font-medium mb-1">Total Interest Earned</p>
              <p className="text-sm md:text-base font-bold">{formatCurrency(totalInterestEarned)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <p className="text-white/60 text-xs md:text-sm font-medium mb-1">Total Amount Invested</p>
              <p className="text-sm md:text-base font-bold">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <p className="text-white/60 text-xs md:text-sm font-medium mb-1">Total Repayment Recorded</p>
              <p className="text-sm md:text-base font-bold">{formatCurrency(paymentTotals.totalPaymentAmountRecorded)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <p className="text-white/60 text-xs md:text-sm font-medium mb-1">Total Due</p>
              <p className="text-sm md:text-base font-bold">{formatCurrency(totalInvested || 0)}</p>
            </div>
            {/* <div className="bg-white/10 rounded-lg px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-sm">
              <p className="text-white/60 text-xs md:text-sm font-medium mb-1">Balance Left</p>
              <p className="text-sm md:text-base font-bold">{formatCurrency(paymentTotals.balanceLeft)}</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Link to="/properties" className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all group border border-gray-100 shadow-sm flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors shrink-0">
            <Globe className="text-blue-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Find Opportunities</h3>
          <p className="text-sm text-gray-600">Discover new investments</p>
        </Link>
        <Link to="/wallet" className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all group border border-gray-100 shadow-sm flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors shrink-0">
            <Wallet className="text-green-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Fund Wallet</h3>
          <p className="text-sm text-gray-600">Add funds to your wallet</p>
        </Link>
        <Link to="/wallet" className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all group border border-gray-100 shadow-sm flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors shrink-0">
            <TrendingUp className="text-gray-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Payment History</h3>
          <p className="text-sm text-gray-600">View your wallet activity</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <Card.Title>Investment Breakdown</Card.Title>
          {dashboardData?.investmentBreakdown?.length > 0 ? (
            <div className="space-y-4 mt-4">
              {dashboardData.investmentBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ["#00D4F5","#0F2060","#7C3AED","#F59E0B","#10B981"][idx % 5] }} />
                    <span className="text-sm text-gray-700">{item?.project?.projectName}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-600 mt-4">No investments yet</p>}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <Card.Title>Recent Payments</Card.Title>
            <Link to="/wallet" className="text-neon-tangerine hover:text-neon-tangerine/80 text-sm font-medium flex items-center gap-1">
              View Wallet <ChevronRight size={16} />
            </Link>
          </div>
          {paymentsLoading ? (
            <Skeleton.Table rows={3} />
          ) : payments.length > 0 ? (
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment, idx) => (
                <div key={payment.id || payment._id || idx} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.investment?.refNumber || payment.investment?.project?.projectName || "Payment"}</p>
                    <p className="text-xs text-gray-600">{payment.investment?.project?.projectName || "Investment payment"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>{payment.status || "Unknown"}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-600">No payment records yet</p>}
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-6 mt-4 md:mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <BarChart3 className="text-neon-tangerine shrink-0" size={20} />
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Portfolio Analytics</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-neon-tangerine" size={20} />
              <Card.Title>Portfolio Growth</Card.Title>
            </div>
            <PortfolioGrowthChart data={portfolioGrowthData} />
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-neon-tangerine" size={20} />
              <Card.Title>Return History</Card.Title>
            </div>
            <ReturnHistoryChart data={returnHistoryData} />
          </Card>
        </div>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-neon-tangerine" size={20} />
            <Card.Title>Investment Performance</Card.Title>
          </div>
          <InvestmentPerformanceChart data={performanceData} />
        </Card>
      </div>

      {withdrawalConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
            <div className="bg-dark-lavender px-6 pb-14 pt-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/30">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Successful</p>
                  <p className="mt-1 text-xl font-semibold">Withdrawal request sent</p>
                </div>
              </div>
            </div>
            <div className="-mt-8 rounded-t-[24px] bg-white px-6 pb-6 pt-5">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-sm leading-6 text-slate-600">{withdrawalConfirmation}</p>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="text-sm leading-6 text-slate-600">Your request is now pending review. You will be notified once it has been processed.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setWithdrawalConfirmation("")} className="rounded-xl bg-dark-lavender px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-lavender/80">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <WithdrawalRequestModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdrawalRequest}
        expectedReturns={totalInterestEarned}
        formatCurrency={formatCurrency}
        isSubmitting={isSubmittingWithdrawal}
        error={error}
      />
    </div>
  );
}

export default Dashboard;

