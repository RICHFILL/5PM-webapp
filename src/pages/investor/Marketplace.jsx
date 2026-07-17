import { useState, useEffect, useRef } from "react";
import { Search, Filter, TrendingUp, Clock, DollarSign, ChevronRight, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { investmentApi, agreementApi } from "../../services/api";
import useInvestmentStore from "../../store/investmentStore";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import { formatNaira } from '../../utils/format';
import AgreementSigningModal from "../../components/agreement/AgreementSigningModal";
import CreditNoteAgreement from "../../components/agreement/CreditNoteAgreement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatROI = (roi) => roi || "3.5%";

function InvestModal({ isOpen, onClose, product }) {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [agreementData, setAgreementData] = useState(null);
  const contractRef = useRef(null);
  const [contractDownloading, setContractDownloading] = useState(false);

  const minAmount = product?.minimumInvestment || product?.minInvestment || 0;
  const investorName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Investor";

  const handleInvest = (e) => {
    e.preventDefault();
    if (Number(amount) < minAmount) {
      setError(`Minimum investment is ${formatNaira(minAmount)}`);
      return;
    }
    setShowAgreement(true);
  };

  const handleAgreementConfirm = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const result = await investmentApi.createInvestment({
        productId: product.id,
        amount: Number(amount),
      });
      const investmentId = result?.investment?.id || result?.data?.id || result?.id;

      if (investmentId) {
        const formData = new FormData();
        if (payload.signature.type === "typed") {
          formData.append("signatureType", "typed");
        } else {
          const blob = await fetch(payload.signature.data).then((r) => r.blob());
          formData.append("signature", blob, "signature.png");
          formData.append("signatureType", payload.signature.type);
        }
        formData.append("fullName", payload.fullName);
        formData.append("signedAt", payload.signedAt);
        const agreementRes = await agreementApi.submitAgreement(investmentId, formData);
        setAgreementData(agreementRes?.agreement || null);
      }

      setAgreementSigned(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Investment failed");
      setShowAgreement(false);
    } finally { setLoading(false); }
  };

  const handleDownloadContract = async () => {
    if (!contractRef.current) return;
    setContractDownloading(true);
    try {
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename = `contract-${(product?.name || product?.projectName || "investment").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setContractDownloading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={step === "form" ? `Invest in ${product?.name || product?.projectName}` : "Investment Confirmed"} size="md">
        {step === "form" ? (
          <form onSubmit={handleInvest} className="space-y-4">
            <div className="bg-neon-tangerine/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Expected ROI</span><span className="font-semibold">{formatROI(product?.roiDisplay || product?.expectedROI)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Minimum Investment</span><span className="font-semibold">{formatNaira(minAmount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Duration</span><span className="font-semibold">{product?.duration || product?.tenure || "--"} months</span></div>
            </div>
            <Input label="Investment Amount (NGN)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min ${formatNaira(minAmount)}`} required min={minAmount} />
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !amount}>
              {loading ? "Processing..." : `Invest ${formatNaira(Number(amount) || 0)}`}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Investment Submitted!</h3>
            <p className="text-sm text-gray-600">You have successfully invested {formatNaira(Number(amount))} in {product?.name || product?.projectName}.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleDownloadContract} disabled={contractDownloading} variant="outline">
                <Download size={15} />
                {contractDownloading ? "Generating..." : "Download Contract (PDF)"}
              </Button>
              <Button onClick={onClose} variant="secondary">View My Investments</Button>
            </div>
          </div>
        )}
      </Modal>

      <AgreementSigningModal
        isOpen={showAgreement}
        onClose={() => {
          setShowAgreement(false);
          setAgreementSigned(false);
          setStep("confirmation");
        }}
        onConfirm={handleAgreementConfirm}
        investorName={investorName}
        principalAmount={Number(amount)}
        currency="NGN"
        tenorMonths={product?.duration || product?.tenure}
        monthlyRatePercent={parseFloat(product?.roiDisplay || product?.expectedROI) || 0}
        propertyName={product?.name || product?.projectName || "Investment Product"}
        submitting={loading}
        signedSuccess={agreementSigned}
      />

      <div style={{ position: "fixed", top: 0, left: "-9999px" }}>
        <div ref={contractRef}>
          <CreditNoteAgreement
            investorName={investorName}
            principalAmount={Number(amount)}
            currency="NGN"
            tenorMonths={product?.duration || product?.tenure}
            monthlyRatePercent={parseFloat(product?.roiDisplay || product?.expectedROI) || 0}
            propertyName={product?.name || product?.projectName || "Investment Product"}
            signatureUrl={agreementData?.signatureUrl}
            signatureFullName={agreementData?.fullName}
            signatureDate={agreementData?.signedAt}
          />
        </div>
      </div>
    </>
  );
}

export default function Marketplace() {
  const { opportunities, setOpportunities } = useInvestmentStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await investmentApi.getOpportunities();
        const items = Array.isArray(data) ? data : data?.data ?? data?.opportunities ?? [];
        setOpportunities(items);
      } catch (err) {
        setOpportunities([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = (opportunities || []).filter((p) => {
    const name = (p.name || p.projectName || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-neon-tangerine rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Investment Marketplace</h1>
        <p className="text-cyan-100">Discover and invest in curated opportunities</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none transition-all" />
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <Card key={product._id || i} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name || product.projectName}</h3>
                  <Badge variant={product.risk || "default"}>{product.risk || "Balanced"}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description || "No description available."}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp size={16} className="text-neon-tangerine" />
                    <span>ROI: <strong className="text-gray-900">{formatROI(product.roiDisplay || product.expectedROI)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-neon-tangerine" />
                    <span>Min: <strong className="text-gray-900">{formatNaira(product.minimumInvestment || product.minInvestment)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-neon-tangerine" />
                    <span>Duration: <strong className="text-gray-900">{product.duration || product.tenure || "--"} months</strong></span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setSelectedProduct(product)} className="w-full mt-4">
                Invest Now <ChevronRight size={16} />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No opportunities match your search.</p>
          </div>
        </Card>
      )}

      {selectedProduct && <InvestModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} />}
    </div>
  );
}
