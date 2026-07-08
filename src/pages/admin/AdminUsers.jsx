import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mail, Phone, Shield, AlertCircle, Plus, Upload, Download } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Pagination, Button, Modal } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const [addModal, setAddModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "investor", status: "active" });
  const [submitting, setSubmitting] = useState(false);

  const filtered = search
    ? users.filter((u) => {
        const q = search.toLowerCase();
        return (u.firstName || "").toLowerCase().includes(q)
          || (u.lastName || "").toLowerCase().includes(q)
          || (u.email || "").toLowerCase().includes(q);
      })
    : users;

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const data = await adminApi.getUsers(params);
      setUsers(Array.isArray(data) ? data : data?.data ?? data?.users ?? []);
      const pg = data?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch (err) {
      setUsers([]);
      setError(err?.response?.data?.message || err.message || "Failed to load users");
      toast.error("Failed to load users");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminApi.createUser(form);
      toast.success(`User created — temp password: ${res.tempPassword}`, { duration: 8000 });
      setAddModal(false);
      setForm({ firstName: "", lastName: "", email: "", phone: "", role: "investor", status: "active" });
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to create user");
    } finally { setSubmitting(false); }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { toast.error("Please select a CSV file"); return; }
    const fd = new FormData();
    fd.append("file", file);
    setSubmitting(true);
    setImportResult(null);
    try {
      const res = await adminApi.importUsers(fd);
      setImportResult(res.data);
      toast.success(`Created ${res.data.created} user(s)`);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Import failed");
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">User Management ({users.length})</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => adminApi.downloadTemplate()}>
            <Download size={16} /> Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportModal(true)}>
            <Upload size={16} /> Import CSV
          </Button>
          <Button size="sm" onClick={() => setAddModal(true)}>
            <Plus size={16} /> Add User
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm" />
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button onClick={fetch} className="text-red-600 font-semibold hover:text-red-800">Retry</button>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-6">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u.id || u._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/users/${u.id || u._id}`)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neon-tangerine flex items-center justify-center text-white font-bold text-sm">
                      {(u.firstName?.[0] || "") + (u.lastName?.[0] || "")}
                    </div>
                    <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4 text-gray-600">{u.phone || "--"}</td>
                <td className="px-6 py-4">
                  <Badge variant={u.role === "admin" || u.role === "super_admin" ? "warning" : "default"}>{u.role || "user"}</Badge>
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No users found.</p>}
      </Card>

      <Pagination page={page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      {/* Add User Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add User" size="lg">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine">
                <option value="investor">Investor</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="finance_officer">Finance Officer</option>
                <option value="investment_manager">Investment Manager</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create User"}</Button>
          </div>
        </form>
      </Modal>

      {/* Import CSV Modal */}
      <Modal isOpen={importModal} onClose={() => { setImportModal(false); setImportResult(null); }} title="Import Users from CSV" size="lg">
        {importResult ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800">
              <AlertCircle size={16} />
              <span>Import completed — {importResult.created} created, {importResult.failed} failed</span>
            </div>
            {importResult.errors?.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-2">
                <p className="text-sm font-semibold text-gray-700">Errors ({importResult.errors.length}):</p>
                {importResult.errors.map((err, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-xs text-red-700">
                    <span className="font-medium">Row {err.row}:</span> {err.errors.join("; ")}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => { setImportModal(false); setImportResult(null); }}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CSV File *</label>
              <input ref={fileRef} type="file" accept=".csv" required
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neon-tangerine file:text-white hover:file:bg-neon-tangerine/80" />
            </div>
            <p className="text-xs text-gray-500">Required columns: firstName, lastName, email. Optional: phone, role, status.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setImportModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Importing..." : "Import"}</Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
