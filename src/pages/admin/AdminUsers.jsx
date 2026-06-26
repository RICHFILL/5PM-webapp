import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mail, Phone, Shield } from "lucide-react";
import { adminApi } from "../../services/api";
import { Card, Skeleton, Badge, Input } from "../../components/common";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminApi.getUsers();
        setUsers(Array.isArray(data) ? data : data?.data ?? data?.users ?? []);
      } catch (err) {
        setUsers([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.firstName || "").toLowerCase().includes(q)
      || (u.lastName || "").toLowerCase().includes(q)
      || (u.email || "").toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={8} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management ({users.length})</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm" />
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
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
                    <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                      {(u.firstName?.[0] || "") + (u.lastName?.[0] || "")}
                    </div>
                    <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4 text-gray-600">{u.phone || "--"}</td>
                <td className="px-6 py-4">
                  <Badge variant={u.role === "admin" ? "warning" : "default"}>{u.role || "user"}</Badge>
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-center py-12">No users found.</p>}
      </Card>
    </div>
  );
}
