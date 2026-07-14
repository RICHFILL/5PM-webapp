import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { adminApi } from "../../services/api";
import { Modal, Button, Input } from "./index";
import toast from "react-hot-toast";
import { formatCurrencyAmount } from "../../utils/currency";

export default function AmountUpdateModal({ open, onClose, investment, onSuccess }) {
  const [newAmount, setNewAmount] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [updatingAmount, setUpdatingAmount] = useState(false);

  useEffect(() => {
    if (open) {
      setNewAmount("");
      setNewInterest("");
      setOtpSent(false);
      setOtp("");
      setSendingOtp(false);
      setUpdatingAmount(false);
    }
  }, [open]);

  const handleSendOtp = async () => {
    if (!newAmount || parseFloat(newAmount) <= 0) {
      toast.error("Enter a valid amount greater than 0");
      return;
    }
    setSendingOtp(true);
    try {
      await adminApi.sendAmountUpdateOtp(investment.id || investment._id);
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleUpdate = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter the 6-digit OTP sent to your email");
      return;
    }
    setUpdatingAmount(true);
    try {
      const res = await adminApi.updateAmount(investment.id || investment._id, {
        amount: parseFloat(newAmount),
        interest: newInterest ? parseFloat(newInterest) : undefined,
        otp,
      });
      toast.success(res?.message || "Investment updated");
      onSuccess?.(res?.data);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update investment");
    } finally {
      setUpdatingAmount(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Update Investment" size="sm">
      <div className="space-y-4">
        {investment && (
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 space-y-1">
            <div>
              Current amount:{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrencyAmount(investment.amount, investment.currency)}
              </span>
            </div>
            <div>
              Current interest:{" "}
              <span className="font-semibold text-gray-900">
                {investment.interestRatePerAnnum || 0}%
              </span>
            </div>
          </div>
        )}
        {!otpSent ? (
          <>
            <Input
              label="New Amount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Enter new amount"
              min={1}
              step="0.01"
            />
            <Input
              label="New Interest Rate (%)"
              type="number"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Enter new interest rate"
              min={0}
              step="0.01"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose} size="sm">Cancel</Button>
              <Button onClick={handleSendOtp} disabled={sendingOtp} size="sm">
                {sendingOtp ? "Sending..." : "Send OTP to my email"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-neon-tangerine/10 border border-neon-tangerine/30 rounded-xl p-3 text-sm text-gray-700">
              A 6-digit code has been sent to your admin email. It expires in 10 minutes.
            </div>
            <Input
              label="OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose} size="sm">Cancel</Button>
              <Button onClick={handleUpdate} disabled={updatingAmount || otp.length !== 6} size="sm">
                {updatingAmount ? "Updating..." : "Confirm Update"}
              </Button>
            </div>
            <button
              onClick={() => setOtpSent(false)}
              className="text-xs text-neon-tangerine hover:underline"
            >
              Didn't receive the code? Send again
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
