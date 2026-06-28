import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Plus, MapPin, DollarSign, Home, X } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";

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

  const fetch = async () => {
    try {
      const data = await adminApi.getProperties();
      setProperties(Array.isArray(data) ? data : data?.data ?? data?.properties ?? []);
    } catch (err) {
      setProperties([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.targetAmount || !form.totalUnits || !form.unitPrice) return;
    setSaving(true);
    try {
      await adminApi.createProperty({
        title: form.title,
        description: form.description,
        location: form.location,
        targetAmount: parseFloat(form.targetAmount),
        totalUnits: parseInt(form.totalUnits),
        unitPrice: parseFloat(form.unitPrice),
        expectedROI: form.expectedROI ? parseFloat(form.expectedROI) : null,
        duration: form.duration ? parseInt(form.duration) : null,
      });
      setShowModal(false);
      setForm(defaultForm);
      fetch();
    } catch (err) { /* silent */ }
    finally { setSaving(false); }
  };

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return (p.title || "").toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={6} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Properties ({properties.length})</h1>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={16} /> Add Property</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      <div className="overflow-x-auto -mx-6">
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); }} title="Add New Property" size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property name" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Amount (₦)" type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="e.g. 50000000" />
            <Input label="Unit Price (₦)" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} placeholder="e.g. 500000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Units" type="number" value={form.totalUnits} onChange={(e) => setForm({ ...form, totalUnits: e.target.value })} placeholder="e.g. 100" />
            <Input label="Expected ROI (%)" type="number" value={form.expectedROI} onChange={(e) => setForm({ ...form, expectedROI: e.target.value })} placeholder="e.g. 15" />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Property location" />
          <Input label="Duration (months)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none" placeholder="Property description" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.targetAmount || !form.totalUnits || !form.unitPrice}>
              {saving ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
