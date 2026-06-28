import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Upload, Camera, ChevronLeft, ChevronRight, Shield, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Button, Input, Card, Badge } from "../../components/common";
import { kycApi } from "../../services/api";
import useKycStore from "../../store/kycStore";
import { KYC_STEPS, KYC_STATUS } from "../../constants";

const stepLabels = ["Personal Info", "Address", "Identity", "Documents", "Selfie", "Review"];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepLabels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i === currentStep ? "bg-brand-500 text-white" :
            i < currentStep ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {i < currentStep ? <Check size={12} /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < stepLabels.length - 1 && <div className="w-4 h-0.5 bg-gray-200" />}
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
    if (!data.firstName.trim()) errs.firstName = "Required";
    if (!data.lastName.trim()) errs.lastName = "Required";
    if (!data.dob) errs.dob = "Required";
    if (!data.gender) errs.gender = "Required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" value={data.firstName} onChange={(e) => onChange({...data, firstName: e.target.value})} error={errors.firstName} required />
        <Input label="Last Name" value={data.lastName} onChange={(e) => onChange({...data, lastName: e.target.value})} error={errors.lastName} required />
      </div>
      <Input label="Date of Birth" type="date" value={data.dob} onChange={(e) => onChange({...data, dob: e.target.value})} error={errors.dob} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value={g.toLowerCase()} checked={data.gender === g.toLowerCase()} onChange={(e) => onChange({...data, gender: e.target.value})}
                className="text-brand-500 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">{g}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
      </div>
      <div className="flex justify-end pt-4">
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
    if (!data.country.trim()) errs.country = "Required";
    if (!data.state.trim()) errs.state = "Required";
    if (!data.city.trim()) errs.city = "Required";
    if (!data.address.trim()) errs.address = "Required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Country" value={data.country} onChange={(e) => onChange({...data, country: e.target.value})} error={errors.country} placeholder="Nigeria" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="State" value={data.state} onChange={(e) => onChange({...data, state: e.target.value})} error={errors.state} required />
        <Input label="City" value={data.city} onChange={(e) => onChange({...data, city: e.target.value})} error={errors.city} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
        <textarea value={data.address} onChange={(e) => onChange({...data, address: e.target.value})} rows={3} required
          className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
        {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
      </div>
      <div className="flex justify-between pt-4">
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
    if (!data.bvn.trim() || data.bvn.length < 10) errs.bvn = "Enter a valid 10-digit BVN";
    if (!data.nin.trim() || data.nin.length < 10) errs.nin = "Enter a valid NIN";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-4">
        <p className="font-semibold mb-1">Why we need this?</p>
        <p>Your BVN and NIN are required for identity verification as mandated by regulatory requirements. This information is encrypted and securely stored.</p>
      </div>
      <Input label="Bank Verification Number (BVN)" value={data.bvn} onChange={(e) => onChange({...data, bvn: e.target.value.replace(/\D/g, "").slice(0, 10)})} error={errors.bvn} placeholder="Enter 10-digit BVN" required maxLength={10} />
      <Input label="National Identification Number (NIN)" value={data.nin} onChange={(e) => onChange({...data, nin: e.target.value.replace(/\D/g, "").slice(0, 11)})} error={errors.nin} placeholder="Enter NIN" required maxLength={11} />
      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="submit">Continue <ChevronRight size={16} /></Button>
      </div>
    </form>
  );
}

function Step4Documents({ data, onChange, onNext, onPrev }) {
  const handleFile = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) onChange({...data, [field]: file});
  };
  const documentFields = [
    { key: "passport", label: "Passport Photograph", accept: "image/*" },
    { key: "governmentId", label: "Government-Issued ID", accept: "image/*,.pdf" },
    { key: "utilityBill", label: "Utility Bill (proof of address)", accept: "image/*,.pdf" },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">Upload clear, legible copies of the following documents. Accepted formats: JPG, PNG, PDF.</p>
      {documentFields.map(({ key, label, accept }) => (
        <div key={key} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-400 transition-colors">
          {data[key] ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Check className="text-green-600" size={20} /></div>
                <div className="text-left"><p className="text-sm font-medium text-gray-900">{data[key].name}</p><p className="text-xs text-gray-500">{(data[key].size / 1024 / 1024).toFixed(2)} MB</p></div>
              </div>
              <button type="button" onClick={() => onChange({...data, [key]: null})} className="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-2"><Upload size={24} className="text-gray-400" /><span className="text-sm font-medium text-gray-700">{label}</span><span className="text-xs text-gray-500">Click to upload</span></div>
              <input type="file" accept={accept} onChange={handleFile(key)} className="hidden" />
            </label>
          )}
        </div>
      ))}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        <Button type="button" onClick={onNext}>Continue <ChevronRight size={16} /></Button>
      </div>
    </div>
  );
}

