import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../constants";

const initialState = {
  title: "Mr.",
  titleOther: "",
  surname: "",
  givenName: "",
  middleName: "",
  dob: "",
  mobile1: "",
  mobile2: "",
  email: "",
  homeAddress: "",
  bvn: "",
  idName: "",
  idNumber: "",
  idIssueDate: "",
  idExpiryDate: "",
  investmentAmount: "",
  preferredTenor: "",
  interestRateRange: "",
  repaymentOption: "",
  effectiveDate: "",
  preferredBorrowerCompany: "",
  otherPreference: "",
  bank1Name: "",
  bank1AccountName: "",
  bank1AccountNumber: "",
  bank1NotifyPhone: "",
  bank1NotifyEmail: "",
  bank2Name: "",
  bank2AccountName: "",
  bank2AccountNumber: "",
  bank2NotifyPhone: "",
  bank2NotifyEmail: "",
  nokName: "",
  nokRelationshipPhone: "",
  nokHomeAddress: "",
  nokEmail: "",
  confirmBankChange: false,
  confirmTruthful: false,
  signatureName: "",
  signatureDate: "",
};

// Steps drive both the wizard UI and per-step validation.
const STEPS = [
  {
    key: "personal",
    title: "Personal Information",
    requiredFields: [
      "title",
      "surname",
      "givenName",
      "middleName",
      "dob",
      "mobile1",
      "email",
      "homeAddress",
      "bvn",
    ],
  },
  {
    key: "identification",
    title: "Means of Identification",
    requiredFields: ["idName", "idNumber", "idIssueDate", "idExpiryDate"],
  },
  {
    key: "preferences",
    title: "Investment Preferences",
    requiredFields: [
      "investmentAmount",
      "preferredTenor",
      "interestRateRange",
      "repaymentOption",
      "effectiveDate",
    ],
  },
  {
    key: "bank",
    title: "Bank Details",
    requiredFields: [
      "bank1Name",
      "bank1AccountName",
      "bank1AccountNumber",
      "bank1NotifyPhone",
      "bank1NotifyEmail",
    ],
  },
  {
    key: "nextOfKin",
    title: "Next-of-Kin",
    requiredFields: [],
  },
  {
    key: "declaration",
    title: "Declaration & Signature",
    requiredFields: ["signatureName", "signatureDate"],
  },
];

