const RAW_ENV_API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE = RAW_ENV_API_URL
  ? (RAW_ENV_API_URL.endsWith('/api') ? RAW_ENV_API_URL : `${RAW_ENV_API_URL}/api`)
  : '/api';

export function getCleanPathname(pathname = (typeof window !== 'undefined' ? window.location.pathname : '')) {
  try {
    return decodeURIComponent(pathname || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  } catch (_) {
    return '';
  }
}

export function getPortalGatewayKind(cleanPath) {
  if (cleanPath === '' || cleanPath === 'login' || cleanPath === 'register' || cleanPath === 'signin' || cleanPath === 'signup') {
    return 'student';
  }
  if (
    cleanPath === 'lib@123' ||
    cleanPath === 'lib123' ||
    cleanPath === 'lib@1234' ||
    cleanPath === 'lib1234' ||
    cleanPath === 'lib' ||
    cleanPath === 'librarian@123' ||
    cleanPath === 'librarian123' ||
    cleanPath === 'librarian@1234' ||
    cleanPath === 'librarian1234' ||
    cleanPath === 'librarian' ||
    cleanPath === 'librarian/login' ||
    cleanPath === 'lib-login' ||
    cleanPath.startsWith('lib@') ||
    cleanPath.startsWith('librarian@')
  ) {
    return 'librarian';
  }
  if (
    cleanPath === 'admin@123' ||
    cleanPath === 'admin123' ||
    cleanPath === 'admin@1234' ||
    cleanPath === 'admin1234' ||
    cleanPath === 'admin' ||
    cleanPath === 'admin-login' ||
    cleanPath === 'admin/login' ||
    cleanPath.startsWith('admin@')
  ) {
    return 'admin';
  }
  return null;
}

export function clearAllPortalTokens() {
  if (typeof window === 'undefined') return;
  const keys = [
    'libramind_session_token',
    'libramind_session_role',
    'libramind_librarian_token',
    'libramind_admin_token',
    'libramind_admin_verified',
    'libramind_student_token',
    'libramind_token'
  ];
  for (const k of keys) {
    try { sessionStorage.removeItem(k); } catch (_) {}
    try { localStorage.removeItem(k); } catch (_) {}
  }
}

// Always force fresh Sign In / Register when loading any portal entry URL directly
if (typeof window !== 'undefined' && getPortalGatewayKind(getCleanPathname()) !== null) {
  clearAllPortalTokens();
}

export function decodeJwtRole(jwtToken) {
  if (!jwtToken || typeof jwtToken !== 'string') return null;
  try {
    const parts = jwtToken.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed?.role || null;
  } catch (_) {
    return null;
  }
}

export function getActiveAuthToken() {
  if (typeof window === 'undefined') return null;
  const path = (window.location.pathname || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();

  // Only read active sessionStorage token (never auto-login from persistent localStorage)
  // 1. Librarian portal context
  if (path.includes('lib@') || path.includes('librarian') || search.includes('tab=librarian') || search.includes('role=librarian')) {
    const libToken = sessionStorage.getItem('libramind_librarian_token') ||
      (sessionStorage.getItem('libramind_session_role') === 'librarian' ? sessionStorage.getItem('libramind_session_token') : null);
    if (libToken) {
      const role = decodeJwtRole(libToken);
      if (role === 'librarian' || role === 'admin') return libToken;
    }
    const sessToken = sessionStorage.getItem('libramind_session_token');
    if (sessToken) {
      const role = decodeJwtRole(sessToken);
      if (role === 'librarian' || role === 'admin') return sessToken;
    }
    return null;
  }

  // 2. Admin portal context
  if (path.includes('admin') || search.includes('tab=admin') || search.includes('role=admin')) {
    const admToken = sessionStorage.getItem('libramind_admin_token') ||
      (sessionStorage.getItem('libramind_session_role') === 'admin' ? sessionStorage.getItem('libramind_session_token') : null);
    if (admToken && decodeJwtRole(admToken) === 'admin') {
      return admToken;
    }
    const sessToken = sessionStorage.getItem('libramind_session_token');
    if (sessToken && decodeJwtRole(sessToken) === 'admin') {
      return sessToken;
    }
    return null;
  }

  // 3. Student / Public library portal context
  const stuToken = sessionStorage.getItem('libramind_student_token') ||
    (sessionStorage.getItem('libramind_session_role') === 'student' ? sessionStorage.getItem('libramind_session_token') : null);
  if (stuToken && decodeJwtRole(stuToken) === 'student') {
    return stuToken;
  }

  const sessToken = sessionStorage.getItem('libramind_session_token');
  if (sessToken && decodeJwtRole(sessToken) === 'student') {
    return sessToken;
  }

  return null;
}

function getAuthHeader() {
  const token = getActiveAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
    if (!response.ok && (response.status === 502 || response.status === 503 || response.status === 504)) {
      throw new Error(`Proxy gateway error ${response.status}`);
    }
  } catch (netErr) {
    // Only fall back to direct port 5001 on local dev/LAN environments
    const host = typeof window !== 'undefined' && window.location ? window.location.hostname : '';
    const isLocalHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);

    if (API_BASE === '/api' && isLocalHost) {
      const directUrl = `${window.location.protocol}//${host}:5001/api${endpoint}`;
      try {
        response = await fetch(directUrl, config);
      } catch (_) {
        throw new Error('Network error: Unable to connect to LibraMind server. Please verify your connection.');
      }
    } else {
      throw new Error(netErr?.message || 'Unable to connect to LibraMind API server.');
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, otp) => request('/auth/verify-otp', { method: 'POST', body: { phone, otp } }),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  googleLogin: (body) => request('/auth/google', { method: 'POST', body }),
  githubLogin: (body) => request('/auth/github', { method: 'POST', body }),
  forgotPassword: (phone) => request('/auth/forgot-password', { method: 'POST', body: { phone } }),
  verifyResetOtp: (phone, otp) => request('/auth/verify-reset-otp', { method: 'POST', body: { phone, otp } }),
  verifyResetToken: (token) => request(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body }),
  getProfile: () => request('/auth/me'),
  updateInterests: (interests) => request('/auth/interests', { method: 'PUT', body: { interests } }),
  getAllUsers: () => request('/auth/users'),
  updateUserRole: (id, role) => request(`/auth/users/${id}/role`, { method: 'PUT', body: { role } }),
  deleteUser: (id) => request(`/auth/users/${id}`, { method: 'DELETE' }),
  messageUser: (id, body) => request(`/auth/users/${id}/message`, { method: 'POST', body }),
  messageAdmin: (body) => request('/auth/message-admin', { method: 'POST', body }),
  createLibrarian: (body) => request('/auth/create-librarian', { method: 'POST', body }),
  getAuditLogs: () => request('/auth/audit-logs'),

  // Books
  getBooks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/books?${query}`);
  },
  getBook: (id) => request(`/books/${id}`),
  createBook: (body) => request('/books', { method: 'POST', body }),
  updateBook: (id, body) => request(`/books/${id}`, { method: 'PUT', body }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),
  addBookCopy: (bookId, body) => request(`/books/${bookId}/copies`, { method: 'POST', body }),
  updateBookCopy: (copyId, body) => request(`/books/copies/${copyId}`, { method: 'PUT', body }),

  // Loans
  getLoans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/loans?${query}`);
  },
  issueBook: (body) => request('/loans/issue', { method: 'POST', body }),
  checkoutBook: (body) => request('/loans/checkout', { method: 'POST', body }),
  returnBook: (loanId) => request(`/loans/${loanId}/return`, { method: 'POST' }),
  renewLoan: (loanId) => request(`/loans/${loanId}/renew`, { method: 'POST' }),
  payFine: (loanId) => request(`/loans/${loanId}/pay-fine`, { method: 'POST' }),
  payFines: (body = {}) => request('/loans/pay-fines', { method: 'POST', body }),
  getPenaltyStatus: () => request('/loans/penalty-status'),
  lookupCopyBarcode: (barcode) => request(`/loans/copy-lookup/${encodeURIComponent(barcode)}`),
  sendReturnWarning: (loanId) => request(`/loans/${loanId}/send-return-warning`, { method: 'POST' }),
  sendPenaltyRequest: (loanId) => request(`/loans/${loanId}/send-penalty-request`, { method: 'POST' }),
  issuePenaltyQr: (loanId) => request(`/loans/${loanId}/issue-penalty-qr`, { method: 'POST' }),
  cancelPenalty: (loanId) => request(`/loans/${loanId}/cancel-penalty`, { method: 'POST' }),
  waiveUserPenalty: (userId) => request(`/loans/waive-user-penalty/${userId}`, { method: 'POST' }),
  dismissReturnWarning: () => request('/loans/dismiss-return-warning', { method: 'POST' }),
  payPenaltyQr: () => request('/loans/pay-penalty-qr', { method: 'POST' }),
  getUserPenalty: () => request('/loans/user-penalty'),

  // Reservations
  getReservations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reservations${query ? '?' + query : ''}`);
  },
  getBookReservationInfo: (bookId) => request(`/reservations/book/${bookId}`),
  placeReservation: (book_id) => request('/reservations', { method: 'POST', body: { book_id } }),
  cancelReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
  markReservationPickup: (id) => request(`/reservations/${id}/pickup`, { method: 'POST' }),
  claimReservation: (id) => request(`/reservations/${id}/claim`, { method: 'POST' }),

  // Seats
  getSeats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/seats?${query}`);
  },
  getSeatSlots: (seatId, date) => request(`/seats/${seatId}/slots?date=${date}`),
  reserveSeat: (body) => request('/seats/reserve', { method: 'POST', body }),
  cancelSeatReservation: (bookingId) => request(`/seats/reserve/${bookingId}`, { method: 'DELETE' }),
  getMySeatBookings: () => request('/seats/my-bookings'),
  getUserSeatReservations: () => request('/seats/my-bookings'),
  updateSeatStatus: (id, body) => request(`/seats/${id}/status`, { method: 'PUT', body }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
  clearAllNotifications: () => request('/notifications', { method: 'DELETE' }),
  sendAnnouncement: (body) => request('/notifications/announcement', { method: 'POST', body }),
  triggerScheduler: () => request('/notifications/run-cron', { method: 'POST' }),

  // AI & Search
  aiFinder: (data) => {
    const body = typeof data === 'string' ? { query: data } : data;
    return request('/ai/finder', { method: 'POST', body });
  },
  getRecommendations: () => request('/ai/recommendations'),
  askAiAssistant: (message) => request('/ai/assistant', { method: 'POST', body: { message } }),

  // Analytics (Admin Only)
  getBookStatistics: () => request('/analytics/book-statistics'),
  getCompleteInventory: () => request('/analytics/complete-inventory'),
  getAnalyticsOverview: () => request('/analytics/overview'),
  getAnalyticsCharts: () => request('/analytics/charts'),
  exportBooksCsvUrl: () => `${API_BASE}/analytics/export-books`,

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (bookId) => request(`/wishlist/${bookId}`, { method: 'POST' }),
  removeFromWishlist: (bookId) => request(`/wishlist/${bookId}`, { method: 'DELETE' }),

  // Visit Planner
  getVisitPlanner: () => request('/visit-planner'),
  addToVisitPlanner: (bookId, notes = '') => request(`/visit-planner/${bookId}`, { method: 'POST', body: { notes } }),
  toggleVisitPlannerItem: (bookId) => request(`/visit-planner/${bookId}/toggle`, { method: 'PUT' }),
  removeFromVisitPlanner: (bookId) => request(`/visit-planner/${bookId}`, { method: 'DELETE' }),
  clearVisitPlanner: () => request('/visit-planner', { method: 'DELETE' })
};
