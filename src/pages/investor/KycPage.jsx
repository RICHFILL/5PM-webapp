import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Upload, Camera, ChevronLeft, ChevronRight, Shield, CheckCircle2, Clock, XCircle, AlertCircle, User, MapPin, CreditCard, FileText } from "lucide-react";
import { Button, Input, Card, Badge, Skeleton } from "../../components/common";
import { kycApi } from "../../services/api";
import useKycStore from "../../store/kycStore";
import { KYC_STEPS, KYC_STATUS } from "../../constants";
import toast from "react-hot-toast";

const stepLabels = KYC_STEPS.map((s) => s.label);

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 overflow-x-auto">
      {stepLabels.map((label, i) => (
        <div key={label} className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i === currentStep ? "bg-neon-tangerine text-white shadow-sm" :
            i < currentStep ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {i < currentStep ? <Check size={12} /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < stepLabels.length - 1 && <div className={`w-3 sm:w-4 h-0.5 ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function Step1PersonalInfo({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!data.firstName.trim()) errs.firstName = "First name is required";
    if (!data.lastName.trim()) errs.lastName = "Last name is required";
    if (!data.dob) errs.dob = "Date of birth is required";
    if (!data.gender) errs.gender = "Please select a gender";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <User size={18} className="text-neon-tangerine" />
        <span className="text-sm font-semibold">Personal Information</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" value={data.firstName} onChange={(e) => { onChange({ ...data, firstName: e.target.value }); setErrors((p) => ({ ...p, firstName: "" })); }} error={errors.firstName} required />
        <Input label="Last Name" value={data.lastName} onChange={(e) => { onChange({ ...data, lastName: e.target.value }); setErrors((p) => ({ ...p, lastName: "" })); }} error={errors.lastName} required />
      </div>
      <Input label="Date of Birth" type="date" value={data.dob} onChange={(e) => { onChange({ ...data, dob: e.target.value }); setErrors((p) => ({ ...p, dob: "" })); }} error={errors.dob} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female"].map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer px-4 py-2.5 border border-gray-300 rounded-xl has-[:checked]:border-neon-tangerine has-[:checked]:bg-neon-tangerine/5 transition-colors">
              <input type="radio" name="gender" value={g.toLowerCase()} checked={data.gender === g.toLowerCase()} onChange={(e) => { onChange({ ...data, gender: e.target.value }); setErrors((p) => ({ ...p, gender: "" })); }}
                className="text-neon-tangerine focus:ring-neon-tangerine" />
              <span className="text-sm text-gray-700">{g}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button type="submit">Continue <ChevronRight size={16} /></Button>
      </div>
    </form>
  );
}

function Step2Address({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!data.country.trim()) errs.country = "Country is required";
    if (!data.state.trim()) errs.state = "State is required";
    if (!data.city.trim()) errs.city = "City is required";
    if (!data.address.trim()) errs.address = "Address is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <MapPin size={18} className="text-neon-tangerine" />
        <span className="text-sm font-semibold">Address Information</span>
      </div>
      <Input label="Country" value={data.country} onChange={(e) => { onChange({ ...data, country: e.target.value }); setErrors((p) => ({ ...p, country: "" })); }} error={errors.country} placeholder="Nigeria" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="State" value={data.state} onChange={(e) => { onChange({ ...data, state: e.target.value }); setErrors((p) => ({ ...p, state: "" })); }} error={errors.state} required />
        <Input label="City" value={data.city} onChange={(e) => { onChange({ ...data, city: e.target.value }); setErrors((p) => ({ ...p, city: "" })); }} error={errors.city} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
        <textarea value={data.address} onChange={(e) => { onChange({ ...data, address: e.target.value }); setErrors((p) => ({ ...p, address: "" })); }} rows={3} required
          className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine transition-shadow" />
        {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="submit">Continue <ChevronRight size={16} /></Button>
      </div>
    </form>
  );
}

function Step3Identity({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!data.bvn.trim() || data.bvn.length < 10) errs.bvn = "Enter a valid 10-11 digit BVN";
    if (!data.nin.trim() || data.nin.length < 11) errs.nin = "Enter a valid 11-digit NIN";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <CreditCard size={18} className="text-neon-tangerine" />
        <span className="text-sm font-semibold">Identity Verification</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Why we need this</p>
        <p>Your BVN and NIN are required for identity verification as mandated by regulatory requirements. This information is encrypted and securely stored.</p>
      </div>
      <Input label="Bank Verification Number (BVN)" value={data.bvn} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); onChange({ ...data, bvn: v }); setErrors((p) => ({ ...p, bvn: "" })); }} error={errors.bvn} placeholder="Enter 10-11 digit BVN" required maxLength={11} />
      <Input label="National Identification Number (NIN)" value={data.nin} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); onChange({ ...data, nin: v }); setErrors((p) => ({ ...p, nin: "" })); }} error={errors.nin} placeholder="Enter 11-digit NIN" required maxLength={11} />
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="submit">Continue <ChevronRight size={16} /></Button>
      </div>
    </form>
  );
}

function Step4Documents({ data, onChange, onPrev, onNext }) {
  const handleFile = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) onChange({ ...data, [field]: file });
  };
  const documentFields = [
    { key: "passport", label: "Passport Photograph", accept: "image/*", required: true },
    { key: "governmentId", label: "Government-Issued ID", accept: "image/*,.pdf", required: true },
    { key: "utilityBill", label: "Utility Bill - proof of address", accept: "image/*,.pdf", required: true },
  ];
  const allDocsUploaded = documentFields.every(({ key }) => data[key]);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <FileText size={18} className="text-neon-tangerine" />
        <span className="text-sm font-semibold">Upload Documents</span>
      </div>
      <p className="text-sm text-gray-600">Upload clear, legible copies of the following documents. Accepted formats: JPG, PNG, PDF.</p>
      {documentFields.map(({ key, label, accept, required }) => (
        <div key={key} className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 text-center hover:border-neon-tangerine/60 transition-colors">
          {data[key] ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Check className="text-green-600" size={20} /></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{data[key].name || "Uploaded file"}</p>
                  <p className="text-xs text-gray-500">{data[key].size ? `${(data[key].size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
                </div>
              </div>
              <button type="button" onClick={() => onChange({ ...data, [key]: null })} className="text-sm text-red-600 hover:text-red-700 shrink-0 ml-2">Remove</button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-xs text-gray-500">Click to upload</span>
              </div>
              <input type="file" accept={accept} onChange={handleFile(key)} className="hidden" />
            </label>
          )}
        </div>
      ))}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="button" onClick={onNext} disabled={!allDocsUploaded}>Continue <ChevronRight size={16} /></Button>
      </div>
      {!allDocsUploaded && <p className="text-xs text-red-500 text-right">Upload all required documents to continue</p>}
    </div>
  );
}

