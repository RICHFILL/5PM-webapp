import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Clock, Search, ExternalLink, AlertCircle, Settings, User, FileText, MapPin, CreditCard, MessageCircle, Zap, Loader2 } from "lucide-react";
import { adminApi, adminKycSettingsApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Pagination } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "approved": return "success";
    case "under_review": return "warning";
    case "rejected": return "danger";
    default: return "default";
  }
};

const docLabel = (fieldname) => {
  const labels = { passport: "Passport Photo", governmentId: "Government ID", utilityBill: "Utility Bill", idDocument: "ID Document", selfie: "Selfie" };
  return labels[fieldname] || fieldname || "Document";
};

const parseDocField = (val) => {
  if (!val) return null;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return null; }
  }
  return val;
};

function DocumentLink({ doc, label }) {
  if (!doc?.url) return null;
  return (
    <a href={doc.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 text-sm text-neon-tangerine/80 hover:bg-neon-tangerine/10 transition-colors border border-gray-200">
      <ExternalLink size={14} />
      <span className="truncate">{label}</span>
    </a>
  );
}

export default function AdminKyc() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [verificationMode, setVerificationMode] = useState("manual");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [kycData, settingsData] = await Promise.allSettled([
        adminApi.getKycRequests({ page, limit: 20 }),
        adminKycSettingsApi.getMode(),
      ]);
      if (kycData.status === 'fulfilled') {
        const data = kycData.value;
        setRequests(Array.isArray(data) ? data : data?.data ?? data?.kyc ?? []);
        const pg = data?.pagination;
        if (pg) setPagination({ total: pg.total, pages: pg.pages });
      } else {
        setRequests([]);
        setError(kycData.reason?.response?.data?.message || kycData.reason?.message || "Failed to load KYC requests");
        toast.error("Failed to load KYC requests");
      }
      if (settingsData.status === 'fulfilled') {
        setVerificationMode(settingsData.value?.mode || "manual");
      }
    } catch (err) {
      setRequests([]);
      setError("An unexpected error occurred");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleReview = async (status) => {
    if (!selected) return;
    try {
      await adminApi.reviewKyc(selected.id || selected._id, status, status === "rejected" ? rejectionNote : "");
      setRequests((prev) => prev.map((r) => (r.id || r._id) === (selected.id || selected._id) ? { ...r, status } : r));
      setSelected(null);
      setRejectionNote("");
      setConfirmReject(false);
      toast.success(`KYC ${status}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update KYC");
    }
  };

  const handleAutoVerify = async () => {
    if (!selected) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const data = await adminApi.autoVerifyKyc(selected.id || selected._id);
      setVerifyResult(data.verification);
      if (data.verification?.verified === true) {
        setRequests((prev) => prev.map((r) => (r.id || r._id) === (selected.id || selected._id) ? { ...r, status: "approved" } : r));
        toast.success("KYC auto-verified and approved");
      } else {
        toast.error("Auto-verification did not pass");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Auto-verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (r.kycUser?.firstName || "").toLowerCase().includes(q)
      || (r.kycUser?.lastName || "").toLowerCase().includes(q)
      || (r.kycUser?.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">KYC Management ({requests.length})</h1>
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${verificationMode === 'automatic' ? 'bg-neon-tangerine/10 text-neon-tangerine border border-neon-tangerine/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
        <Settings size={16} />
        <span className="font-medium">{verificationMode === 'automatic' ? 'Auto-verification is enabled' : 'Manual review mode'}</span>
        <span className="text-xs ml-1 opacity-75">
          {verificationMode === 'automatic' ? 'Submissions are verified automatically on submit' : 'Submissions require admin approval'}
        </span>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
      </div>
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-6">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id || r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{r.kycUser?.firstName} {r.kycUser?.lastName}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{r.kycUser?.email}</td>
                <td className="px-6 py-4 text-gray-500">{r.kycUser?.phone || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(r.createdAt)}</td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant(r.status)}>{r.status || "pending"}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" onClick={() => setSelected({
                    ...r,
                    passportPhoto: parseDocField(r.passportPhoto),
                    idDocument: parseDocField(r.idDocument),
                    addressProof: parseDocField(r.addressProof),
                    selfie: parseDocField(r.selfie),
                  })}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No KYC requests found.</p>}
      </Card>
      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectionNote(""); setConfirmReject(false); setVerifying(false); setVerifyResult(null); }} title="Review KYC Request" size="lg">
        {selected && (
          <div className="space-y-5">
            {/* User Info */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><User size={14} /> User Information</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Name</span><span className="font-semibold">{selected.kycUser?.firstName} {selected.kycUser?.lastName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Email</span><span className="font-semibold">{selected.kycUser?.email}</span></div>
                {selected.kycUser?.phone && <div className="flex justify-between text-sm"><span className="text-gray-600">Phone</span><span className="font-semibold flex items-center gap-2">{selected.kycUser.phone}<a href={`https://wa.me/${selected.kycUser.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp"><MessageCircle size={14} className="text-[#25D366] hover:opacity-80" /></a></span></div>}
                <div className="flex justify-between text-sm"><span className="text-gray-600">Status</span><Badge variant={statusVariant(selected.status)}>{selected.status}</Badge></div>
              </div>
            </div>

            {/* Identity */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CreditCard size={14} /> Identity Information</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">BVN</span><span className="font-semibold font-mono">{selected.bvn ? `${selected.bvn}` : "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">NIN</span><span className="font-semibold font-mono">{selected.nin ? `${selected.nin}` : "--"}</span></div>
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><User size={14} /> Personal Details</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Date of Birth</span><span className="font-semibold">{selected.dateOfBirth || "--"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Gender</span><span className="font-semibold capitalize">{selected.gender || "--"}</span></div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={14} /> Uploaded Documents</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selected.passportPhoto?.url ? (
                  <DocumentLink doc={selected.passportPhoto} label={docLabel(selected.passportPhoto.fieldname)} />
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-400 border border-gray-200 flex items-center gap-2">
                    <span className="text-xs">Passport - Not uploaded</span>
                  </div>
                )}
                {selected.idDocument?.url ? (
                  <DocumentLink doc={selected.idDocument} label={selected.idDocument.idType ? `${selected.idDocument.idType} ID` : "ID Document"} />
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-400 border border-gray-200 flex items-center gap-2">
                    <span className="text-xs">ID Document - Not uploaded</span>
                  </div>
                )}
                {selected.addressProof?.url ? (
                  <DocumentLink doc={selected.addressProof} label={docLabel(selected.addressProof.fieldname)} />
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-400 border border-gray-200 flex items-center gap-2">
                    <span className="text-xs">Utility Bill - Not uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selfie */}
            {selected.selfie?.url && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selfie</p>
                <a href={selected.selfie.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-50 rounded-xl p-3 text-sm text-neon-tangerine/80 hover:bg-neon-tangerine/10 transition-colors border border-gray-200">
                  <ExternalLink size={14} />
                  View Selfie Photo
                </a>
              </div>
            )}

            {/* Admin Comment (if rejected) */}
            {selected.adminComment && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <span className="font-semibold">Rejection reason: </span>{selected.adminComment}
              </div>
            )}

            {/* Verification Result */}
            {verifyResult && (
              <div className={`rounded-xl p-4 text-sm ${verifyResult.verified === true ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {verifyResult.verified === true ? (
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${verifyResult.verified === true ? 'text-green-800' : 'text-red-800'}`}>
                      {verifyResult.verified === true ? 'Verification Passed' : 'Verification Failed'}
                    </p>
                    <p className={`mt-1 ${verifyResult.verified === true ? 'text-green-700' : 'text-red-700'}`}>
                      {verifyResult.details}
                    </p>
                    {verifyResult.checks && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(verifyResult.checks).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-2 text-xs">
                            {val === true || val?.passed ? (
                              <CheckCircle size={12} className="text-green-500" />
                            ) : val === false || val?.passed === false ? (
                              <XCircle size={12} className="text-red-500" />
                            ) : (
                              <Clock size={12} className="text-gray-400" />
                            )}
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-mono">
                              {typeof val === 'object' ? (val.passed ? 'Passed' : val.reason || 'Failed') : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {selected.status !== "approved" && !verifyResult?.verified === true && (
              <>
                {verifying ? (
                  <div className="flex items-center justify-center gap-2 pt-2 py-4">
                    <Loader2 size={20} className="animate-spin text-neon-tangerine" />
                    <span className="text-sm text-gray-600">Running auto-verification...</span>
                  </div>
                ) : confirmReject ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (required)</label>
                      <textarea value={rejectionNote} onChange={(e) => setRejectionNote(e.target.value)} rows={3} placeholder="Explain why this KYC is being rejected..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setConfirmReject(false)}>Back</Button>
                      <Button variant="danger" className="flex-1" onClick={() => handleReview("rejected")} disabled={!rejectionNote.trim()}>
                        <XCircle size={16} /> Confirm Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={handleAutoVerify} disabled={verifying}>
                      <Zap size={16} /> Auto Verify
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={() => setConfirmReject(true)}>
                      <XCircle size={16} /> Reject
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => handleReview("under_review")}>
                      <Clock size={16} /> Mark Review
                    </Button>
                    <Button className="flex-1" onClick={() => handleReview("approved")}>
                      <CheckCircle size={16} /> Approve
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
