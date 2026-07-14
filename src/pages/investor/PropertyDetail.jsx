import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Home,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  FileText,
  Image,
  Construction,
  Calendar,
  ExternalLink,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { propertyApi, propertyUpdateApi } from "../../services/api";
import {
  Card,
  Skeleton,
  Badge,
  Button,
  Modal,
  Input,
} from "../../components/common";
import { formatNaira } from "../../utils/format";
import useAuth from "../../hooks/useAuth";
import AgreementSigningModal from "../../components/agreement/AgreementSigningModal";

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);
  const [showPurchase, setShowPurchase] = useState(false);
  const [units, setUnits] = useState(1);
  const [purchaseStep, setPurchaseStep] = useState("form");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);
  const [signaturePayload, setSignaturePayload] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const investorName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Investor";

  // Safely parse fields that may arrive as JSON strings or numeric strings from the API
  const normalizeProperty = (p) => ({
    ...p,
    images: safeParseArray(p.images),
    documents: safeParseArray(p.documents),
    unitPrice: toNumber(p.unitPrice ?? p.pricePerUnit ?? p.price),
    targetAmount: toNumber(p.targetAmount),
    amountRaised: toNumber(p.amountRaised),
    expectedROI: toNumber(p.expectedROI),
  });

  function safeParseArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyApi.getPropertyDetail(id);
        setProperty(normalizeProperty(data?.data || data));
      } catch (err) {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchUpdates = async () => {
      try {
        const res = await propertyUpdateApi.getUpdates(id);
        setUpdates(Array.isArray(res) ? res : (res?.data ?? []));
      } catch {
        setUpdates([]);
      }
    };
    if (id) {
      fetchProperty();
      fetchUpdates();
      setActiveImage(0);
    }
  }, [id]);

  const propertyName = property?.title || property?.name || "Property";
  const pricePerUnit = property?.unitPrice || 0;
  const totalCost = pricePerUnit * units;
  const maxUnits = property?.availableUnits ?? property?.units ?? 1;
  const isRequestMode = property?.investmentType === "request";
  const images = property?.images || [];

  const fundingPercent = property?.targetAmount
    ? Math.min(
        100,
        Math.round((property.amountRaised / property.targetAmount) * 100),
      )
    : 0;

  const statusVariant = ["available", "active"].includes(
    (property?.status || "").toLowerCase(),
  )
    ? "success"
    : "default";

  const handlePurchase = async () => {
    if (units < 1 || units > maxUnits) return;
    setPurchaseLoading(true);
    setPurchaseError("");
    try {
      await propertyApi.purchaseUnit(id, { units, totalAmount: totalCost });
      setPurchaseStep("confirmation");
    } catch (err) {
      setPurchaseError(
        err?.response?.data?.message || err.message || "Purchase failed",
      );
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleRequestInvestment = async () => {
    if (units < 1) return;
    setPurchaseLoading(true);
    setPurchaseError("");
    try {
      await propertyApi.requestInvestment(id, {
        desiredUnits: units,
        message: requestMessage,
      });
      setPurchaseStep("requestConfirmation");
    } catch (err) {
      setPurchaseError(
        err?.response?.data?.message || err.message || "Request failed",
      );
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleAgreementConfirm = async (payload) => {
    setSignaturePayload(payload);
    setPurchaseLoading(true);
    setPurchaseError("");
    try {
      if (isRequestMode) {
        await propertyApi.requestInvestment(id, {
          desiredUnits: units,
          message: requestMessage,
          agreement: payload,
        });
        setPurchaseStep("requestConfirmation");
      } else {
        await propertyApi.purchaseUnit(id, {
          units,
          totalAmount: totalCost,
          agreement: payload,
        });
        setPurchaseStep("confirmation");
      }
      setShowAgreement(false);
    } catch (err) {
      setPurchaseError(
        err?.response?.data?.message || err.message || "Submission failed",
      );
      setShowAgreement(false);
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-64 md:h-[420px] w-full rounded-2xl" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-lg" />
          ))}
        </div>
        <Skeleton.Card />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card>
          <p className="text-center text-gray-500 py-12">Property not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link
        to="/properties"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors"
      >
        <ArrowLeft size={16} /> Back to Properties
      </Link>

      {/* Image gallery */}
      <div className="space-y-3">
        <div className="relative h-64 md:h-[420px] rounded-2xl bg-dark-lavender overflow-hidden group">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={`${propertyName} — image ${activeImage + 1}`}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home size={64} className="text-white/60" />
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setActiveImage((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
              >
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                {activeImage + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeImage
                    ? "border-neon-tangerine"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {propertyName}
                </h1>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span>
                    {property.location && property.location !== "unknown"
                      ? property.location
                      : "Nigeria"}
                  </span>
                </div>
              </div>
              <Badge
                variant={statusVariant}
                size="lg"
                className="capitalize shrink-0"
              >
                {property.status || "Available"}
              </Badge>
            </div>
            {property.description ? (
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">
                No description available.
              </p>
            )}
          </Card>

          {property.features?.length > 0 && (
            <Card className="h-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {property.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-green-500 shrink-0"
                    />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {property.documents?.length > 0 && (
            <Card className="h-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Documents
              </h3>
              <div className="space-y-3">
                {property.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-neon-tangerine transition-colors group"
                  >
                    <FileText
                      size={20}
                      className="text-neon-tangerine shrink-0"
                    />
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {doc.name || `Document ${i + 1}`}
                    </span>
                    <ExternalLink
                      size={16}
                      className="text-gray-400 group-hover:text-neon-tangerine"
                    />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {updates.length > 0 && (
            <Card className="h-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Updates
              </h3>
              <div className="space-y-4">
                {updates.map((u) => {
                  const TypeIcon =
                    u.updateType === "construction"
                      ? Construction
                      : u.updateType === "milestone"
                        ? Calendar
                        : u.updateType === "document"
                          ? FileText
                          : u.updateType === "media"
                            ? Image
                            : FileText;
                  return (
                    <div
                      key={u.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 bg-dark-lavender/20 rounded-xl flex items-center justify-center shrink-0">
                        <TypeIcon size={18} className="text-dark-lavender/80" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {u.title}
                        </p>
                        {u.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {u.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(u.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="h-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Investment Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price Per Unit
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {!isRequestMode && pricePerUnit
                    ? formatNaira(pricePerUnit)
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Expected ROI
                </p>
                <p className="text-lg md:text-xl font-semibold text-neon-tangerine">
                  {property.expectedROI ? `${property.expectedROI}%` : "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Available Units
                </p>
                <p className="text-lg md:text-xl font-semibold text-gray-900">
                  {maxUnits}
                </p>
              </div>

              {property.targetAmount > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Funding Progress</span>
                    <span className="font-medium text-gray-700">
                      {fundingPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-tangerine rounded-full transition-all"
                      style={{ width: `${fundingPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatNaira(property.amountRaised)} raised</span>
                    <span>{formatNaira(property.targetAmount)} goal</span>
                  </div>
                </div>
              )}

              {isRequestMode ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowPurchase(true);
                    setPurchaseStep("form");
                    setUnits(1);
                    setRequestMessage("");
                  }}
                  disabled={maxUnits < 1}
                >
                  <Send size={16} /> Request to Invest
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowPurchase(true);
                    setPurchaseStep("form");
                    setUnits(1);
                  }}
                  disabled={maxUnits < 1}
                >
                  Purchase Units
                </Button>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <TrendingUp
                size={20}
                className="text-neon-tangerine mx-auto mb-1"
              />
              <p className="text-xs text-gray-500">Target Amount</p>
              <p className="text-sm font-bold text-gray-900">
                {formatNaira(property.targetAmount)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <Users size={20} className="text-neon-tangerine mx-auto mb-1" />
              <p className="text-xs text-gray-500">Investors</p>
              <p className="text-sm font-bold text-gray-900">
                {property.investorCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPurchase}
        onClose={() => setShowPurchase(false)}
        title={
          purchaseStep === "form"
            ? isRequestMode
              ? "Request to Invest"
              : "Purchase Units"
            : isRequestMode
              ? "Request Submitted"
              : "Purchase Confirmed"
        }
        size="lg"
      >
        {purchaseStep === "form" ? (
          <div className="space-y-4">
            <div className="bg-dark-lavender/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Property</span>
                <span className="font-semibold">{propertyName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-semibold">{maxUnits} units</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setUnits(Math.max(1, units - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={units}
                  onChange={(e) =>
                    setUnits(
                      Math.min(
                        maxUnits,
                        Math.max(1, Number(e.target.value) || 1),
                      ),
                    )
                  }
                  min={1}
                  max={maxUnits}
                  className="w-20 text-center text-lg font-bold border border-gray-200 rounded-lg py-2 focus:border-neon-tangerine outline-none"
                />
                <button
                  type="button"
                  onClick={() => setUnits(Math.min(maxUnits, units + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {isRequestMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none"
                  placeholder="Add a note for the admin..."
                />
              </div>
            )}

            {!isRequestMode && (
              <div className="bg-neon-tangerine/10 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="text-lg md:text-xl font-bold text-neon-tangerine/80">
                    {formatNaira(totalCost)}
                  </span>
                </div>
              </div>
            )}

            {purchaseError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {purchaseError}
              </p>
            )}

            <Button
              className="w-full"
              onClick={() => setShowAgreement(true)}
              disabled={purchaseLoading || units < 1 || units > maxUnits}
            >
              {purchaseLoading
                ? isRequestMode
                  ? "Submitting..."
                  : "Processing..."
                : isRequestMode
                  ? `Submit Request for ${units} Unit${units > 1 ? "s" : ""}`
                  : `Purchase ${units} Unit${units > 1 ? "s" : ""}`}
            </Button>
          </div>
        ) : purchaseStep === "requestConfirmation" ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-dark-lavender/20 rounded-full flex items-center justify-center">
              <Send className="text-dark-lavender" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Request Submitted!
            </h3>
            <p className="text-sm text-gray-600">
              Your request to invest in {propertyName} has been sent. An admin
              will contact you shortly.
            </p>
            <Button onClick={() => setShowPurchase(false)} variant="secondary">
              Done
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Purchase Successful!
            </h3>
            <p className="text-sm text-gray-600">
              You have purchased {units} unit{units > 1 ? "s" : ""} in{" "}
              {propertyName} for {formatNaira(totalCost)}.
            </p>
            <Button onClick={() => setShowPurchase(false)} variant="secondary">
              Done
            </Button>
          </div>
        )}
      </Modal>

      <AgreementSigningModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        onConfirm={handleAgreementConfirm}
        investorName={investorName}
        principalAmount={totalCost}
        currency="NGN"
        tenorMonths={property.tenure}
        monthlyRatePercent={property.expectedROI}
        propertyName={propertyName}
        submitting={purchaseLoading}
      />
    </div>
  );
}