function Step5Selfie({ data, onChange, onNext, onPrev }) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Camera size={18} className="text-neon-tangerine" />
        <span className="text-sm font-semibold">Upload Photo</span>
      </div>
      <p className="text-sm text-gray-600">Upload a clear photo of your face to complete identity verification.</p>
      {data ? (
        <div className="text-center">
          <img src={URL.createObjectURL(data)} alt="Selfie" className="w-48 h-48 object-cover rounded-2xl mx-auto border-2 border-green-500 shadow-sm" />
          <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1"><Check size={16} /> Photo uploaded</p>
          <button type="button" onClick={() => { URL.revokeObjectURL?.(data); onChange(null); }} className="text-sm text-red-600 mt-2 hover:underline">Remove and re-upload</button>
        </div>
      ) : (
        <div className="text-center">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full cursor-pointer">
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-neon-tangerine/60 transition-colors">
              <Camera size={40} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 mt-3">Click to upload photo</span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG accepted</span>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} className="hidden" />
        </div>
      )}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        {data && <Button type="button" onClick={onNext}>Continue <ChevronRight size={16} /></Button>}
      </div>
    </div>
  );
}

function Step6Review({ store, onPrev, onSubmit, submitting }) {
  const info = store.personalInfo || {};
  const addr = store.addressInfo || {};
  const identity = store.identityInfo || {};
  const docs = store.documents || {};
  const allComplete = info.firstName && info.lastName && addr.country && addr.address && identity.bvn && identity.nin && docs.passport && docs.governmentId && docs.utilityBill && store.selfie;
  return (
    <div className="space-y-6">
      <div className="bg-neon-tangerine/10 border border-neon-tangerine/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-neon-tangerine mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-neon-tangerine">Review Your Information</p>
            <p className="text-sm text-gray-600 mt-1">Please confirm all details before submitting. You will not be able to edit most fields after submission.</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-neon-tangerine" />
            <p className="text-sm font-semibold text-gray-900">Personal Info</p>
          </div>
          <p className="text-sm text-gray-600">{info.firstName} {info.lastName}</p>
          <p className="text-sm text-gray-600">{info.dob} - {info.gender}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-neon-tangerine" />
            <p className="text-sm font-semibold text-gray-900">Address</p>
          </div>
          <p className="text-sm text-gray-600">{addr.city}, {addr.state}</p>
          <p className="text-sm text-gray-600">{addr.country}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-neon-tangerine" />
            <p className="text-sm font-semibold text-gray-900">Identity</p>
          </div>
          <p className="text-sm text-gray-600">BVN: ****{identity.bvn?.slice(-4)}</p>
          <p className="text-sm text-gray-600">NIN: ****{identity.nin?.slice(-4)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-neon-tangerine" />
            <p className="text-sm font-semibold text-gray-900">Documents</p>
          </div>
          <p className="text-sm text-gray-600">Passport: {docs.passport?.name ? "Uploaded" : "Missing"}</p>
          <p className="text-sm text-gray-600">ID: {docs.governmentId?.name ? "Uploaded" : "Missing"}</p>
          <p className="text-sm text-gray-600">Utility: {docs.utilityBill?.name ? "Uploaded" : "Missing"}</p>
          <p className="text-sm text-gray-600">Selfie: {store.selfie ? "Uploaded" : "Missing"}</p>
        </Card>
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="button" onClick={onSubmit} disabled={!allComplete || submitting}>
          {submitting ? "Submitting..." : "Submit KYC"} <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function KycStatusPage({ status, onStartOver }) {
  const statusConfig = {
    [KYC_STATUS.PENDING]: { icon: Clock, variant: "warning", title: "KYC Pending", message: "Your KYC has been submitted. We are reviewing your application." },
    [KYC_STATUS.UNDER_REVIEW]: { icon: AlertCircle, variant: "info", title: "Under Review", message: "Your documents are being verified by our compliance team." },
    [KYC_STATUS.APPROVED]: { icon: CheckCircle2, variant: "success", title: "KYC Approved", message: "Your KYC has been approved. You can now start investing." },
    [KYC_STATUS.REJECTED]: { icon: XCircle, variant: "danger", title: "KYC Rejected", message: "Your KYC was not approved. Please resubmit with correct information." },
  };
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Card className="text-center py-12 px-6">
      <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
        status === KYC_STATUS.APPROVED ? "bg-green-100" : status === KYC_STATUS.REJECTED ? "bg-red-100" : "bg-amber-100"
      }`}>
        <Icon size={40} className={status === KYC_STATUS.APPROVED ? "text-green-600" : status === KYC_STATUS.REJECTED ? "text-red-600" : "text-amber-600"} />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
      <p className="text-gray-600 mb-6">{config.message}</p>
      <Badge variant={config.variant} className="text-sm px-4 py-1">{status}</Badge>
      {status === KYC_STATUS.REJECTED && (
        <div className="mt-6"><Button onClick={onStartOver}>Re-submit KYC</Button></div>
      )}
    </Card>
  );
}

function KycPage() {
  const navigate = useNavigate();
  const store = useKycStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    store.reset();
    const fetchStatus = async () => {
      try {
        const res = await kycApi.getStatus();
        const s = res?.kyc?.status || null;
        if (s) store.setStatus(s);
      } catch (e) {
        if (e?.code !== "ERR_NETWORK") toast.error("Failed to load KYC status. Check your connection.");
        else toast.error("Network error — is the backend server running?");
      } finally { setLoading(false); }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      if (store.personalInfo) await kycApi.submitPersonalInfo(store.personalInfo);
      if (store.addressInfo) await kycApi.submitAddressInfo(store.addressInfo);
      if (store.identityInfo) await kycApi.submitIdentityInfo(store.identityInfo);
      const docs = store.documents || {};
      if (docs.passport || docs.governmentId || docs.utilityBill) {
        const fd = new FormData();
        if (docs.passport) fd.append("passport", docs.passport);
        if (docs.governmentId) fd.append("governmentId", docs.governmentId);
        if (docs.utilityBill) fd.append("utilityBill", docs.utilityBill);
        await kycApi.uploadDocument(fd);
      }
      if (store.selfie) {
        const fd = new FormData();
        fd.append("selfie", store.selfie);
        await kycApi.uploadSelfie(fd);
      }
      await kycApi.submitKyc();
      store.setStatus(KYC_STATUS.PENDING);
      toast.success("KYC submitted successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Submission failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-8"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <Card><Skeleton className="h-12 mb-6" /><Skeleton className="h-10 mb-4" /><Skeleton className="h-10 mb-4" /><Skeleton className="h-32" /></Card>
      </div>
    );
  }

  if (store.status && store.status !== KYC_STATUS.REJECTED) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Know Your Customer verification status</p>
        </div>
        <KycStatusPage status={store.status} onStartOver={store.reset} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600">{store.status === KYC_STATUS.REJECTED ? "Resubmit your KYC with correct information" : "Complete your identity verification to start investing"}</p>
      </div>

      <Card>
        <StepIndicator currentStep={store.currentStep} />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {store.currentStep === 0 && <Step1PersonalInfo data={store.personalInfo} onChange={store.setPersonalInfo} onNext={store.nextStep} />}
        {store.currentStep === 1 && <Step2Address data={store.addressInfo} onChange={store.setAddressInfo} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 2 && <Step3Identity data={store.identityInfo} onChange={store.setIdentityInfo} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 3 && <Step4Documents data={store.documents} onChange={store.setDocuments} onPrev={store.prevStep} onNext={store.nextStep} />}
        {store.currentStep === 4 && <Step5Selfie data={store.selfie} onChange={store.setSelfie} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 5 && <Step6Review store={store} onPrev={store.prevStep} onSubmit={handleSubmit} submitting={submitting} />}
      </Card>
    </div>
  );
}

export default KycPage;
