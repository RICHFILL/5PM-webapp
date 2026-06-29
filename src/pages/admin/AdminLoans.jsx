import { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
import { adminLoanApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (s) => {
  switch (s) {
    case "active": return "success";
    case "pending": return "warning";
    case "repaid": return "info";
    case "defaulted": return "danger";
    default: return "default";
  }
};

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoan, setActionLoan] = useState(null);
  const [actionType, setActionType] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminLoanApi.getAllLoans({ status: statusFilter });
      setLoans(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setLoans([]);
      setError("Failed to load loans");
      toast.error("Failed to load loans");
    } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [statusFilter]);

  const handleApprove = async (id, status) => {
    setSaving(true);
    try {
      await adminLoanApi.approveLoan(id, status);
      setActionLoan(null);
      toast.success(`Loan ${status}`);
      fetch();
    } catch {
      toast.error("Failed to update loan");
    } finally { setSaving(false); }
  };

  const handleRepay = async (id) => {
    if (!repayAmount) return;
    setSaving(true);
    try {
      await adminLoanApi.recordRepayment(id, { amount: parseFloat(repayAmount) });
      setActionLoan(null);
      setRepayAmount("");
      toast.success("Repayment recorded");
      fetch();
    } catch {
      toast.error("Failed to record repayment");
    } finally { setSaving(false); }
  };

  const filtered = loans.filter((l) =>
    (l.borrower?.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.borrower?.lastName || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Loan Management ({loans.length})</h1>
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search borrower..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 outline-none text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "pending", "active", "repaid", "defaulted"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <div className="overflow-x-auto -mx-6">
        <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Borrower</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Term</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Repaid</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{l.borrower?.firstName} {l.borrower?.lastName}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(l.amount)}</td>
                <td className="px-6 py-4 text-gray-600">{l.term}mo</td>
                <td className="px-6 py-4 text-gray-600">{l.interestRate}%</td>
                <td className="px-6 py-4 text-gray-600">{formatNaira(l.repaidAmount)}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant(l.status)}>{l.status}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {l.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => { setActionLoan(l); setActionType("approve"); }}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(l.id, "defaulted")}>Reject</Button>
                      </>
                    )}
                    {l.status === "active" && (
                      <Button size="sm" onClick={() => { setActionLoan(l); setActionType("repay"); setRepayAmount(""); }}>Record Repayment</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No loans found.</p>}
      </Card>
      </div>

      {actionLoan && (
        <Modal isOpen={true} onClose={() => setActionLoan(null)}
          title={actionType === "approve" ? "Approve Loan" : "Record Repayment"} size="sm">
          {actionType === "approve" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Approve loan of {formatNaira(actionLoan.amount)} for {actionLoan.borrower?.firstName}?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setActionLoan(null)}>Cancel</Button>
                <Button onClick={() => handleApprove(actionLoan.id, "active")} disabled={saving}>Approve & Generate Schedule</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Repayment Amount (₦)" type="number" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} placeholder="Enter amount" />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setActionLoan(null)}>Cancel</Button>
                <Button onClick={() => handleRepay(actionLoan.id)} disabled={saving || !repayAmount}>Record</Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
