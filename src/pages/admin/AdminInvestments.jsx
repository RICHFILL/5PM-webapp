import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  AlertCircle,
  DollarSign,
  View,
  Plus,
  ChevronDown,
  Loader,
} from "lucide-react";
import { adminApi, adminProductApi } from "../../services/api";
import { Card, Skeleton, Badge, Pagination, Button, Modal, Input } from "../../components/common";
import AmountUpdateModal from "../../components/common/AmountUpdateModal";
import toast from "react-hot-toast";
import { formatCurrencyAmount } from "../../utils/currency";

const INTEREST_RATES = [3.5, 4, 5, 7];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "--";

const statusVariant = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "info";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

const currencyVariant = (currency) => (currency === "USD" ? "info" : "default");

function SearchableSelect({ label, options, value, onChange, search, onSearchChange, showDropdown, onToggle, placeholder, renderOption, getDisplayValue, loading }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine">
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? getDisplayValue(value) : placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </button>
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-neon-tangerine" autoFocus />
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
              <Loader size={14} className="animate-spin mr-2" /> Loading...
            </div>
          ) : options.length === 0 ? (
            <p className="text-center text-gray-400 py-4 text-sm">No results found.</p>
          ) : (
            options.map((opt) => (
              <button key={opt.id || opt._id} type="button"
                onClick={() => { onChange(opt); onToggle(); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neon-tangerine/10 transition-colors ${(value?.id || value?._id) === (opt.id || opt._id) ? "bg-neon-tangerine/10 font-semibold" : ""}`}>
                {renderOption(opt)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminInvestments() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [amountModal, setAmountModal] = useState({ open: false, investment: null });

  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState(null);
  const [currency, setCurrency] = useState("NGN");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getInvestments({ page, limit: 20 });
      setInvestments(
        Array.isArray(data) ? data : (data?.data ?? data?.investments ?? []),
      );
      const pg = data?.pagination;
      if (pg) setPagination({ total: pg.total, pages: pg.pages });
    } catch (err) {
      setInvestments([]);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load investments",
      );
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page]);

  const openCreateModal = async () => {
    setShowCreate(true);
    setSelectedUser(null);
    setSelectedProduct(null);
    setAmount("");
    setInterestRate(null);
    setCurrency("NGN");
    setUserSearch("");
    setProductSearch("");

    setLoadingUsers(true);
    setLoadingProducts(true);
    try {
      const [usersRes, productsRes] = await Promise.all([
        adminApi.getUsers({ limit: 100 }),
        adminProductApi.getAll({ status: "active" }),
      ]);
      setUsers(Array.isArray(usersRes) ? usersRes : usersRes?.data ?? []);
      setProducts(Array.isArray(productsRes) ? productsRes : productsRes?.data ?? []);
    } catch {
      toast.error("Failed to load form data");
    } finally {
      setLoadingUsers(false);
      setLoadingProducts(false);
    }
  };

  const resetCreateForm = () => {
    setShowCreate(false);
    setSelectedUser(null);
    setSelectedProduct(null);
    setAmount("");
    setInterestRate(null);
    setCurrency("NGN");
    setUserSearch("");
    setProductSearch("");
    setShowUserDropdown(false);
    setShowProductDropdown(false);
  };

  const handleCreate = async () => {
    if (!selectedUser || !selectedProduct || !amount || interestRate === null) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await adminApi.createInvestment({
        user: selectedUser.id || selectedUser._id,
        productId: selectedProduct?.id || selectedProduct?._id || null,
        amount: parseFloat(amount),
        interestRatePerAnnum: interestRate,
        currency,
      });
      toast.success("Investment created successfully");
      resetCreateForm();
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create investment");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      (u.firstName || "").toLowerCase().includes(q) ||
      (u.lastName || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (p.name || "").toLowerCase().includes(q);
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    const rate = parseFloat(product.expectedROI);
    if (INTEREST_RATES.includes(rate)) {
      setInterestRate(rate);
    }
  };

  const filtered = investments.filter((inv) => {
    const q = search.toLowerCase();
    return (
      (inv.refNumber || "").toLowerCase().includes(q) ||
      (inv.investor?.firstName || "").toLowerCase().includes(q) ||
      (inv.investor?.lastName || "").toLowerCase().includes(q) ||
      (inv.investor?.email || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Table rows={8} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          All Investments ({investments.length})
        </h1>
        <Button onClick={openCreateModal} size="sm">
          <Plus size={16} /> Create Investment
        </Button>
      </div>
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by reference or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none text-sm"
        />
      </div>
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button
            onClick={fetch}
            className="text-red-600 font-semibold hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  End
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv) => (
                <tr
                  key={inv.id || inv._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.refNumber || "--"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {inv.investor?.firstName || inv.user?.firstName || ""}{" "}
                    {inv.investor?.lastName || inv.user?.lastName || ""}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {formatCurrencyAmount(inv.amount, inv.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={currencyVariant(inv.currency)}>
                      {inv.currency || "NGN"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant(inv.status)}>
                      {inv.status || "pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(inv.startDate)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(inv.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/investments/${inv.id || inv._id}`)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <View size={14} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setAmountModal({ open: true, investment: inv });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-tangerine hover:text-neon-tangerine/80 transition-colors ml-3"
                    >
                      <DollarSign size={14} />
                      Edit Amount
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No investments found.
          </p>
        )}
      </Card>
      <Pagination
        page={page}
        pages={pagination.pages}
        total={pagination.total}
        onPageChange={setPage}
      />

      <AmountUpdateModal
        open={amountModal.open}
        onClose={() => setAmountModal({ open: false, investment: null })}
        investment={amountModal.investment}
        onSuccess={fetch}
      />

      <Modal isOpen={showCreate} onClose={resetCreateForm} title="Create Investment" size="lg">
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">

          <SearchableSelect
            label="User *"
            placeholder="Select a user..."
            value={selectedUser}
            options={filteredUsers}
            search={userSearch}
            onSearchChange={setUserSearch}
            showDropdown={showUserDropdown}
            onToggle={() => { setShowUserDropdown(!showUserDropdown); setUserSearch(""); }}
            loading={loadingUsers}
            onChange={(u) => setSelectedUser(u)}
            getDisplayValue={(u) => `${u.firstName} ${u.lastName} (${u.email})`}
            renderOption={(u) => (
              <div>
                <span className="text-gray-900 font-medium">{u.firstName} {u.lastName}</span>
                <span className="text-gray-500 ml-2 text-xs">{u.email}</span>
              </div>
            )}
          />

          <SearchableSelect
            label="Investment Product *"
            placeholder="Select a product..."
            value={selectedProduct}
            options={filteredProducts}
            search={productSearch}
            onSearchChange={setProductSearch}
            showDropdown={showProductDropdown}
            onToggle={() => { setShowProductDropdown(!showProductDropdown); setProductSearch(""); }}
            loading={loadingProducts}
            getDisplayValue={(p) => `${p.name} (${p.roiDisplay || p.expectedROI + '%'}, ${p.duration}mo)`}
            renderOption={(p) => (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 font-medium">{p.name}</span>
                  <span className="text-gray-500 ml-2 text-xs">{p.duration} months</span>
                </div>
                <span className="text-neon-tangerine font-semibold text-xs">{p.roiDisplay || `${p.expectedROI}%`}</span>
              </div>
            )}
            onChange={handleProductSelect}
          />

          <Input
            label="Amount *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={currency === "NGN" ? "e.g. 1000000" : "e.g. 10000"}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate *</label>
            <div className="flex gap-2">
              {INTEREST_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setInterestRate(rate)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                    interestRate === rate
                      ? "bg-neon-tangerine text-white border-neon-tangerine"
                      : "bg-white text-gray-700 border-gray-200 hover:border-neon-tangerine/40"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <div className="flex gap-2">
              {["NGN", "USD"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                    currency === c
                      ? "bg-dark-lavender text-white border-dark-lavender"
                      : "bg-white text-gray-700 border-gray-200 hover:border-dark-lavender/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={resetCreateForm}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving || !selectedUser || !selectedProduct || !amount || interestRate === null}>
              {saving ? (
                <><Loader size={16} className="animate-spin mr-1" /> Creating...</>
              ) : (
                "Create Investment"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
