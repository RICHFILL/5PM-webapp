import { useState, useEffect } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
import { adminReitApi } from "../../services/api";
import { Card, Skeleton, Badge, Button, Modal, Input } from "../../components/common";
import toast from "react-hot-toast";
import { formatNaira } from '../../utils/format';

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const defaultForm = { name: "", description: "", totalShares: "", sharePrice: "", annualYield: "3.5" };

export default function AdminReit() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [distribPool, setDistribPool] = useState(null);
  const [distribAmount, setDistribAmount] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminReitApi.getAllPools();
      setPools(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setPools([]);
      setError("Failed to load REIT pools");
      toast.error("Failed to load REIT pools");
    } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.totalShares || !form.sharePrice) return;
    setSaving(true);
    try {
      await adminReitApi.createPool({
        name: form.name, description: form.description,
        totalShares: parseFloat(form.totalShares), sharePrice: parseFloat(form.sharePrice),
        annualYield: parseFloat(form.annualYield),
      });
      setShowModal(false); setForm(defaultForm);
      toast.success("Pool created");
      fetch();
    } catch {
      toast.error("Failed to create pool");
    } finally { setSaving(false); }
  };

  const handleDistribute = async () => {
    if (!distribAmount) return;
    setSaving(true);
    try {
      await adminReitApi.createDistribution(distribPool.id, { amount: parseFloat(distribAmount), date: new Date().toISOString().split('T')[0] });
      setDistribPool(null); setDistribAmount("");
      toast.success("Distribution recorded");
      fetch();
    } catch {
      toast.error("Failed to record distribution");
    } finally { setSaving(false); }
  };

  const filtered = pools.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">REIT Pools ({pools.length})</h1>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={16} /> Create Pool</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search pools..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine outline-none text-sm" />
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
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pool</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Share Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shares</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Yield</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatNaira(p.sharePrice)}</td>
                <td className="px-6 py-4 text-gray-600">{p.availableShares} / {p.totalShares}</td>
                <td className="px-6 py-4 text-purple-600 font-semibold">{p.annualYield}%</td>
                <td className="px-6 py-4"><Badge variant={p.status === "open" ? "success" : "default"}>{p.status}</Badge></td>
                <td className="px-6 py-4 text-gray-500">{formatDate(p.createdAt)}</td>
                <td className="px-6 py-4">
                  <Button size="sm" variant="outline" onClick={() => { setDistribPool(p); setDistribAmount(""); }}>Distribute</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No pools found.</p>}
      </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setForm(defaultForm); }} title="Create REIT Pool" size="lg">
        <div className="space-y-4">
          <Input label="Pool Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Total Shares" type="number" value={form.totalShares} onChange={(e) => setForm({ ...form, totalShares: e.target.value })} />
            <Input label="Share Price (Ã¢â€šÂ¦)" type="number" value={form.sharePrice} onChange={(e) => setForm({ ...form, sharePrice: e.target.value })} />
            <Input label="Annual Yield (%)" type="number" value={form.annualYield} onChange={(e) => setForm({ ...form, annualYield: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.totalShares || !form.sharePrice}>Create Pool</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!distribPool} onClose={() => setDistribPool(null)} title="Record Distribution" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Pool: {distribPool?.name}</p>
          <Input label="Amount (Ã¢â€šÂ¦)" type="number" value={distribAmount} onChange={(e) => setDistribAmount(e.target.value)} />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDistribPool(null)}>Cancel</Button>
            <Button onClick={handleDistribute} disabled={saving || !distribAmount}>Record</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
