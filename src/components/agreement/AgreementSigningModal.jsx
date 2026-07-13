import { useState } from "react";
import { Modal, Button } from "../common";
import CreditNoteAgreement from "./CreditNoteAgreement";
import SignaturePad from "./SignaturePad";
import { AlertCircle, ShieldCheck } from "lucide-react";

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
}) {
  const [signature, setSignature] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

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
