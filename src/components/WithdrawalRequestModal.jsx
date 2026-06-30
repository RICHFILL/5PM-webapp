import { ArrowUpRight, Mail, Wallet } from "lucide-react";

function WithdrawalRequestModal({
  isOpen,
  onClose,
  onConfirm,
  expectedReturns,
  formatCurrency,
  isSubmitting,
  error,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-dark-lavender px-5 py-5 text-white">
          <div className="mb-4 inline-flex rounded-xl bg-white/15 p-2.5">
            <Wallet size={20} />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/75">
            Withdrawal Request
          </p>
          <h3 className="text-2xl font-bold leading-tight">
            Request your returns in one step
          </h3>
          <p className="mt-2 max-w-sm text-sm text-white/80">
            We will notify the admin and also send a confirmation email to your
            registered email address.
          </p>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">
              Expected Returns
            </p>
            <div className="mt-2.5 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(expectedReturns)}
                </p>
                <p className="mt-1.5 text-xs text-slate-500">
                  This amount will be included in the email request.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#00B8DB]/15 bg-[#00B8DB]/5 p-3.5 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 text-[#00B8DB]" size={16} />
              <p>
                The request email will go to the admin and a confirmation email
                will be sent to the user automatically.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting || expectedReturns <= 0}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Sending Request..." : "Send Withdrawal Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalRequestModal;
