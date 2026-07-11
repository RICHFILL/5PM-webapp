import axios from "axios";
import { API_BASE_URL } from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("accessToken");
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
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
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
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),
  adminLogin: (email, password) =>
    api
      .post("/admin/auth/login-admin", { email, password })
      .then((r) => r.data),
  register: (email, password, firstName, lastName) =>
    api
      .post("/auth/register", { email, password, firstName, lastName })
      .then((r) => r.data),
  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  verifyEmail: (email, code) =>
    api.post("/auth/verify-email", { email, token: code }).then((r) => r.data),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }).then((r) => r.data),
  verifyPhone: (code) =>
    api.post("/auth/confirm-phone", { token: code }).then((r) => r.data),
  verify2FA: (code) =>
    api.post("/auth/verify-2fa", { token: code }).then((r) => r.data),
};

// --- Users ---
export const userApi = {
  getProfile: () => api.get("/users/profile").then((r) => r.data),
  updateProfile: (data) => api.put("/users/profile", data).then((r) => r.data),
  changePassword: (currentPassword, newPassword) =>
    api
      .post("/users/change-password", { currentPassword, newPassword })
      .then((r) => r.data),
  getUserById: (id) => api.get(`/users/profile/${id}`).then((r) => r.data),
  getUserStats: (id) => api.get(`/users/${id}/stats`).then((r) => r.data),
  getUserPayments: (id) => api.get(`/users/${id}/payments`).then((r) => r.data),
  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
};

