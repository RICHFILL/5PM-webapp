import { useState, useEffect } from "react";
import { Search, Plus, AlertCircle, Edit3, Archive, Package } from "lucide-react";
import { adminProductApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";
import { formatNaira } from '../../utils/format';

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "active": return "success";
    case "paused": return "warning";
    case "archived": return "default";
    default: return "default";
  }
};

const defaultForm = {
  name: "", description: "", features: "", tag: "",
  minimumInvestment: "", minUSD: "", expectedROI: "", roiDisplay: "",
  duration: "", status: "active"
};

export default function AdminInvestmentProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminProductApi.getAll({ status: statusFilter });
      setProducts(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setProducts([]);
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const resetForm = () => {
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.minimumInvestment || !form.expectedROI || !form.duration) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("features", JSON.stringify(form.features.split("\n").map(f => f.trim()).filter(Boolean)));
      fd.append("tag", form.tag);
      fd.append("minimumInvestment", form.minimumInvestment);
      fd.append("minUSD", form.minUSD);
      fd.append("expectedROI", form.expectedROI);
      fd.append("roiDisplay", form.roiDisplay);
      fd.append("duration", form.duration);
      fd.append("status", form.status);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminProductApi.update(editing.id, fd);
        toast.success("Product updated");
      } else {
        await adminProductApi.create(fd);
        toast.success("Product created");
      }
      setShowModal(false);
      resetForm();
      fetch();
    } catch (err) {
      toast.error(editing ? "Failed to update product" : "Failed to create product");
    } finally { setSaving(false); }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join("\n") : "",
      tag: product.tag || "",
      minimumInvestment: product.minimumInvestment?.toString() || "",
      minUSD: product.minUSD || "",
      expectedROI: product.expectedROI?.toString() || "",
      roiDisplay: product.roiDisplay || "",
      duration: product.duration?.toString() || "",
      status: product.status || "active",
    });
    setImagePreview(product.image || null);
    setShowModal(true);
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this product? It will no longer be available for investment.")) return;
    setArchiving(id);
    try {
      await adminProductApi.archive(id);
      toast.success("Product archived");
      fetch();
    } catch {
      toast.error("Failed to archive product");
    } finally { setArchiving(null); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filtered = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Investment Products ({products.length})</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }} size="sm"><Plus size={16} /> Add Product</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "active", "paused", "archived"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${statusFilter === s ? "bg-neon-tangerine text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800 underline">Retry</button>
        </div>
      )}

      <div className="overflow-x-auto -mx-6">
        <Card className="p-0">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tag</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Min Investment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      )}
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold text-neon-tangerine uppercase">{p.tag || "--"}</span></td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.roiDisplay || `${p.expectedROI}%`}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatNaira(p.minimumInvestment)}
                    {p.minUSD && <span className="text-gray-400 ml-1">({p.minUSD})</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.duration} months</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(p)} title="Edit"><Edit3 size={14} /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleArchive(p.id)} disabled={archiving === p.id || p.status === "archived"} title="Archive">
                        <Archive size={14} className={p.status === "archived" ? "text-gray-300" : "text-red-500"} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No products found.</p>}
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nexus Income Vault" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Tag / Category" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Managed Fund" />
            <Input label="Duration (months) *" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Minimum Investment (NGN) *" type="number" value={form.minimumInvestment} onChange={(e) => setForm({ ...form, minimumInvestment: e.target.value })} placeholder="e.g. 10000000" />
            <Input label="Min Investment (USD display)" value={form.minUSD} onChange={(e) => setForm({ ...form, minUSD: e.target.value })} placeholder="e.g. $7,000" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Expected ROI (%) *" type="number" value={form.expectedROI} onChange={(e) => setForm({ ...form, expectedROI: e.target.value })} placeholder="e.g. 3.5" />
            <Input label="ROI Display Text" value={form.roiDisplay} onChange={(e) => setForm({ ...form, roiDisplay: e.target.value })} placeholder="e.g. Up to 3.5% monthly" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none"
              placeholder="Product description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none"
              placeholder="Monthly returns up to 3.5%&#10;Asset-backed capital preservation&#10;Position confirmed upon fund deployment" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neon-tangerine/10 file:text-neon-tangerine hover:file:bg-neon-tangerine/20" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded-lg border" />
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.minimumInvestment || !form.expectedROI || !form.duration}>
              {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