function Field({ label, required, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-gray-800 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none";

// Human-readable labels for error messages / summaries, keyed by form field.
const FIELD_LABELS = {
  title: "Title",
  titleOther: "Title (please specify)",
  surname: "Surname",
  givenName: "Given Name",
  middleName: "Given Names (Middle)",
  dob: "Date of Birth",
  mobile1: "Primary Mobile Number",
  email: "Email Address",
  homeAddress: "Home Address",
  bvn: "BVN",
  idName: "Name of the ID",
  idNumber: "ID Number",
  idIssueDate: "ID Issue Date",
  idExpiryDate: "ID Expiry Date",
  investmentAmount: "Amount of Investment",
  preferredTenor: "Preferred Tenor",
  interestRateRange: "Interest Rates (Range)",
  repaymentOption: "Repayment Option",
  effectiveDate: "Effective Date",
  bank1Name: "Bank Name",
  bank1AccountName: "Account Name",
  bank1AccountNumber: "Account Number",
  bank1NotifyPhone: "Transaction Notification Phone",
  bank1NotifyEmail: "Transaction Notification Email",
  signatureName: "Signature",
  signatureDate: "Signature Date",
  confirmations: "Declaration checkboxes",
};

// Shown at the top of a step when it has validation errors, so the user
// doesn't have to hunt through the form to find what's missing.
function ErrorSummary({ errors }) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm font-semibold text-red-700 mb-1">
        Please fix the following before continuing:
      </p>
      <ul className="list-disc list-inside space-y-0.5">
        {entries.map(([key, message]) => (
          <li key={key} className="text-xs text-red-600">
            {FIELD_LABELS[key] || key}
            {message && message !== "Required" ? ` — ${message}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InvestmentMandateForm() {
  const [form, setForm] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const update = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Applies a red border/ring to a field once it has a validation error,
  // so the person can see exactly where the problem is, not just read
  // about it in a summary.
  const fieldClass = (key) =>
    inputClass + (errors[key] ? " border-red-400 ring-2 ring-red-100" : "");

  const validateStep = (index) => {
    const s = STEPS[index];
    const errs = {};
    s.requiredFields.forEach((key) => {
      if (!form[key]) errs[key] = "Required";
    });
    if (s.key === "personal" && form.title === "Others" && !form.titleOther) {
      errs.titleOther = "Please specify";
    }
    if (
      s.key === "preferences" &&
      form.investmentAmount &&
      Number(form.investmentAmount) < 5000000
    ) {
      errs.investmentAmount = "Minimum investment is ₦5,000,000";
    }
    if (
      s.key === "declaration" &&
      (!form.confirmBankChange || !form.confirmTruthful)
    ) {
      errs.confirmations = "Both confirmations must be checked";
    }
    setErrors(errs);
    return errs;
  };

  const goNext = () => {
    const errs = validateStep(stepIndex);
    if (Object.keys(errs).length > 0) {
      const fieldNames = Object.keys(errs)
        .map((k) => FIELD_LABELS[k] || k)
        .join(", ");
      toast.error(`Please fix: ${fieldNames}`);
      return;
    }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (index) => {
    // Only allow jumping backward, or forward one step at a time via validation
    if (index <= stepIndex) {
      setErrors({});
      setStepIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep(stepIndex);
    if (Object.keys(errs).length > 0) {
      const fieldNames = Object.keys(errs)
        .map((k) => FIELD_LABELS[k] || k)
        .join(", ");
      toast.error(`Please fix: ${fieldNames}`);
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (photo) formData.append("photo", photo);

      const res = await fetch(`${API_BASE_URL}/investment-mandate/submit`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Submission failed");

      setSubmitted(true);
      toast.success("Mandate form submitted successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you</h1>
        <p className="text-gray-600">
          Your Investment Mandate Form has been submitted. Our team has been
          notified and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="text-center space-y-1 mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Investment Mandate Form
        </h1>
        <p className="text-sm text-gray-500">(INV/IND/001)</p>
      </div>

      {/* Step progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <button
              type="button"
              key={s.key}
              onClick={() => goToStep(i)}
              disabled={i > stepIndex}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <span
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors " +
                  (i === stepIndex && Object.keys(errors).length > 0
                    ? "bg-red-500 text-white ring-4 ring-red-100"
                    : i < stepIndex
                      ? "bg-orange-500 text-white"
                      : i === stepIndex
                        ? "bg-orange-500 text-white ring-4 ring-orange-100"
                        : "bg-gray-200 text-gray-500")
                }
              >
                {i + 1}
              </span>
              <span
                className={
                  "hidden sm:block text-[11px] text-center leading-tight " +
                  (i === stepIndex
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400")
                }
              >
                {s.title}
              </span>
            </button>
          ))}
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 sm:hidden text-center">
          Step {stepIndex + 1} of {STEPS.length}: {step.title}
        </p>
      </div>

      <ErrorSummary errors={errors} />

      {/* Step 1: Personal Information */}
      {step.key === "personal" && (
        <section>
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Personal Information
          </h2>

          <Field label="1. Title" required>
            <div className="flex flex-wrap items-center gap-4">
              {["Mr.", "Miss", "Mrs.", "Others"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name="title"
                    value={t}
                    checked={form.title === t}
                    onChange={update("title")}
                  />
                  {t}
                </label>
              ))}
              {form.title === "Others" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={form.titleOther}
                  onChange={update("titleOther")}
                  className={fieldClass("titleOther") + " flex-1 min-w-[160px]"}
                />
              )}
            </div>
            {errors.titleOther && (
              <p className="text-xs text-red-500 mt-1">{errors.titleOther}</p>
            )}
          </Field>

          <Field label="2. Surname" required>
            <input
              type="text"
              value={form.surname}
              onChange={update("surname")}
              className={fieldClass("surname")}
            />
            {errors.surname && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="3. Given Name" required>
            <input
              type="text"
              value={form.givenName}
              onChange={update("givenName")}
              className={fieldClass("givenName")}
            />
            {errors.givenName && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="4. Given Names (Middle)" required>
            <input
              type="text"
              value={form.middleName}
              onChange={update("middleName")}
              className={fieldClass("middleName")}
            />
            {errors.middleName && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="5. Date of Birth" required>
            <input
              type="date"
              value={form.dob}
              onChange={update("dob")}
              className={fieldClass("dob")}
            />
            {errors.dob && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="6. Mobile Phone Number(s)" required>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Primary"
                value={form.mobile1}
                onChange={update("mobile1")}
                className={fieldClass("mobile1")}
              />
              <input
                type="tel"
                placeholder="Secondary (optional)"
                value={form.mobile2}
                onChange={update("mobile2")}
                className={inputClass}
              />
            </div>
            {errors.mobile1 && (
              <p className="text-xs text-red-500 mt-1">
                Primary mobile number is required
              </p>
            )}
          </Field>

          <Field label="7. Email Address" required>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              className={fieldClass("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="8. Home Address" required>
            <textarea
              rows={2}
              value={form.homeAddress}
              onChange={update("homeAddress")}
              className={fieldClass("homeAddress")}
            />
            {errors.homeAddress && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="9. BVN (Bank Verification Number)" required>
            <input
              type="text"
              maxLength={11}
              value={form.bvn}
              onChange={update("bvn")}
              className={fieldClass("bvn")}
            />
            {errors.bvn && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="Recent Passport Photograph (not older than 6 months)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </Field>
        </section>
      )}

      {/* Step 2: Means of Identification */}
      {step.key === "identification" && (
        <section>
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            10. Means of Identification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name of the ID" required>
              <input
                type="text"
                placeholder="e.g. National ID, Passport, Driver's Licence"
                value={form.idName}
                onChange={update("idName")}
                className={fieldClass("idName")}
              />
            </Field>
            <Field label="ID Number" required>
              <input
                type="text"
                value={form.idNumber}
                onChange={update("idNumber")}
                className={fieldClass("idNumber")}
              />
            </Field>
            <Field label="Issue Date" required>
              <input
                type="date"
                value={form.idIssueDate}
                onChange={update("idIssueDate")}
                className={fieldClass("idIssueDate")}
              />
            </Field>
            <Field label="Expiry Date" required>
              <input
                type="date"
                value={form.idExpiryDate}
                onChange={update("idExpiryDate")}
                className={fieldClass("idExpiryDate")}
              />
            </Field>
          </div>
        </section>
      )}

      {/* Step 3: Investment Preferences */}
      {step.key === "preferences" && (
        <section>
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            11. Investment Preferences
          </h2>

          <Field
            label="Amount of Investment (minimum ₦5,000,000, multiples of ₦100,000 thereafter)"
            required
          >
            <input
              type="number"
              step="100000"
              min="5000000"
              value={form.investmentAmount}
              onChange={update("investmentAmount")}
              className={fieldClass("investmentAmount")}
            />
            {errors.investmentAmount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.investmentAmount}
              </p>
            )}
          </Field>

          <Field label="Preferred Tenor" required>
            <input
              type="text"
              placeholder="e.g. 12 months"
              value={form.preferredTenor}
              onChange={update("preferredTenor")}
              className={fieldClass("preferredTenor")}
            />
            {errors.preferredTenor && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="Interest Rates (Range)" required>
            <input
              type="text"
              placeholder="e.g. 3.5% - 4.0% monthly"
              value={form.interestRateRange}
              onChange={update("interestRateRange")}
              className={fieldClass("interestRateRange")}
            />
            {errors.interestRateRange && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="Repayment Option" required>
            <select
              value={form.repaymentOption}
              onChange={update("repaymentOption")}
              className={fieldClass("repaymentOption")}
            >
              <option value="">Select an option</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-annual">Bi-annual</option>
              <option value="Yearly">Yearly</option>
            </select>
            {errors.repaymentOption && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="Effective Date" required>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={update("effectiveDate")}
              className={fieldClass("effectiveDate")}
            />
            {errors.effectiveDate && (
              <p className="text-xs text-red-500 mt-1">Required</p>
            )}
          </Field>

          <Field label="Preferred Borrower — Name of the Company (kindly match my funds/investment to the borrower indicated here)">
            <input
              type="text"
              value={form.preferredBorrowerCompany}
              onChange={update("preferredBorrowerCompany")}
              className={inputClass}
            />
          </Field>

          <Field label="Any Other Preference">
            <textarea
              rows={2}
              value={form.otherPreference}
              onChange={update("otherPreference")}
              className={inputClass}
            />
          </Field>
        </section>
      )}

      {/* Step 4: Bank Details (Primary + Alternative) */}
      {step.key === "bank" && (
        <>
          <section>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              12. Bank Details (For remittance of Investment Proceeds)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Bank Name" required>
                <input
                  type="text"
                  value={form.bank1Name}
                  onChange={update("bank1Name")}
                  className={fieldClass("bank1Name")}
                />
              </Field>
              <Field label="Account Name" required>
                <input
                  type="text"
                  value={form.bank1AccountName}
                  onChange={update("bank1AccountName")}
                  className={fieldClass("bank1AccountName")}
                />
              </Field>
              <Field label="Account Number" required>
                <input
                  type="text"
                  value={form.bank1AccountNumber}
                  onChange={update("bank1AccountNumber")}
                  className={fieldClass("bank1AccountNumber")}
                />
              </Field>
              <div />
              <Field label="Transaction Notification (Phone No)" required>
                <input
                  type="tel"
                  value={form.bank1NotifyPhone}
                  onChange={update("bank1NotifyPhone")}
                  className={fieldClass("bank1NotifyPhone")}
                />
              </Field>
              <Field label="Transaction Notification (Email Address)" required>
                <input
                  type="email"
                  value={form.bank1NotifyEmail}
                  onChange={update("bank1NotifyEmail")}
                  className={fieldClass("bank1NotifyEmail")}
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              13. Bank Details — Alternative (Optional)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Bank Name">
                <input
                  type="text"
                  value={form.bank2Name}
                  onChange={update("bank2Name")}
                  className={inputClass}
                />
              </Field>
              <Field label="Account Name">
                <input
                  type="text"
                  value={form.bank2AccountName}
                  onChange={update("bank2AccountName")}
                  className={inputClass}
                />
              </Field>
              <Field label="Account Number">
                <input
                  type="text"
                  value={form.bank2AccountNumber}
                  onChange={update("bank2AccountNumber")}
                  className={inputClass}
                />
              </Field>
              <div />
              <Field label="Transaction Notification (Phone No)">
                <input
                  type="tel"
                  value={form.bank2NotifyPhone}
                  onChange={update("bank2NotifyPhone")}
                  className={inputClass}
                />
              </Field>
              <Field label="Transaction Notification (Email Address)">
                <input
                  type="email"
                  value={form.bank2NotifyEmail}
                  onChange={update("bank2NotifyEmail")}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        </>
      )}

      {/* Step 5: Next of Kin */}
      {step.key === "nextOfKin" && (
        <section>
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            14. Next-of-Kin Details (Optional)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name (Title — Mr/Mrs)">
              <input
                type="text"
                value={form.nokName}
                onChange={update("nokName")}
                className={inputClass}
              />
            </Field>
            <Field label="Relationship / Phone No">
              <input
                type="text"
                value={form.nokRelationshipPhone}
                onChange={update("nokRelationshipPhone")}
                className={inputClass}
              />
            </Field>
            <Field label="Home Address">
              <input
                type="text"
                value={form.nokHomeAddress}
                onChange={update("nokHomeAddress")}
                className={inputClass}
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={form.nokEmail}
                onChange={update("nokEmail")}
                className={inputClass}
              />
            </Field>
          </div>
        </section>
      )}

      {/* Step 6: Declaration & Signature */}
      {step.key === "declaration" && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Declaration & Signature
          </h2>
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.confirmBankChange}
              onChange={update("confirmBankChange")}
              className="mt-1"
            />
            I hereby confirm that I will advise 5PM NEXUS INVEST if there are
            changes in the bank account details provided in this document.
          </label>
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.confirmTruthful}
              onChange={update("confirmTruthful")}
              className="mt-1"
            />
            I hereby confirm that all the information provided to 5PM NEXUS
            INVEST in this document are true.
          </label>
          {errors.confirmations && (
            <p className="text-xs text-red-500">{errors.confirmations}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Field label="Signature (type full name)" required>
              <input
                type="text"
                value={form.signatureName}
                onChange={update("signatureName")}
                className={fieldClass("signatureName")}
              />
              {errors.signatureName && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </Field>
            <Field label="Date" required>
              <input
                type="date"
                value={form.signatureDate}
                onChange={update("signatureDate")}
                className={fieldClass("signatureDate")}
              />
              {errors.signatureDate && (
                <p className="text-xs text-red-500 mt-1">Required</p>
              )}
            </Field>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold text-sm transition-colors"
          >
            {submitting ? "Submitting…" : "Submit Mandate Form"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="px-8 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
