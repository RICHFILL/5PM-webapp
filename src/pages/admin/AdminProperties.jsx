import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Plus, AlertCircle, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "active": return "success";
    case "fully_funded": return "info";
    case "completed": return "default";
    case "cancelled": return "danger";
    default: return "default";
  }
};

const defaultForm = { title: "", description: "", location: "", targetAmount: "", totalUnits: "", unitPrice: "", expectedROI: "", duration: "" };

export default function AdminProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getProperties();
      setProperties(Array.isArray(data) ? data : data?.data ?? data?.properties ?? []);
    } catch (err) {
      setProperties([]);
      setError(err?.response?.data?.message || err.message || "Failed to load properties");
      toast.error("Failed to load properties");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.targetAmount || !form.totalUnits || !form.unitPrice) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("targetAmount", parseFloat(form.targetAmount));
      formData.append("totalUnits", parseInt(form.totalUnits));
      formData.append("unitPrice", parseFloat(form.unitPrice));
      if (form.expectedROI) formData.append("expectedROI", parseFloat(form.expectedROI));
      if (form.duration) formData.append("duration", parseInt(form.duration));
      images.forEach((file) => formData.append("images", file));
      documents.forEach((file) => formData.append("documents", file));

      await adminApi.createProperty(formData);
      setShowModal(false);
      setForm(defaultForm);
      setImages([]);
      setDocuments([]);
      toast.success("Property created");
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create property");
    }
    finally { setSaving(false); }
  };

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return (p.title || "").toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Properties ({properties.length})</h1>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={16} /> Add Property</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
      </div>
      <div className="overflow-x-auto -mx-6">
        {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}
      <Card className="p-0">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price/Unit</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Raised</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
                <tr key={p.id || p._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/properties/${p.id || p._id}`)}>
                <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                <td className="px-6 py-4 text-gray-500">{p.location || "--"}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(p.unitPrice)}</td>
                <td className="px-6 py-4 text-gray-600">{p.availableUnits || 0} / {p.totalUnits || 0}</td>
                <td className="px-6 py-4 text-gray-600">{formatNaira(p.amountRaised)} / {formatNaira(p.targetAmount)}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant(p.status)}>{p.status || "active"}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No properties found.</p>}
      </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); setImages([]); setDocuments([]); }} title="Add New Property" size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property name" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Target Amount (₦)" type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="e.g. 50000000" />
            <Input label="Unit Price (₦)" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} placeholder="e.g. 500000" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Total Units" type="number" value={form.totalUnits} onChange={(e) => setForm({ ...form, totalUnits: e.target.value })} placeholder="e.g. 100" />
            <Input label="Expected ROI (%)" type="number" value={form.expectedROI} onChange={(e) => setForm({ ...form, expectedROI: e.target.value })} placeholder="e.g. 3.5" />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Property location" />
          <Input label="Duration (months)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none" placeholder="Property description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Images <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/jpeg,image/png" multiple ref={imageInputRef} onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} className="hidden" />
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-neon-tangerine hover:text-neon-tangerine transition-colors">
                <Upload size={16} /> Choose Images
              </button>
              {images.length > 0 && <span className="text-sm text-gray-500">{images.length} file(s) selected</span>}
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
                    <ImageIcon size={12} />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documents (PDF) <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="flex items-center gap-3">
              <input type="file" accept="application/pdf" multiple ref={docInputRef} onChange={(e) => setDocuments([...documents, ...Array.from(e.target.files)])} className="hidden" />
              <button type="button" onClick={() => docInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-neon-tangerine hover:text-neon-tangerine transition-colors">
                <Upload size={16} /> Choose Documents
              </button>
              {documents.length > 0 && <span className="text-sm text-gray-500">{documents.length} file(s) selected</span>}
            </div>
            {documents.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {documents.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
                    <FileText size={12} />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button onClick={() => setDocuments(documents.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); setImages([]); setDocuments([]); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.targetAmount || !form.totalUnits || !form.unitPrice}>
              {saving ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
