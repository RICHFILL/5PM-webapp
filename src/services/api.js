import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      error.message = error.response?.data?.message || error.message;
    }
    return Promise.reject(error);
  },
);

export default api;

// --- Auth ---
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  adminLogin: (email, password) => api.post('/admin/auth/login-admin', { email, password }).then(r => r.data),
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }).then(r => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  verifyEmail: (email, code) => api.post('/auth/verify-email', { email, token: code }).then(r => r.data),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }).then(r => r.data),
  verifyPhone: (code) => api.post('/auth/confirm-phone', { token: code }).then(r => r.data),
  verify2FA: (code) => api.post('/auth/verify-2fa', { token: code }).then(r => r.data),
};

// --- Users ---
export const userApi = {
  getProfile: () => api.get('/users/profile').then(r => r.data),
  updateProfile: (data) => api.put('/users/profile', data).then(r => r.data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/users/change-password', { currentPassword, newPassword }).then(r => r.data),
  getPayments: (userId) => api.get(`/users/${userId}/payments`).then(r => r.data),
  getUserById: (id) => api.get(`/users/profile/${id}`).then(r => r.data),
  getUserStats: (id) => api.get(`/users/${id}/stats`).then(r => r.data),
  getUserPayments: (id) => api.get(`/users/${id}/payments`).then(r => r.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
};

// --- Investments ---
export const investmentApi = {
  getMyInvestments: () => api.get('/investments').then(r => r.data),
  getInvestmentDetails: (id) => api.get(`/investments/${id}`).then(r => r.data),
  getInvestmentPayments: (id) => api.get(`/investments/${id}/payments`).then(r => r.data),
  getOpportunities: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/investment-products?${params}`).then(r => r.data);
  },
  createInvestment: (data) => api.post('/investments', data).then(r => r.data),
};

// --- Wallet ---
export const walletApi = {
  getBalance: () => api.get('/wallet/balance').then(r => r.data),
  getTransactionHistory: (limit = 20, offset = 0) =>
    api.get(`/wallet/transactions?limit=${limit}&offset=${offset}`).then(r => r.data),
  fundWallet: (amount, currency = 'NGN') => api.post('/wallet/fund', { amount, currency }).then(r => r.data),
  requestWithdrawal: () => api.post('/wallet/withdraw-request').then(r => r.data),
  withdrawFunds: (amount, bankAccount, currency = 'NGN') =>
    api.post('/wallet/withdraw', { amount, bankAccount, currency }).then(r => r.data),
};

// --- KYC ---
export const kycApi = {
  getStatus: () => api.get('/kyc/status').then(r => r.data),
  submitPersonalInfo: (data) => api.post('/kyc/personal-info', data).then(r => r.data),
  submitAddressInfo: (data) => api.post('/kyc/address', data).then(r => r.data),
  submitIdentityInfo: (data) => api.post('/kyc/identity', data).then(r => r.data),
  uploadDocument: (formData) => api.post('/kyc/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  uploadSelfie: (formData) => api.post('/kyc/selfie', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  submitKyc: () => api.post('/kyc/submit').then(r => r.data),
};

// --- Notifications ---
export const notificationApi = {
  getNotifications: () => api.get('/notifications').then(r => r.data),
  markAsRead: (id) => api.patch('/notifications/read', { ids: [id] }).then(r => r.data),
  markAllAsRead: (ids) => api.patch('/notifications/read', { ids }).then(r => r.data),
};

// --- Properties (Real Estate) ---
export const propertyApi = {
  getProperties: () => api.get('/properties').then(r => r.data),
  getPropertyDetail: (id) => api.get(`/properties/${id}`).then(r => r.data),
  purchaseUnit: (id, data) => api.post('/property-investments', { propertyId: id, units: data.units }).then(r => r.data),
};

// --- Admin ---
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard').then(r => {
    const d = r.data;
    const stats = d?.data?.stats || d;
    return {
      totalUsers: stats?.totalInvestors || stats?.totalUsers || 0,
      activeInvestments: stats?.activeInvestments || 0,
      totalInvested: stats?.totalInvestmentValue || stats?.totalInvested || 0,
      pendingKyc: stats?.pendingKYCReviews || stats?.pendingKyc || 0,
    };
  }),
  getUsers: () => api.get('/admin/users').then(r => r.data),
  getUserDetail: (id) => api.get(`/admin/users/${id}`).then(r => r.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
  getKycRequests: () => api.get('/admin/kyc').then(r => r.data),
  reviewKyc: (id, status, note) => {
    if (status === 'approved') return api.patch(`/admin/kyc/${id}/approve`).then(r => r.data);
    if (status === 'rejected') return api.patch(`/admin/kyc/${id}/reject`, { comment: note }).then(r => r.data);
    return api.patch(`/admin/kyc/${id}/approve`).then(r => r.data);
  },
  getWallets: () => api.get('/admin/wallets').then(r => r.data),
  getProperties: () => api.get('/properties').then(r => r.data),
  createProperty: (data) => api.post('/properties', data).then(r => r.data),
  updateProperty: (id, data) => api.patch(`/properties/${id}`, data).then(r => r.data),
  getDistributions: () => api.get('/admin/distributions').then(r => r.data),
  createDistribution: (data) => api.post('/admin/distributions', data).then(r => r.data),
  getInvestments: () => api.get('/admin/investments').then(r => r.data),
  getReports: () => api.get('/admin/reports').then(r => r.data),
};

// --- Dashboard ---
export const dashboardApi = {
  getDashboardData: () => api.get('/dashboard').then(r => r.data),
};

// --- Wealth Plans ---
export const wealthApi = {
  getMyPlans: () => api.get('/wealth-plans').then(r => r.data),
  getPlanDetail: (id) => api.get(`/wealth-plans/${id}`).then(r => r.data),
  createPlan: (data) => api.post('/wealth-plans', data).then(r => r.data),
  getCooperatives: () => api.get('/cooperatives').then(r => r.data),
};

// --- Admin Wealth ---
// --- Support Tickets ---
export const ticketApi = {
  getMyTickets: () => api.get('/tickets').then(r => r.data),
  getTicketDetail: (id) => api.get(`/tickets/${id}`).then(r => r.data),
  createTicket: (data) => api.post('/tickets', data).then(r => r.data),
  addReply: (id, message) => api.post(`/tickets/${id}/reply`, { message }).then(r => r.data),
};

// --- Admin Support ---
export const adminTicketApi = {
  getAllTickets: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/tickets/admin/all?${params}`).then(r => r.data);
  },
  getTicketDetail: (id) => api.get(`/tickets/${id}`).then(r => r.data),
  addReply: (id, message) => api.post(`/tickets/${id}/reply`, { message }).then(r => r.data),
  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data).then(r => r.data),
};

