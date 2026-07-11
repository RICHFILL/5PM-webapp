export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://maroon-hummingbird-953551.hostingersite.com/api/v1';
//'http://localhost:5056/api/v1';

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  INVESTMENT_OPPORTUNITIES: '/opportunities',
  HOW_IT_WORKS: '/how-it-works',
  CONTACT: '/contact',
  HELP: '/help',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_PHONE: '/verify-phone',
  TWO_FACTOR: '/two-factor',
  // Investor
  DASHBOARD: '/dashboard',
  INVESTMENTS: '/investments',
  INVESTMENT_DETAIL: '/investments/:id',
  WALLET: '/wallet',
  PROFILE: '/profile',
  CALCULATOR: '/calculator',
  KYC: '/kyc',
  MARKETPLACE: '/marketplace',
  PORTFOLIO: '/portfolio',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_KYC: '/admin/kyc',
  ADMIN_KYC_REVIEW: '/admin/kyc/:id',
  ADMIN_WALLETS: '/admin/wallets',
  ADMIN_INVESTMENTS: '/admin/investments',
  ADMIN_INVESTMENT_DETAIL: '/admin/investments/:id',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_DISTRIBUTIONS: '/admin/distributions',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_INVESTMENT_PRODUCTS: '/admin/investment-products',
};

export const KYC_STEPS = [
  { step: 1, label: 'Personal Information' },
  { step: 2, label: 'Address Information' },
  { step: 3, label: 'Identity Verification' },
  { step: 4, label: 'Document Upload' },
  { step: 5, label: 'Selfie Verification' },
  { step: 6, label: 'Review & Submit' },
];

export const KYC_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  RETURN: 'return',
};
