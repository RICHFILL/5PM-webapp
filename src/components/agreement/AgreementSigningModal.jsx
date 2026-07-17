import { useState, useRef } from "react";
import { Modal, Button } from "../common";
import CreditNoteAgreement from "./CreditNoteAgreement";
import SignaturePad from "./SignaturePad";
import { AlertCircle, ShieldCheck, CheckCircle2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AgreementSigningModal({
  isOpen,
  onClose,
  onConfirm,
  investorName,
  principalAmount,
  currency,
  tenorMonths,
  monthlyRatePercent,
  propertyName,
  submitting,
  signedSuccess,
}) {
  const [signature, setSignature] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const agreementRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!agreementRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(agreementRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename = `contract-${(propertyName || "agreement").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloading(false);
    }
  };

  if (signedSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Contract Signed Successfully" size="xl">
        <div className="text-center space-y-6 py-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Contract Signed Successfully!</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Your Private Credit Note Agreement has been signed and submitted. You can download a copy for your records.
          </p>

          <div style={{ position: "fixed", top: 0, left: "-9999px" }}>
            <div ref={agreementRef}>
              <CreditNoteAgreement
                investorName={investorName}
                principalAmount={principalAmount}
                currency={currency}
                tenorMonths={tenorMonths}
                monthlyRatePercent={monthlyRatePercent}
                propertyName={propertyName}
                signatureUrl={signature?.type !== "typed" ? signature?.data : undefined}
                signatureFullName={signature?.type === "typed" ? signature?.data : investorName}
                signatureDate={new Date().toISOString()}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleDownloadPdf} disabled={downloading}>
              <Download size={15} />
              {downloading ? "Generating PDF..." : "Download Signed Contract (PDF)"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 24) setScrolledToEnd(true);
  };

  const canConfirm = agreed && signature && scrolledToEnd;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({
      signature,
      signedAt: new Date().toISOString(),
      fullName: investorName,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Private Credit Note Agreement"
      size="xl"
    >
      <div className="space-y-4">
        <div
          onScroll={handleScroll}
          className="max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5"
        >
          <CreditNoteAgreement
            investorName={investorName}
            principalAmount={principalAmount}
            currency={currency}
            tenorMonths={tenorMonths}
            monthlyRatePercent={monthlyRatePercent}
            propertyName={propertyName}
          />
        </div>

        {!scrolledToEnd && (
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={14} /> Please scroll to the end of the agreement
            to continue.
          </p>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Sign below to accept
          </p>
          <SignaturePad fullName={investorName} onChange={setSignature} />
        </div>

        <label className="flex items-start gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I, <strong>{investorName}</strong>, have read and agree to the terms
            of this Private Credit Note Agreement, and confirm that my signature
            above represents my legal acceptance.
          </span>
        </label>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} /> Your signature and acceptance timestamp are
          recorded with this submission.
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm || submitting}>
            {submitting ? "Submitting..." : "Sign & Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