function Step5Selfie({ data, onChange, onNext, onPrev }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { alert("Camera access denied. Please allow camera access or upload a photo."); }
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvasRef.current.toBlob((blob) => {
      onChange(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
    }, "image/jpeg");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Take a live selfie to complete your identity verification.</p>
      {data ? (
        <div className="text-center">
          <img src={URL.createObjectURL(data)} alt="Selfie" className="w-48 h-48 object-cover rounded-2xl mx-auto border-2 border-green-500" />
          <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1"><Check size={16} /> Selfie captured</p>
          <button type="button" onClick={() => onChange(null)} className="text-sm text-red-600 mt-2">Retake</button>
        </div>
      ) : (
        <div className="text-center">
          {stream ? (
            <div>
              <video ref={videoRef} autoPlay playsInline className="w-64 h-64 object-cover rounded-2xl mx-auto bg-black" />
              <div className="flex gap-4 justify-center mt-4">
                <Button type="button" onClick={captureSelfie}><Camera size={16} /> Capture</Button>
                <Button type="button" variant="ghost" onClick={() => { stream.getTracks().forEach((t) => t.stop()); setStream(null); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera size={40} className="text-gray-400" />
              </div>
              <div className="flex gap-4 justify-center mt-4">
                <Button type="button" onClick={startCamera}><Camera size={16} /> Open Camera</Button>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline"><Upload size={16} /> Upload Photo</Button>
                  <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPrev}><ChevronLeft size={16} /> Back</Button>
        {data && <Button type="button" onClick={onNext}>Continue <ChevronRight size={16} /></Button>}
      </div>
    </div>
  );
}

function Step6Review({ store, onPrev, onSubmit, submitting }) {
  const allComplete = store.personalInfo.firstName && store.personalInfo.lastName && store.addressInfo.country && store.addressInfo.address && store.identityInfo.bvn && store.identityInfo.nin && store.documents.passport && store.selfie;
  return (
    <div className="space-y-6">
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-brand-500 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-brand-900">Review Your Information</p>
            <p className="text-sm text-brand-700">Please confirm all details before submitting. You will not be able to edit most fields after submission.</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card><Card.Title className="text-sm">Personal Info</Card.Title><div className="text-sm text-gray-600 mt-2"><p>{store.personalInfo.firstName} {store.personalInfo.lastName}</p><p>{store.personalInfo.dob} &middot; {store.personalInfo.gender}</p></div></Card>
        <Card><Card.Title className="text-sm">Address</Card.Title><div className="text-sm text-gray-600 mt-2"><p>{store.addressInfo.city}, {store.addressInfo.state}</p><p>{store.addressInfo.country}</p></div></Card>
        <Card><Card.Title className="text-sm">Identity</Card.Title><div className="text-sm text-gray-600 mt-2"><p>BVN: ****{store.identityInfo.bvn?.slice(-4)}</p><p>NIN: ****{store.identityInfo.nin?.slice(-4)}</p></div></Card>
        <Card><Card.Title className="text-sm">Documents</Card.Title><div className="text-sm text-gray-600 mt-2"><p>Passport: {store.documents.passport?.name ? "Uploaded" : "Missing"}</p><p>ID: {store.documents.governmentId?.name ? "Uploaded" : "Optional"}</p><p>Utility: {store.documents.utilityBill?.name ? "Uploaded" : "Missing"}</p></div></Card>
      </div>
      <div className="flex justify-between pt-4">
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
    <Card className="text-center py-12">
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      if (store.personalInfo) await kycApi.submitPersonalInfo(store.personalInfo);
      if (store.addressInfo) await kycApi.submitAddressInfo(store.addressInfo);
      if (store.identityInfo) await kycApi.submitIdentityInfo(store.identityInfo);
      if (store.documents.passport) {
        const fd = new FormData();
        fd.append("passport", store.documents.passport);
        if (store.documents.governmentId) fd.append("governmentId", store.documents.governmentId);
        if (store.documents.utilityBill) fd.append("utilityBill", store.documents.utilityBill);
        await kycApi.uploadDocument(fd);
      }
      if (store.selfie) {
        const fd = new FormData();
        fd.append("selfie", store.selfie);
        await kycApi.uploadSelfie(fd);
      }
      await kycApi.submitKyc();
      store.setStatus(KYC_STATUS.PENDING);
      store.nextStep();
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (store.status) {
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
        <p className="text-gray-600">Complete your identity verification to start investing</p>
      </div>

      <Card>
        <StepIndicator currentStep={store.currentStep} />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
        {store.currentStep === 0 && <Step1PersonalInfo data={store.personalInfo} onChange={store.setPersonalInfo} onNext={store.nextStep} />}
        {store.currentStep === 1 && <Step2Address data={store.addressInfo} onChange={store.setAddressInfo} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 2 && <Step3Identity data={store.identityInfo} onChange={store.setIdentityInfo} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 3 && <Step4Documents data={store.documents} onChange={store.setDocuments} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 4 && <Step5Selfie data={store.selfie} onChange={store.setSelfie} onNext={store.nextStep} onPrev={store.prevStep} />}
        {store.currentStep === 5 && <Step6Review store={store} onPrev={store.prevStep} onSubmit={handleSubmit} submitting={submitting} />}
      </Card>
    </div>
  );
}

export default KycPage;