// --- Investments ---
export const investmentApi = {
  getMyInvestments: () => api.get("/investments").then((r) => r.data),
  getInvestmentDetails: (id) =>
    api.get(`/investments/${id}`).then((r) => r.data),
  getInvestmentPayments: (id) =>
    api.get(`/investments/${id}/payments`).then((r) => r.data),
  getOpportunities: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/investment-products?${params}`).then((r) => r.data);
  },
  createInvestment: (data) =>
    api.post("/investments", data).then((r) => r.data),
};

// --- Wallet ---
export const walletApi = {
  getBalance: () => api.get("/wallet/balance").then((r) => r.data),
  getTransactionHistory: (limit = 20, offset = 0) =>
    api
      .get(`/wallet/transactions?limit=${limit}&offset=${offset}`)
      .then((r) => r.data),
  fundWallet: (amount, currency = "NGN") =>
    api.post("/wallet/fund", { amount, currency }).then((r) => r.data),
  requestWithdrawal: () =>
    api.post("/wallet/withdraw-request").then((r) => r.data),
  withdrawFunds: (amount, bankAccount, currency = "NGN") =>
    api
      .post("/wallet/withdraw", { amount, bankAccount, currency })
      .then((r) => r.data),
};

// --- KYC ---
export const kycApi = {
  getStatus: () => api.get("/kyc/status").then((r) => r.data),
  submitPersonalInfo: (data) =>
    api.post("/kyc/personal-info", data).then((r) => r.data),
  submitAddressInfo: (data) =>
    api.post("/kyc/address", data).then((r) => r.data),
  submitIdentityInfo: (data) =>
    api.post("/kyc/identity", data).then((r) => r.data),
  uploadDocument: (formData) =>
    api
      .post("/kyc/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
  uploadSelfie: (formData) =>
    api
      .post("/kyc/selfie", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
  submitKyc: () => api.post("/kyc/submit").then((r) => r.data),
};

// --- Notifications ---
export const notificationApi = {
  getNotifications: () => api.get("/notifications").then((r) => r.data),
  markAsRead: (id) =>
    api.patch("/notifications/read", { ids: [id] }).then((r) => r.data),
  markAllAsRead: (ids) =>
    api.patch("/notifications/read", { ids }).then((r) => r.data),
};

// --- Properties (Real Estate) ---
export const propertyApi = {
  getProperties: () => api.get("/properties").then((r) => r.data),
  getPropertyDetail: (id) => api.get(`/properties/${id}`).then((r) => r.data),
  purchaseUnit: (id, data) =>
    api
      .post("/property-investments", { propertyId: id, units: data.units })
      .then((r) => r.data),
  requestInvestment: (propertyId, data) =>
    api
      .post("/property-investments/request", { propertyId, ...data })
      .then((r) => r.data),
  getMyPropertyInvestments: () =>
    api.get("/property-investments").then((r) => r.data),
};

// --- Admin ---
export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),
  getDashboardAnalytics: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/dashboard/analytics?${q}`).then((r) => r.data);
  },
  getUsers: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/users?${q}`).then((r) => r.data);
  },
  getUserDetail: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data).then((r) => r.data),
  assignUserRole: (id, role) =>
    api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  createUser: (data) =>
    api.post("/admin/users", data).then((r) => r.data),
  importUsers: (formData) =>
    api.post("/admin/users/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
  downloadTemplate: () =>
    api.get("/admin/users/template", { responseType: "blob" }).then((r) => {
      const url = URL.createObjectURL(new Blob([r.data], { type: "text/csv" }));
      const a = document.createElement("a"); a.href = url; a.download = "user-import-template.csv"; a.click();
      URL.revokeObjectURL(url);
    }),
  getKycRequests: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/kyc?${q}`).then((r) => r.data);
  },
  reviewKyc: (id, status, note) => {
    if (status === "approved")
      return api.patch(`/admin/kyc/${id}/approve`).then((r) => r.data);
    if (status === "rejected")
      return api
        .patch(`/admin/kyc/${id}/reject`, { comment: note })
        .then((r) => r.data);
    if (status === "under_review")
      return api.patch(`/admin/kyc/${id}/review`).then((r) => r.data);
    return api.patch(`/admin/kyc/${id}/approve`).then((r) => r.data);
  },
  getWallets: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/wallets?${q}`).then((r) => r.data);
  },
  getProperties: () => api.get("/admin/properties").then((r) => r.data),
  createProperty: (formData) =>
    api
      .post("/admin/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
  updateProperty: (id, formData) =>
    api
      .patch(`/admin/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
  getDistributions: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/distributions?${q}`).then((r) => r.data);
  },
  createDistribution: (data) =>
    api.post("/admin/distributions", data).then((r) => r.data),
  approveDistribution: (id) =>
    api.patch(`/admin/distributions/${id}/approve`).then((r) => r.data),
  payDistribution: (id) =>
    api.post(`/admin/distributions/${id}/pay`).then((r) => r.data),
  getInvestments: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/investments?${q}`).then((r) => r.data);
  },
  getInvestmentDetail: (id) =>
    api.get(`/admin/investments/${id}`).then((r) => r.data),
  recordInvestmentPayment: (id, data) =>
    api.post(`/admin/investments/${id}/payments`, data).then((r) => r.data),
  getPropertyDetail: (id) =>
    api.get(`/admin/properties/${id}`).then((r) => r.data),
  getPropertyRequests: (propertyId) =>
    api.get(`/admin/properties/${propertyId}/requests`).then((r) => r.data),
  deleteProperty: (id) =>
    api.delete(`/admin/properties/${id}`).then((r) => r.data),
  handlePropertyRequest: (propertyId, requestId, action, adminNote) =>
    api
      .patch(`/admin/properties/${propertyId}/requests/${requestId}`, {
        action,
        adminNote,
      })
      .then((r) => r.data),
  getReports: () => api.get("/admin/reports").then((r) => r.data),
};

// --- Dashboard ---
export const dashboardApi = {
  getDashboardData: () => api.get("/dashboard").then((r) => r.data),
};

// --- Wealth Plans ---
export const wealthApi = {
  getMyPlans: () => api.get("/wealth-plans").then((r) => r.data),
  getPlanDetail: (id) => api.get(`/wealth-plans/${id}`).then((r) => r.data),
  createPlan: (data) => api.post("/wealth-plans", data).then((r) => r.data),
  getCooperatives: () => api.get("/cooperatives").then((r) => r.data),
};

// --- Admin Wealth ---
// --- Support Tickets ---
export const ticketApi = {
  getMyTickets: () => api.get("/tickets").then((r) => r.data),
  getTicketDetail: (id) => api.get(`/tickets/${id}`).then((r) => r.data),
  createTicket: (data) => api.post("/tickets", data).then((r) => r.data),
  addReply: (id, message) =>
    api.post(`/tickets/${id}/reply`, { message }).then((r) => r.data),
};

