import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ArrowDownLeft, Filter, CheckCircle2, Copy, History } from "lucide-react";
import { dashboardApi, userApi, walletApi, depositApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import useWalletStore from "../../store/walletStore";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import { getGreeting } from "../../utils/greetings";

const CURRENCIES = [
  { value: "NGN", label: "NGN", symbol: "₦", format: (v) => "₦" + Math.abs(v || 0).toLocaleString("en-NG") },
  { value: "USD", label: "USD", symbol: "$", format: (v) => "$" + Math.abs(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2 }) },
  { value: "USDT", label: "USDT", symbol: "USDT", format: (v) => "USDT " + Math.abs(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2 }) },
];

const CURRENCY_STYLE = {
  NGN: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  USD: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  USDT: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Deposits", value: "funding" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Investments", value: "investment" },
  { label: "Returns", value: "return" },
];

const DEPOSIT_ADDRESSES = {
  NGN: { bank: "FCMB", account: "1003799718", name: "5PM NEXUS INVEST LIMITED" },
  USD: { bank: "5pm Nexus", account: "2000914506", name: "5PM NEXUS INVEST LIMITED" },
  USDT: { network: "TRC20", address: "TBz5yvdhA5isuWQKUAQqsEy4vNpBP5U85S" },
};

function DepositModal({ isOpen, onClose, onDepositComplete }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const cur = CURRENCIES.find((c) => c.value === currency);
  const addr = DEPOSIT_ADDRESSES[currency];

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await depositApi.createDeposit(Number(amount), currency, reference);
      setStep("confirmation");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Deposit failed");
    } finally { setLoading(false); }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const reset = () => { onClose(); setStep("form"); setAmount(""); setCurrency("NGN"); setReference(""); setError(""); };

  return (
    <Modal isOpen={isOpen} onClose={reset} title={step === "form" ? "Fund Wallet" : "Deposit Request Submitted"} size="md">
      {step === "form" ? (
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none">
              {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <Input label={`Amount (${currency})`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100000" required min="1000" />

          {currency === "NGN" && (
            <div className="bg-neon-tangerine/10 border border-neon-tangerine/30 rounded-xl p-4 text-sm text-neon-tangerine space-y-2">
              <p className="font-semibold mb-1">Bank Transfer Details</p>
              <div className="flex items-center justify-between">
                <span>Bank: {addr.bank}</span>
                <button type="button" onClick={() => copyToClipboard(addr.bank, "bank")}
                  className="text-neon-tangerine/80 hover:text-neon-tangerine p-1">{copied === "bank" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Account: {addr.account}</span>
                <button type="button" onClick={() => copyToClipboard(addr.account, "account")}
                  className="text-neon-tangerine/80 hover:text-neon-tangerine p-1">{copied === "account" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Name: {addr.name}</span>
                <button type="button" onClick={() => copyToClipboard(addr.name, "name")}
                  className="text-neon-tangerine/80 hover:text-neon-tangerine p-1">{copied === "name" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
            </div>
          )}

          {currency === "USD" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-2">
              <p className="font-semibold mb-1">USD Account Details</p>
              <div className="flex items-center justify-between">
                <span>Account Name: {addr.name}</span>
                <button type="button" onClick={() => copyToClipboard(addr.name, "name")}
                  className="text-blue-600 hover:text-blue-800 p-1">{copied === "name" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Number: {addr.account}</span>
                <button type="button" onClick={() => copyToClipboard(addr.account, "account")}
                  className="text-blue-600 hover:text-blue-800 p-1">{copied === "account" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Bank: {addr.bank}</span>
                <button type="button" onClick={() => copyToClipboard(addr.bank, "bank")}
                  className="text-blue-600 hover:text-blue-800 p-1">{copied === "bank" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
            </div>
          )}

          {currency === "USDT" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 space-y-2">
              <p className="font-semibold mb-1">USDT Wallet (TRC20)</p>
              <div className="flex items-center justify-between break-all">
                <span className="font-mono text-xs">{addr.address}</span>
                <button type="button" onClick={() => copyToClipboard(addr.address, "usdt")}
                  className="text-emerald-600 hover:text-emerald-800 p-1 shrink-0">{copied === "usdt" ? <CheckCircle2 size={14} /> : <Copy size={14} />}</button>
              </div>
              <p className="text-xs text-emerald-600 mt-1">Send only USDT on TRC20 network to this address.</p>
            </div>
          )}

          <Input label="Transaction Reference (Optional)" value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter payment reference or transaction ID" />

          <p className="text-xs text-gray-500">After making the transfer, submit this request. Your wallet will be credited once the payment is confirmed by admin.</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !amount}>
            {loading ? "Submitting..." : `Submit Deposit Request`}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Deposit Request Submitted</h3>
          <p className="text-sm text-gray-600">
            Your request to deposit {cur?.format(Number(amount))} has been submitted.
            Please send the funds using the details shown above and include your reference.
            Your wallet will be credited once the payment is confirmed by admin.
          </p>
          <Button onClick={() => { reset(); onDepositComplete?.(); }} variant="secondary">Done</Button>
        </div>
      )}
    </Modal>
  );
}

function WithdrawalModal({ isOpen, onClose, balances, onWithdrawComplete }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cur = CURRENCIES.find((c) => c.value === currency);
  const maxBalance = currency === "USD" ? balances.usd : currency === "USDT" ? balances.usdt : balances.ngn;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await walletApi.withdrawFunds(Number(amount), { bankName, accountNumber, accountName, walletAddress }, currency);
      setStep("confirmation");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Withdrawal failed");
    } finally { setLoading(false); }
  };

  const reset = () => { onClose(); setStep("form"); setAmount(""); setCurrency("NGN"); setError(""); };

  return (
    <Modal isOpen={isOpen} onClose={reset} title="Withdraw Funds" size="md">
      {step === "form" ? (
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-tangerine focus:border-transparent outline-none">
              {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <Input label={`Amount (${currency})`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount" required min="1000" max={maxBalance} />
          {currency !== "USDT" ? (
            <>
              <Input label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., GTBank" required />
              <Input label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="0123456789" required maxLength={10} />
              <Input label="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Enter account name" required />
            </>
          ) : (
            <Input label="USDT Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Enter USDT wallet address" required />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !amount}>
            {loading ? "Processing..." : "Withdraw"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Withdrawal Request Submitted</h3>
          <p className="text-sm text-gray-600">{cur?.format(Number(amount))} will be sent to your account once approved.</p>
          <Button onClick={() => { reset(); onWithdrawComplete?.(); }} variant="secondary">Done</Button>
        </div>
      )}
    </Modal>
  );
}

const walletGradients = {
  NGN: "bg-neon-tangerine",
  USD: "bg-dark-lavender",
  USDT: "bg-dark-lavender",
};

const walletAccent = {
  NGN: "text-cyan-100",
  USD: "text-blue-200",
  USDT: "text-emerald-100",
};

function WalletCard({ currency, balance, onDeposit, onWithdraw }) {
  const cur = CURRENCIES.find((c) => c.value === currency);
  return (
    <div className={`rounded-2xl overflow-hidden ${walletGradients[currency]} text-white shadow-lg`}>
      <div className="p-4 md:p-6">
        <p className={`text-xs md:text-sm uppercase tracking-[0.18em] ${walletAccent[currency]} mb-1`}>{currency} Wallet</p>
        <p className="text-2xl md:text-4xl font-bold break-all">{cur?.format(balance)}</p>
        <p className={`text-xs md:text-sm ${walletAccent[currency]} mt-2`}>Available balance</p>
      </div>
      <div className="flex border-t border-white/20">
        <button onClick={onDeposit}
          className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white hover:bg-white/10 transition-colors">
          <ArrowDownLeft size={14} /> Deposit
        </button>
        <button onClick={onWithdraw}
          className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white hover:bg-white/10 transition-colors border-l border-white/20">
          <ArrowUpRight size={14} /> Withdraw
        </button>
      </div>
    </div>
  );
}

export default function Wallet() {
  const { user } = useAuthStore();
  const { ngnBalance, usdBalance, usdtBalance, setBalances } = useWalletStore();
  const [stats, setStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState({ totalPaymentAmountRecorded: 0, totalDue: 0, balanceLeft: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState("NGN");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState("NGN");
  const [transactions, setTransactions] = useState([]);
  const [txnLoading, setTxnLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setTxnLoading(true);
    try {
      const res = await walletApi.getTransactionHistory(50, 0);
      setTransactions(Array.isArray(res) ? res : res?.transactions ?? []);
    } catch { setTransactions([]); }
    finally { setTxnLoading(false); }
  }, []);

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
    } catch {
      setPayments([]);
    } finally { setPaymentsLoading(false); }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [dashboardData, balanceData] = await Promise.all([
        dashboardApi.getDashboardData().catch(() => ({})),
        walletApi.getBalance().catch(() => null),
      ]);
      setStats(dashboardData || {});
      if (balanceData) {
        setBalances(parseFloat(balanceData.balance) || 0, balanceData.usdBalance || 0, balanceData.usdtBalance || 0);
      } else {
        setBalances(dashboardData?.walletBalance || dashboardData?.totalInvested || 0, 0, 0);
      }
      await Promise.all([
        fetchUserPayments(user?.id || user?._id),
        fetchTransactions(),
      ]);
    } catch {
    } finally { setLoading(false); }
  }, [user, setBalances, fetchUserPayments, fetchTransactions]);

  useEffect(() => {
    if (user) fetchData();
  }, [user?.id, user?._id, fetchData]);

  const filteredTransactions = activeFilter === "all"
    ? transactions
    : transactions.filter((t) => t.type === activeFilter);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  const balances = { ngn: ngnBalance, usd: usdBalance, usdt: usdtBalance };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getGreeting()}, {user?.firstName}</h1>
        <p className="text-gray-600">Manage your wallet and transactions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <WalletCard currency="NGN" balance={ngnBalance}
          onDeposit={() => { setDepositCurrency("NGN"); setShowDeposit(true); }}
          onWithdraw={() => { setWithdrawCurrency("NGN"); setShowWithdraw(true); }} />
        <WalletCard currency="USD" balance={usdBalance}
          onDeposit={() => { setDepositCurrency("USD"); setShowDeposit(true); }}
          onWithdraw={() => { setWithdrawCurrency("USD"); setShowWithdraw(true); }} />
        <WalletCard currency="USDT" balance={usdtBalance}
          onDeposit={() => { setDepositCurrency("USDT"); setShowDeposit(true); }}
          onWithdraw={() => { setWithdrawCurrency("USDT"); setShowWithdraw(true); }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total Invested</p>
          <p className="text-base md:text-xl font-bold text-gray-900 mt-1">{CURRENCIES[0].format(stats?.totalInvested)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total Interest</p>
          <p className="text-base md:text-xl font-bold text-gray-900 mt-1">{CURRENCIES[0].format(stats?.totalInterestEarned)}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <p className="text-xs uppercase tracking-wide text-gray-500">Payment Recorded</p>
          <p className="text-base md:text-xl font-bold text-gray-900 mt-1">{CURRENCIES[0].format(paymentTotals.totalPaymentAmountRecorded)}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={16} className="text-gray-400 shrink-0" />
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button key={f.value} onClick={() => setActiveFilter(f.value)}
                  className={`px-2.5 md:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeFilter === f.value ? "bg-neon-tangerine text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {txnLoading ? (
          <Skeleton.Table rows={5} />
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-3 font-semibold uppercase tracking-[0.15em] px-6">Date</th>
                  <th className="text-left pb-3 font-semibold uppercase tracking-[0.15em] px-6">Description</th>
                  <th className="text-center pb-3 font-semibold uppercase tracking-[0.15em] px-3">Currency</th>
                  <th className="text-right pb-3 font-semibold uppercase tracking-[0.15em] px-6">Amount</th>
                  <th className="text-right pb-3 font-semibold uppercase tracking-[0.15em] px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, i) => {
                  const isDebit = txn.type === "withdrawal";
                  const currency = (txn.currency || "NGN").toUpperCase();
                  const cur = CURRENCIES.find((c) => c.value === currency) || CURRENCIES[0];
                  const style = CURRENCY_STYLE[currency] || CURRENCY_STYLE.NGN;
                  const status = (txn.status || "").toLowerCase();
                  return (
                    <tr key={txn.id || i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 text-gray-500 whitespace-nowrap px-6 text-xs">
                        <span title={formatDate(txn.date || txn.createdAt)}>
                          {formatTimeAgo(txn.date || txn.createdAt)}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isDebit ? "bg-red-50" : "bg-green-50"
                          }`}>
                            {isDebit ? (
                              <ArrowUpRight size={15} className="text-red-500" />
                            ) : (
                              <ArrowDownLeft size={15} className="text-green-500" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-800 capitalize">
                              {(txn.description || txn.type || "Transaction").replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${style.badge}`}>
                          {currency}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right font-semibold whitespace-nowrap px-6 text-sm ${isDebit ? "text-red-600" : "text-gray-900"}`}>
                        {isDebit ? "-" : "+"}{cur.format(txn.amount)}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap px-6">
                        <Badge variant={status === "completed" || status === "success" ? "success" : status === "pending" || status === "processing" ? "warning" : status === "failed" || status === "rejected" ? "danger" : "default"}>
                          {txn.status || "Unknown"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <History size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No transactions found</p>
            <p className="text-gray-300 text-xs mt-1">Deposit funds to get started</p>
          </div>
        )}
      </Card>

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onDepositComplete={fetchData} />
      <WithdrawalModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)}
        balances={balances} onWithdrawComplete={fetchData} />
    </div>
  );
}


