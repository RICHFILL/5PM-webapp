import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Plus, CheckCircle2, AlertCircle, Clock, ArrowRight, Percent, Calendar } from "lucide-react";
import { loanApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import { formatNaira } from '../../utils/format';

const statusVariant = (s) => {
  switch (s) {
    case "active": return "success";
    case "pending": return "warning";
    case "repaid": return "info";
    case "defaulted": return "danger";
    default: return "default";
  }
};

const statusIcon = (s) => {
  switch (s) {
    case "active": return CheckCircle2;
    case "pending": return Clock;
    case "repaid": return CheckCircle2;
    case "defaulted": return AlertCircle;
    default: return AlertCircle;
  }
};

const defaultForm = { amount: "", purpose: "", term: "12", interestRate: "3.5" };

export default function Loans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await loanApi.getMyLoans();
      setLoans(Array.isArray(res) ? res : res?.data ?? []);
    } catch { setLoans([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleApply = async () => {
    if (!form.amount || !form.term) return;
    const amount = parseFloat(form.amount);
    if (amount < 5000) { toast.error("Minimum loan amount is ₦5,000"); return; }
    if (amount > 10000000) { toast.error("Maximum loan amount is ₦10,000,000"); return; }
    setSaving(true);
    try {
      await loanApi.applyLoan({
        amount,
        term: parseInt(form.term),
        interestRate: parseFloat(form.interestRate),
        purpose: form.purpose,
      });
      setShowModal(false);
      setForm(defaultForm);
      fetch();
    } catch { /* silent */ } finally { setSaving(false); }
  };

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={4} /></div>;
  }

  const activeLoans = loans.filter((l) => l.status === "active").length;
  const totalBorrowed = loans.reduce((s, l) => s + (l.amount || 0), 0);
  const totalRepaid = loans.reduce((s, l) => s + (l.repaidAmount || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-dark-lavender via-dark-lavender to-purple-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">5PM Nexus Loans</h1>
            <p className="text-purple-200 mt-1 text-sm md:text-base max-w-lg">
              Access credit backed by your investment portfolio. Competitive rates, flexible terms.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="shrink-0 bg-white text-dark-lavender hover:bg-gray-100 shadow-lg">
            <Plus size={16} /> Apply for Loan
          </Button>
        </div>
        {loans.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-purple-200 text-xs uppercase tracking-wider">Active Loans</p>
              <p className="text-xl font-bold mt-0.5">{activeLoans}</p>
            </div>
            <div>
              <p className="text-purple-200 text-xs uppercase tracking-wider">Total Borrowed</p>
              <p className="text-xl font-bold mt-0.5">{formatNaira(totalBorrowed)}</p>
            </div>
            <div>
              <p className="text-purple-200 text-xs uppercase tracking-wider">Total Repaid</p>
              <p className="text-xl font-bold mt-0.5 text-green-300">{formatNaira(totalRepaid)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loan List */}
      {loans.length > 0 ? (
        <div className="space-y-3">
          {loans.map((loan) => {
            const progress = loan.amount > 0 ? (loan.repaidAmount / loan.amount) * 100 : 0;
            const StatusIcon = statusIcon(loan.status);
            return (
              <Card key={loan.id} className="hover:shadow-lg transition-all cursor-pointer border border-gray-100" clickable onClick={() => navigate(`/loans/${loan.id}`)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      loan.status === "active" ? "bg-green-100" :
                      loan.status === "repaid" ? "bg-blue-100" :
                      loan.status === "defaulted" ? "bg-red-100" : "bg-amber-100"
                    }`}>
                      <Banknote className={
                        loan.status === "active" ? "text-green-600" :
                        loan.status === "repaid" ? "text-blue-600" :
                        loan.status === "defaulted" ? "text-red-600" : "text-amber-600"
                      } size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-gray-900">{formatNaira(loan.amount)}</p>
                        <Badge variant={statusVariant(loan.status)} size="sm">{loan.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {loan.term} months</span>
                        <span className="flex items-center gap-1"><Percent size={12} /> {loan.interestRate}% monthly</span>
                      </div>
                      {loan.purpose && <p className="text-xs text-gray-400 mt-0.5">{loan.purpose}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {loan.status === "active" && (
                      <div className="w-28">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{progress.toFixed(0)}% repaid</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                      </div>
                    )}
                    <ArrowRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <Banknote size={28} className="text-purple-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No loan applications yet</p>
            <p className="text-gray-300 text-xs mt-1 max-w-xs text-center">
              Apply for a loan backed by your investment portfolio at competitive rates.
            </p>
            <Button onClick={() => setShowModal(true)} className="mt-5">
              <Plus size={16} /> Apply for a Loan
            </Button>
          </div>
        </Card>
      )}

      {/* Apply Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); }} title="Apply for Loan" size="md">
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>Loan applications are subject to review and approval based on your investment portfolio and KYC status.</span>
          </div>
          <Input label="Loan Amount (₦)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 500000" helperText="Min: ₦5,000 | Max: ₦10,000,000" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Term (months)" type="number" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="e.g. 12" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
              <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm flex items-center gap-2">
                <Percent size={14} className="text-gray-400" />
                <span>{form.interestRate}% monthly</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Interest rates are determined by the loan product and cannot be modified.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none"
              placeholder="What is the loan for?" />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); }}>Cancel</Button>
            <Button onClick={handleApply} disabled={saving || !form.amount}>
              {saving ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