// --- Admin Support ---
export const adminTicketApi = {
  getAllTickets: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/tickets/admin/all?${params}`).then((r) => r.data);
  },
  getTicketDetail: (id) => api.get(`/tickets/${id}`).then((r) => r.data),
  addReply: (id, message) =>
    api.post(`/tickets/${id}/reply`, { message }).then((r) => r.data),
  updateTicket: (id, data) =>
    api.patch(`/tickets/${id}`, data).then((r) => r.data),
};

export const adminTokenApi = {
  getAllTokens: () => api.get("/admin/tokens").then((r) => r.data),
};

export const depositApi = {
  createDeposit: (amount, currency = "NGN", reference = "") =>
    api.post("/deposits", { amount, currency, reference }).then((r) => r.data),
  getMyDeposits: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/deposits?`).then((r) => r.data);
  },
};

export const adminDepositApi = {
  getAll: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/deposits?${q}`).then((r) => r.data);
  },
  approve: (id) =>
    api.patch(`/admin/deposits/${id}/approve`).then((r) => r.data),
  reject: (id, reason) =>
    api.patch(`/admin/deposits/${id}/reject`, { reason }).then((r) => r.data),
};

export const adminWithdrawalApi = {
  getAll: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/admin/withdrawals?${q}`).then((r) => r.data);
  },
  approve: (id) =>
    api.patch(`/admin/withdrawals/${id}/approve`).then((r) => r.data),
  reject: (id, notes) =>
    api.patch(`/admin/withdrawals/${id}/reject`, { notes }).then((r) => r.data),
  markProcessing: (id) =>
    api.patch(`/admin/withdrawals/${id}/process`).then((r) => r.data),
  markCompleted: (id) =>
    api.patch(`/admin/withdrawals/${id}/complete`).then((r) => r.data),
};

export const adminAuditApi = {
  getAll: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/audit-logs?${q}`).then((r) => r.data);
  },
};

export const adminWealthApi = {
  getAllPlans: () => api.get("/wealth-plans/admin/all").then((r) => r.data),
  recordContribution: (id, data) =>
    api.post(`/wealth-plans/${id}/contribute`, data).then((r) => r.data),
  updatePlan: (id, data) =>
    api.patch(`/wealth-plans/${id}`, data).then((r) => r.data),
  createCooperative: (data) =>
    api.post("/cooperatives", data).then((r) => r.data),
  updateCooperative: (id, data) =>
    api.put(`/cooperatives/${id}`, data).then((r) => r.data),
  deleteCooperative: (id) =>
    api.delete(`/cooperatives/${id}`).then((r) => r.data),
  getCooperatives: () => api.get("/cooperatives").then((r) => r.data),
};

// --- Crowdfunding ---
export const campaignApi = {
  getCampaigns: () => api.get("/campaigns").then((r) => r.data),
  getCampaignDetail: (id) => api.get(`/campaigns/${id}`).then((r) => r.data),
  invest: (id, data) =>
    api.post(`/campaigns/${id}/invest`, data).then((r) => r.data),
};

export const adminCampaignApi = {
  getAllCampaigns: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/campaigns/admin/all?${params}`).then((r) => r.data);
  },
  createCampaign: (data) => api.post("/campaigns", data).then((r) => r.data),
  updateCampaign: (id, data) =>
    api.patch(`/campaigns/${id}`, data).then((r) => r.data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`).then((r) => r.data),
};

// --- Property Updates ---
export const propertyUpdateApi = {
  getUpdates: (propertyId) =>
    api.get(`/property-updates/${propertyId}`).then((r) => r.data),
  createUpdate: (propertyId, data) =>
    api.post(`/property-updates/${propertyId}`, data).then((r) => r.data),
  updateUpdate: (propertyId, id, data) =>
    api.put(`/property-updates/${propertyId}/${id}`, data).then((r) => r.data),
  deleteUpdate: (propertyId, id) =>
    api.delete(`/property-updates/${propertyId}/${id}`).then((r) => r.data),
};

// --- Loans ---
export const loanApi = {
  getMyLoans: () => api.get("/loans").then((r) => r.data),
  getLoanDetail: (id) => api.get(`/loans/${id}`).then((r) => r.data),
  applyLoan: (data) => api.post("/loans/apply", data).then((r) => r.data),
};

export const adminLoanApi = {
  getAllLoans: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/loans/admin/all?${params}`).then((r) => r.data);
  },
  approveLoan: (id, status) =>
    api.patch(`/loans/${id}/approve`, { status }).then((r) => r.data),
  recordRepayment: (id, data) =>
    api.post(`/loans/${id}/repay`, data).then((r) => r.data),
};