export const adminWealthApi = {
  getAllPlans: () => api.get('/wealth-plans/admin/all').then(r => r.data),
  recordContribution: (id, data) => api.post(`/wealth-plans/${id}/contribute`, data).then(r => r.data),
  updatePlan: (id, data) => api.patch(`/wealth-plans/${id}`, data).then(r => r.data),
  createCooperative: (data) => api.post('/cooperatives', data).then(r => r.data),
  getCooperatives: () => api.get('/cooperatives').then(r => r.data),
};

// --- Crowdfunding ---
export const campaignApi = {
  getCampaigns: () => api.get('/campaigns').then(r => r.data),
  getCampaignDetail: (id) => api.get(`/campaigns/${id}`).then(r => r.data),
  invest: (id, data) => api.post(`/campaigns/${id}/invest`, data).then(r => r.data),
};

export const adminCampaignApi = {
  getAllCampaigns: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/campaigns/admin/all?${params}`).then(r => r.data);
  },
  createCampaign: (data) => api.post('/campaigns', data).then(r => r.data),
  updateCampaign: (id, data) => api.patch(`/campaigns/${id}`, data).then(r => r.data),
};

// --- Property Updates ---
export const propertyUpdateApi = {
  getUpdates: (propertyId) => api.get(`/property-updates/${propertyId}`).then(r => r.data),
  createUpdate: (propertyId, data) => api.post(`/property-updates/${propertyId}`, data).then(r => r.data),
  deleteUpdate: (propertyId, id) => api.delete(`/property-updates/${propertyId}/${id}`).then(r => r.data),
};

// --- Loans ---
export const loanApi = {
  getMyLoans: () => api.get('/loans').then(r => r.data),
  getLoanDetail: (id) => api.get(`/loans/${id}`).then(r => r.data),
  applyLoan: (data) => api.post('/loans/apply', data).then(r => r.data),
};

export const adminLoanApi = {
  getAllLoans: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/loans/admin/all?${params}`).then(r => r.data);
  },
  approveLoan: (id, status) => api.patch(`/loans/${id}/approve`, { status }).then(r => r.data),
  recordRepayment: (id, data) => api.post(`/loans/${id}/repay`, data).then(r => r.data),
};

// --- REIT ---
export const reitApi = {
  getPools: () => api.get('/reit').then(r => r.data),
  getPoolDetail: (id) => api.get(`/reit/${id}`).then(r => r.data),
  invest: (id, data) => api.post(`/reit/${id}/invest`, data).then(r => r.data),
};

export const adminReitApi = {
  getAllPools: () => api.get('/reit').then(r => r.data),
  createPool: (data) => api.post('/reit', data).then(r => r.data),
  createDistribution: (id, data) => api.post(`/reit/${id}/distribute`, data).then(r => r.data),
  updatePool: (id, data) => api.patch(`/reit/${id}`, data).then(r => r.data),
};

// --- Tokens ---
export const tokenApi = {
  getMyTokens: () => api.get('/tokens/my').then(r => r.data),
  listToken: (data) => api.post('/tokens/list', data).then(r => r.data),
  getMarketplace: () => api.get('/tokens/marketplace').then(r => r.data),
  buyToken: (listingId) => api.post(`/tokens/buy/${listingId}`).then(r => r.data),
};

// --- Analytics ---
export const analyticsApi = {
  getInsights: () => api.get('/analytics/insights').then(r => r.data),
  getAdminAnalytics: () => api.get('/analytics/admin').then(r => r.data),
};
