import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Wallet,
  TrendingUp,
  Building2,
  Gift,
  FileBarChart,
  Bell,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const adminMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'User Management', icon: Users, path: '/admin/users' },
  { label: 'KYC Management', icon: Shield, path: '/admin/kyc' },
  { label: 'Wallet Management', icon: Wallet, path: '/admin/wallets' },
  { label: 'Investments', icon: TrendingUp, path: '/admin/investments' },
  { label: 'Properties', icon: Building2, path: '/admin/properties' },
  { label: 'Distributions', icon: Gift, path: '/admin/distributions' },
  { label: 'Reports', icon: FileBarChart, path: '/admin/reports' },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (path) => location.pathname === path;
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative w-64 h-full bg-navy-900 text-white transform transition-transform duration-300 z-50 md:z-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-navy-700">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Logo" className="w-16 lg:w-24 h-auto brightness-0 invert" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                isActive(item.path)
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-700 space-y-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
