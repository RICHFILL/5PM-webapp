import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Home, Plus, Trash2, Pencil, FileText, Image, Construction, Calendar, Upload, X, ExternalLink, Download } from "lucide-react";
import { adminApi, propertyUpdateApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");
const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const updateTypeIcon = (type) => {
  switch (type) {
    case "construction": return Construction;
    case "milestone": return Calendar;
    case "document": return FileText;
    case "media": return Image;
    default: return FileText;
  }
};

const defaultForm = { title: "", description: "", updateType: "general" };

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const fetch = async () => {
    try {
      const res = await adminApi.getPropertyDetail(id);
      setProperty(res?.data || res);
    } catch {
      setProperty(null);
      toast.error("Failed to load property details");
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await propertyUpdateApi.getUpdates(id);
      setUpdates(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setUpdates([]);
      toast.error("Failed to load property updates");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (id) {
      fetch();
      fetchUpdates();
    }
  }, [id]);

  const handleUploadFiles = async () => {
    if (newImages.length === 0 && newDocuments.length === 0) return;
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      newImages.forEach((f) => formData.append("images", f));
      newDocuments.forEach((f) => formData.append("documents", f));
      await adminApi.updateProperty(id, formData);
      setNewImages([]);
      setNewDocuments([]);
      toast.success("Files uploaded");
      fetch();
    } catch {
      toast.error("Failed to upload files");
    } finally { setUploadingFiles(false); }
  };

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editingUpdate) {
        await propertyUpdateApi.updateUpdate(id, editingUpdate.id, form);
        toast.success("Update edited");
      } else {
        await propertyUpdateApi.createUpdate(id, form);
        toast.success("Update created");
      }
      setShowModal(false);
      setEditingUpdate(null);
      setForm(defaultForm);
      fetchUpdates();
    } catch {
      toast.error(editingUpdate ? "Failed to edit update" : "Failed to create update");
    } finally { setSaving(false); }
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setForm({ title: update.title, description: update.description || "", updateType: update.updateType || "general" });
    setShowModal(true);
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm("Delete this update? This cannot be undone.")) return;
    try {
      await propertyUpdateApi.deleteUpdate(id, updateId);
      toast.success("Update deleted");
      fetchUpdates();
    } catch {
      toast.error("Failed to delete update");
    }
  };

  if (loading) {
    return <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-6 w-24" /><Skeleton className="h-48 w-full" /></div>;
  }

  if (!property) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <Card><p className="text-center text-gray-500 py-12">Property not found.</p></Card>
      </div>
    );
  }

  const Icon = updateTypeIcon;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6">
      <Link to="/admin/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-tangerine transition-colors">
        <ArrowLeft size={16} /> Back to Properties
      </Link>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{property.location || "Nigeria"}</p>
          </div>
          <Badge variant={property.status === "active" ? "success" : "default"} size="lg">{property.status || "active"}</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Price/Unit</p>
            <p className="text-lg font-bold text-gray-900">{formatNaira(property.unitPrice)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Units</p>
            <p className="text-lg font-bold text-gray-900">{property.availableUnits || 0} / {property.totalUnits || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Raised</p>
            <p className="text-lg font-bold text-neon-tangerine">{formatNaira(property.amountRaised)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-lg font-bold text-gray-900">{formatNaira(property.targetAmount)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Media & Documents</h2>

        {property.images?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Images ({property.images.length})</p>
            <div className="flex flex-wrap gap-3">
              {property.images.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 hover:border-neon-tangerine transition-colors">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {property.documents?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Documents ({property.documents.length})</p>
            <div className="space-y-2">
              {property.documents.map((doc, i) => (
                <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-neon-tangerine transition-colors group">
                  <FileText size={18} className="text-neon-tangerine shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{doc.name || `Document ${i + 1}`}</span>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-neon-tangerine" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Upload Additional Files</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <div>
              <input type="file" accept="image/jpeg,image/png" multiple ref={imageInputRef} onChange={(e) => setNewImages([...newImages, ...Array.from(e.target.files)])} className="hidden" />
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-neon-tangerine hover:text-neon-tangerine transition-colors">
                <Upload size={14} /> Add Images
              </button>
            </div>
            <div>
              <input type="file" accept="application/pdf" multiple ref={docInputRef} onChange={(e) => setNewDocuments([...newDocuments, ...Array.from(e.target.files)])} className="hidden" />
              <button type="button" onClick={() => docInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-neon-tangerine hover:text-neon-tangerine transition-colors">
                <Upload size={14} /> Add Documents
              </button>
            </div>
          </div>
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {newImages.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
                  <Image size={12} /><span className="max-w-[100px] truncate">{f.name}</span>
                  <button onClick={() => setNewImages(newImages.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          {newDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {newDocuments.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
                  <FileText size={12} /><span className="max-w-[100px] truncate">{f.name}</span>
                  <button onClick={() => setNewDocuments(newDocuments.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          {(newImages.length > 0 || newDocuments.length > 0) && (
            <Button size="sm" onClick={handleUploadFiles} disabled={uploadingFiles}>
              {uploadingFiles ? "Uploading..." : "Upload Files"}
            </Button>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Property Updates ({updates.length})</h2>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={16} /> Add Update</Button>
      </div>

      {updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((u) => {
            const TypeIcon = Icon(u.updateType);
            return (
              <Card key={u.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-dark-lavender/20 rounded-xl flex items-center justify-center shrink-0">
                      <TypeIcon size={18} className="text-dark-lavender/80" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{u.title}</h3>
                      {u.description && <p className="text-sm text-gray-600 mt-1">{u.description}</p>}
                      <p className="text-xs text-gray-500 mt-2">{formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.updateType === "construction" ? "info" : "default"} size="sm">{u.updateType}</Badge>
                    <button onClick={() => handleEdit(u)} className="p-1.5 text-gray-400 hover:text-neon-tangerine transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No updates yet. Add the first update.</p></Card>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); setEditingUpdate(null); }} title={editingUpdate ? "Edit Property Update" : "Add Property Update"} size="md">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Update title" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.updateType} onChange={(e) => setForm({ ...form, updateType: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none">
              <option value="general">General</option>
              <option value="construction">Construction</option>
              <option value="milestone">Milestone</option>
              <option value="document">Document</option>
              <option value="media">Media</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none" placeholder="Update details..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setForm(defaultForm); setEditingUpdate(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title}>
              {saving ? "Saving..." : editingUpdate ? "Save Changes" : "Add Update"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
