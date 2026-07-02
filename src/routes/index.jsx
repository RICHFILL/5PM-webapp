import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { AuthLayout, DashboardLayout, AdminLayout, PublicLayout } from '../layouts';
import { Spinner } from '../components/common';
import KycGuard from '../components/KycGuard';

// Public pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const AboutUs = lazy(() => import('../pages/public/AboutUs'));
const InvestmentOpportunities = lazy(() => import('../pages/public/InvestmentOpportunities'));
const HowItWorks = lazy(() => import('../pages/public/HowItWorks'));
const ContactUs = lazy(() => import('../pages/public/ContactUs'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const HelpCentre = lazy(() => import('../pages/public/HelpCentre'));
const HelpArticle = lazy(() => import('../pages/public/HelpArticle'));

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const VerifyPhone = lazy(() => import('../pages/auth/VerifyPhone'));
const TwoFactorAuth = lazy(() => import('../pages/auth/TwoFactorAuth'));

// Investor pages
const Dashboard = lazy(() => import('../pages/investor/Dashboard'));
const Marketplace = lazy(() => import('../pages/investor/Marketplace'));
const MyInvestments = lazy(() => import('../pages/investor/MyInvestments'));
const InvestDetail = lazy(() => import('../pages/investor/InvestDetail'));
const Wallet = lazy(() => import('../pages/investor/Wallet'));
const Profile = lazy(() => import('../pages/investor/Profile'));
const Calculator = lazy(() => import('../pages/investor/Calculator'));
const TermsConditions = lazy(() => import('../pages/investor/TermsConditions'));
const KycPage = lazy(() => import('../pages/investor/KycPage'));
const Properties = lazy(() => import('../pages/investor/Properties'));
const PropertyDetail = lazy(() => import('../pages/investor/PropertyDetail'));
const Portfolio = lazy(() => import('../pages/investor/Portfolio'));
const Reports = lazy(() => import('../pages/investor/Reports'));
const Notifications = lazy(() => import('../pages/investor/Notifications'));

// Investor pages: Wealth Plans
const WealthPlans = lazy(() => import('../pages/investor/WealthPlans'));
const WealthPlanDetail = lazy(() => import('../pages/investor/WealthPlanDetail'));
const CreateWealthPlan = lazy(() => import('../pages/investor/CreateWealthPlan'));

// Investor pages: Support
const SupportTickets = lazy(() => import('../pages/investor/SupportTickets'));
const TicketDetail = lazy(() => import('../pages/investor/TicketDetail'));
const CreateTicket = lazy(() => import('../pages/investor/CreateTicket'));

// Investor pages: Crowdfunding
const Crowdfunding = lazy(() => import('../pages/investor/Crowdfunding'));
const CampaignDetail = lazy(() => import('../pages/investor/CampaignDetail'));

// Investor pages: Phase 3
const Loans = lazy(() => import('../pages/investor/Loans'));
const LoanDetail = lazy(() => import('../pages/investor/LoanDetail'));
const ReitPools = lazy(() => import('../pages/investor/ReitPools'));
const MyTokens = lazy(() => import('../pages/investor/MyTokens'));
const TokenMarketplace = lazy(() => import('../pages/investor/TokenMarketplace'));
const AIAnalytics = lazy(() => import('../pages/investor/AIAnalytics'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('../pages/admin/AdminUserDetail'));
const AdminKyc = lazy(() => import('../pages/admin/AdminKyc'));
const AdminWallets = lazy(() => import('../pages/admin/AdminWallets'));
const AdminInvestments = lazy(() => import('../pages/admin/AdminInvestments'));
const AdminProperties = lazy(() => import('../pages/admin/AdminProperties'));
const AdminDistributions = lazy(() => import('../pages/admin/AdminDistributions'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminWealthPlans = lazy(() => import('../pages/admin/AdminWealthPlans'));
const AdminCooperatives = lazy(() => import('../pages/admin/AdminCooperatives'));
const AdminSupportTickets = lazy(() => import('../pages/admin/AdminSupportTickets'));
const AdminTicketDetail = lazy(() => import('../pages/admin/AdminTicketDetail'));
const AdminCampaigns = lazy(() => import('../pages/admin/AdminCampaigns'));
const AdminPropertyDetail = lazy(() => import('../pages/admin/AdminPropertyDetail'));
const AdminLoans = lazy(() => import('../pages/admin/AdminLoans'));
const AdminReit = lazy(() => import('../pages/admin/AdminReit'));
const AdminTokens = lazy(() => import('../pages/admin/AdminTokens'));
const AdminDeposits = lazy(() => import('../pages/admin/AdminDeposits'));
const AdminWithdrawals = lazy(() => import('../pages/admin/AdminWithdrawals'));
const AdminAuditLogs = lazy(() => import('../pages/admin/AdminAuditLogs'));
const InvestmentDetail = lazy(() => import('../pages/admin/InvestmentDetail'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Spinner size="lg" />
    </div>
  );
}

function PublicRoute({ children }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function ProtectedRoute({ children, requiredRole, kycGate = true }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />;
  if (kycGate) return <DashboardLayout><KycGuard>{children}</KycGuard></DashboardLayout>;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/about" element={<PublicRoute><AboutUs /></PublicRoute>} />
        <Route path="/opportunities" element={<PublicRoute><InvestmentOpportunities /></PublicRoute>} />
        <Route path="/how-it-works" element={<PublicRoute><HowItWorks /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><ContactUs /></PublicRoute>} />
        <Route path="/faq" element={<PublicRoute><FAQ /></PublicRoute>} />
        <Route path="/help" element={<PublicRoute><HelpCentre /></PublicRoute>} />
        <Route path="/help/:id" element={<PublicRoute><HelpArticle /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/terms" element={<PublicRoute><TermsConditions /></PublicRoute>} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : (
              <AuthLayout>
                <AdminLogin />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : (
              <AuthLayout>
                <Register />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmail />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-phone"
          element={
            <AuthLayout>
              <VerifyPhone />
            </AuthLayout>
          }
        />
        <Route
          path="/two-factor"
          element={
            <AuthLayout>
              <TwoFactorAuth />
            </AuthLayout>
          }
        />

        {/* Investor routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute kycGate={false}><KycPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportTickets /></ProtectedRoute>} />
        <Route path="/support/new" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
        <Route path="/support/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AIAnalytics /></ProtectedRoute>} />

        {/* KYC-gated routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><MyInvestments /></ProtectedRoute>} />
        <Route path="/investments/:id" element={<ProtectedRoute><InvestDetail /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/wealth-plans" element={<ProtectedRoute><WealthPlans /></ProtectedRoute>} />
        <Route path="/wealth-plans/create" element={<ProtectedRoute><CreateWealthPlan /></ProtectedRoute>} />
        <Route path="/wealth-plans/:id" element={<ProtectedRoute><WealthPlanDetail /></ProtectedRoute>} />
        <Route path="/crowdfunding" element={<ProtectedRoute><Crowdfunding /></ProtectedRoute>} />
        <Route path="/crowdfunding/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
        <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
        <Route path="/loans/:id" element={<ProtectedRoute><LoanDetail /></ProtectedRoute>} />
        <Route path="/reit" element={<ProtectedRoute><ReitPools /></ProtectedRoute>} />
        <Route path="/tokens" element={<ProtectedRoute><MyTokens /></ProtectedRoute>} />
        <Route path="/tokens/marketplace" element={<ProtectedRoute><TokenMarketplace /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/kyc" element={<AdminRoute><AdminKyc /></AdminRoute>} />
        <Route path="/admin/wallets" element={<AdminRoute><AdminWallets /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/investments" element={<AdminRoute><AdminInvestments /></AdminRoute>} />
        <Route path="/admin/investments/:id" element={<AdminRoute><InvestmentDetail /></AdminRoute>} />
        <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
        <Route path="/admin/distributions" element={<AdminRoute><AdminDistributions /></AdminRoute>} />
        <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
        <Route path="/admin/wealth-plans" element={<AdminRoute><AdminWealthPlans /></AdminRoute>} />
        <Route path="/admin/cooperatives" element={<AdminRoute><AdminCooperatives /></AdminRoute>} />
        <Route path="/admin/support" element={<AdminRoute><AdminSupportTickets /></AdminRoute>} />
        <Route path="/admin/support/:id" element={<AdminRoute><AdminTicketDetail /></AdminRoute>} />
        <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
        <Route path="/admin/properties/:id" element={<AdminRoute><AdminPropertyDetail /></AdminRoute>} />
        <Route path="/admin/loans" element={<AdminRoute><AdminLoans /></AdminRoute>} />
        <Route path="/admin/reit" element={<AdminRoute><AdminReit /></AdminRoute>} />
        <Route path="/admin/tokens" element={<AdminRoute><AdminTokens /></AdminRoute>} />
        <Route path="/admin/deposits" element={<AdminRoute><AdminDeposits /></AdminRoute>} />
        <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
        <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogs /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