// --- REIT ---
export const reitApi = {
  getPools: () => api.get("/reit").then((r) => r.data),
  getPoolDetail: (id) => api.get(`/reit/${id}`).then((r) => r.data),
  invest: (id, data) =>
    api.post(`/reit/${id}/invest`, data).then((r) => r.data),
};

export const adminReitApi = {
  getAllPools: () => api.get("/reit").then((r) => r.data),
  createPool: (data) => api.post("/reit", data).then((r) => r.data),
  createDistribution: (id, data) =>
    api.post(`/reit/${id}/distribute`, data).then((r) => r.data),
  updatePool: (id, data) => api.patch(`/reit/${id}`, data).then((r) => r.data),
};

// --- Tokens ---
export const tokenApi = {
  getMyTokens: () => api.get("/tokens/my").then((r) => r.data),
  listToken: (data) => api.post("/tokens/list", data).then((r) => r.data),
  getMarketplace: () => api.get("/tokens/marketplace").then((r) => r.data),
  buyToken: (listingId) =>
    api.post(`/tokens/buy/${listingId}`).then((r) => r.data),
};

// --- Admin Auth ---
export const adminAuthApi = {
  register: (email, password, firstName, lastName) =>
    api
      .post("/admin/auth/register-admin", {
        email,
        password,
        firstName,
        lastName,
      })
      .then((r) => r.data),
  verifyEmail: (email, code) =>
    api
      .post("/admin/auth/verify-admin-email", { email, token: code })
      .then((r) => r.data),
  resendVerification: (email) =>
    api
      .post("/admin/auth/resend-admin-verification", { email })
      .then((r) => r.data),
  forgotPassword: (email) =>
    api
      .post("/admin/auth/admin-forgot-password", { email })
      .then((r) => r.data),
  resendForgotPassword: (email) =>
    api
      .post("/admin/auth/admin-resend-forgot-password", { email })
      .then((r) => r.data),
  resetPassword: (token, password) =>
    api
      .post("/admin/auth/admin-reset-password", { token, password })
      .then((r) => r.data),
  refreshToken: () =>
    api.post("/admin/auth/admin-refresh-token").then((r) => r.data),
  changePassword: (currentPassword, newPassword) =>
    api
      .post("/admin/auth/change-password", { currentPassword, newPassword })
      .then((r) => r.data),
  logout: () => api.post("/admin/auth/admin-logout").then((r) => r.data),
  createUser: (data) =>
    api.post("/admin/auth/create-user", data).then((r) => r.data),
};

// --- Admin Investment Products ---
export const adminProductApi = {
  getAll: (params) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/investment-products?${q}`).then((r) => r.data);
  },
  getById: (id) => api.get(`/investment-products/${id}`).then((r) => r.data),
  create: (formData) =>
    api.post("/investment-products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
  update: (id, formData) =>
    api.patch(`/investment-products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),
  archive: (id) => api.delete(`/investment-products/${id}`).then((r) => r.data),
};

// --- Admin Settings ---
export const adminKycSettingsApi = {
  getMode: () => api.get("/admin/settings/kyc").then((r) => r.data),
  updateMode: (mode) =>
    api.put("/admin/settings/kyc", { mode }).then((r) => r.data),
};

export const adminSettingsApi = {
  getAll: () => api.get("/admin/settings").then((r) => r.data),
  update: (key, value) =>
    api.put(`/admin/settings/${key}`, { value }).then((r) => r.data),
  getProviders: () => api.get("/admin/settings/providers").then((r) => r.data),
};

// --- Help Centre ---
export const helpApi = {
  getCategories: () => api.get("/help/categories").then((r) => r.data),
  getArticles: (params) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return api.get(`/help/articles${q}`).then((r) => r.data);
  },
  getArticleBySlug: (slug) =>
    api.get(`/help/articles/${slug}`).then((r) => r.data),
  getPopularArticles: (limit = 5) =>
    api.get(`/help/articles/popular?limit=${limit}`).then((r) => r.data),
  getRecentArticles: (limit = 5) =>
    api.get(`/help/articles/recent?limit=${limit}`).then((r) => r.data),
  submitTicket: (payload) =>
    api.post("/help/tickets", payload).then((r) => r.data),
};

// --- Analytics ---
export const analyticsApi = {
  getInsights: () => api.get("/analytics/insights").then((r) => r.data),
  getAdminAnalytics: () => api.get("/analytics/admin").then((r) => r.data),
};
