import React,{ useState, useEffect, useRef } from 'react';
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
  PiggyBank,
  Building,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Mail,
  Target,
  Banknote,
  Award,
  Brain,
  Landmark,
  ArrowUpDown,
  ClipboardList,
  Package,
  Settings,
  Phone,
  HelpCircle,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { notificationApi } from '../services/api';
import EmailVerificationModal from '../components/EmailVerificationModal';

const adminMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'User Management', icon: Users, path: '/admin/users' },
  { label: 'KYC Management', icon: Shield, path: '/admin/kyc' },
  { label: 'Wallet Management', icon: Wallet, path: '/admin/wallets' },
  { label: 'Investments', icon: TrendingUp, path: '/admin/investments' },
  { label: 'Investment Products', icon: Package, path: '/admin/investment-products' },
  { label: 'Properties', icon: Building2, path: '/admin/properties' },
  { label: 'Distributions', icon: Gift, path: '/admin/distributions' },
  { label: 'Crowdfunding', icon: Target, path: '/admin/campaigns' },
  { label: 'Wealth Plans', icon: PiggyBank, path: '/admin/wealth-plans' },
  { label: 'Cooperatives', icon: Building, path: '/admin/cooperatives' },
  { label: 'Loans', icon: Banknote, path: '/admin/loans' },
  { label: 'REIT Pools', icon: Building2, path: '/admin/reit' },
  { label: 'Token Registry', icon: Award, path: '/admin/tokens' },
  { label: 'Deposits', icon: Landmark, path: '/admin/deposits' },
  { label: 'Withdrawals', icon: ArrowUpDown, path: '/admin/withdrawals' },
  { label: 'Audit Logs', icon: ClipboardList, path: '/admin/audit-logs' },
  { label: 'Support', icon: MessageSquare, path: '/admin/support' },
  { label: 'Enquiries', icon: HelpCircle, path: '/admin/enquiries' },
  { label: 'Callbacks', icon: Phone, path: '/admin/callbacks' },
  { label: 'Reports', icon: FileBarChart, path: '/admin/reports' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);
  const { user, logout } = useAuthStore();

  const isActive = (path) => location.pathname === path;
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationApi.getNotifications();
        setNotifications(Array.isArray(res) ? res : res?.data ?? []);
      } catch { /* silent */ }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch { /* silent */ }
  };

  const needsVerification = user && !user.isVerified && !(
    location.pathname.startsWith('/verify-email') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register')
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative w-64 h-full bg-dark-lavender text-white transform transition-transform duration-300 z-50 md:z-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-lavender/80">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/assets/newlogo.png" alt="Logo" className="w-auto h-16 brightness-0 invert" />
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

        <div className="p-4 border-t border-dark-lavender/80 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-neon-tangerine flex items-center justify-center text-white font-bold text-xs">
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
          <div className="flex items-center gap-4 relative" ref={notifRef}>
            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                {notifications.length > 0 ? notifications.slice(0, 10).map((n) => (
                  <div key={n.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${n.read ? '' : 'bg-neon-tangerine/10'}`} onClick={() => handleMarkRead(n.id)}>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                )) : <p className="text-sm text-gray-400 text-center py-6">No notifications yet.</p>}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
