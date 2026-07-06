import { useState, useEffect } from "react";
import { Search, Plus, AlertCircle, Edit3, Trash2 } from "lucide-react";
import { adminWealthApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Input, Modal } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const defaultForm = { name: "", registrationNumber: "", email: "", phone: "", address: "", contactPersonName: "", contactPersonPhone: "", contactPersonEmail: "" };

export default function AdminCooperatives() {
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminWealthApi.getCooperatives();
      setCooperatives(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setCooperatives([]);
      setError(err?.response?.data?.message || err.message || "Failed to load cooperatives");
      toast.error("Failed to load cooperatives");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name || "",
      registrationNumber: c.registrationNumber || "",
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      contactPersonName: c.contactPerson?.name || "",
      contactPersonPhone: c.contactPerson?.phone || "",
      contactPersonEmail: c.contactPerson?.email || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    const payload = {
      name: form.name,
      registrationNumber: form.registrationNumber || null,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      contactPerson: {
        name: form.contactPersonName || null,
        phone: form.contactPersonPhone || null,
        email: form.contactPersonEmail || null,
      },
    };
    try {
      if (editing) {
        await adminWealthApi.updateCooperative(editing.id, payload);
        toast.success("Cooperative updated");
      } else {
        await adminWealthApi.createCooperative(payload);
        toast.success("Cooperative created");
      }
      setShowModal(false);
      setForm(defaultForm);
      setEditing(null);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save cooperative");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminWealthApi.deleteCooperative(deleteTarget.id);
      toast.success("Cooperative deleted");
      setDeleteTarget(null);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete cooperative");
    } finally { setDeleting(false); }
  };

  const filtered = cooperatives.filter((c) => {
    const q = search.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cooperatives ({cooperatives.length})</h1>
        <Button onClick={openCreate} size="sm"><Plus size={16} /> Add Cooperative</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search cooperatives..." value={search} onChange={(e) => setSearch(e.target.value)}
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg. Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4 text-gray-500">{c.registrationNumber || "--"}</td>
                <td className="px-6 py-4 text-gray-600">{c.email || "--"}</td>
                <td className="px-6 py-4 text-gray-600">{c.phone || "--"}</td>
                <td className="px-6 py-4"><Badge variant={c.status === "active" ? "success" : "default"}>{c.status || "active"}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(c.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      <Edit3 size={14} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteTarget(c)}>
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No cooperatives found.</p>}
      </Card>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); setForm(defaultForm); }}
        title={editing ? "Edit Cooperative" : "Add Cooperative"} size="lg">
        <div className="space-y-4">
          <Input label="Cooperative Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Staff Cooperative Society" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} placeholder="Reg. no." />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="coop@example.com" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Office address" />
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Person</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Name" value={form.contactPersonName} onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })} />
              <Input label="Phone" value={form.contactPersonPhone} onChange={(e) => setForm({ ...form, contactPersonPhone: e.target.value })} />
              <Input label="Email" value={form.contactPersonEmail} onChange={(e) => setForm({ ...form, contactPersonEmail: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setShowModal(false); setEditing(null); setForm(defaultForm); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving ? "Saving..." : editing ? "Update Cooperative" : "Create Cooperative"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Cooperative" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
