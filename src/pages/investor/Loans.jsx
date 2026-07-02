import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Plus, CheckCircle2, AlertCircle } from "lucide-react";
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
    setSaving(true);
    try {
      await loanApi.applyLoan({
        amount: parseFloat(form.amount),
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-dark-lavender rounded-2xl p-4 md:p-8 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Asset-Backed Loans</h1>
          <p className="text-green-200">Access credit backed by your investment portfolio</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="secondary" size="sm"><Plus size={16} /> Apply for Loan</Button>
      </div>

      {loans.length > 0 ? (
        <div className="space-y-4">
          {loans.map((loan) => {
            const progress = loan.amount > 0 ? (loan.repaidAmount / loan.amount) * 100 : 0;
            return (
              <Card key={loan.id} className="hover:shadow-md transition-shadow" clickable onClick={() => navigate(`/loans/${loan.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Banknote size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatNaira(loan.amount)}</p>
                      <p className="text-sm text-gray-500">{loan.term} months at {loan.interestRate}% p.a.</p>
                      {loan.purpose && <p className="text-xs text-gray-500 mt-1">{loan.purpose}</p>}
                    </div>
                  </div>
                  <Badge variant={statusVariant(loan.status)}>{loan.status}</Badge>
                </div>
                {loan.status === "active" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Repaid: {formatNaira(loan.repaidAmount)}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No loan applications yet.</p></Card>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); }} title="Apply for Loan" size="md">
        <div className="space-y-4">
          <Input label="Loan Amount (Ã¢â€šÂ¦)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 500000" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Term (months)" type="number" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="e.g. 12" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                {form.interestRate}% p.a.
              </div>
              <p className="text-xs text-gray-500 mt-1">Interest rates are determined by the selected loan product and cannot be modified.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none" placeholder="What is the loan for?" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); }}>Cancel</Button>
            <Button onClick={handleApply} disabled={saving || !form.amount}>Apply</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
