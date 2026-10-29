const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('libramind_token');
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

  const response = await fetch(url, config);
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

  // Reservations
  getReservations: () => request('/reservations'),
  placeReservation: (book_id) => request('/reservations', { method: 'POST', body: { book_id } }),
  cancelReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),
  markReservationPickup: (id) => request(`/reservations/${id}/pickup`, { method: 'POST' }),

  // Seats
  getSeats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/seats?${query}`);
  },
  getSeatSlots: (seatId, date) => request(`/seats/${seatId}/slots?date=${date}`),
  reserveSeat: (body) => request('/seats/reserve', { method: 'POST', body }),
  cancelSeatReservation: (bookingId) => request(`/seats/reserve/${bookingId}`, { method: 'DELETE' }),
  getMySeatBookings: () => request('/seats/my-bookings'),
  updateSeatStatus: (id, body) => request(`/seats/${id}/status`, { method: 'PUT', body }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  sendAnnouncement: (body) => request('/notifications/announcement', { method: 'POST', body }),
  triggerScheduler: () => request('/notifications/run-cron', { method: 'POST' }),

  // AI & Search
  aiFinder: (data) => {
    const body = typeof data === 'string' ? { query: data } : data;
    return request('/ai/finder', { method: 'POST', body });
  },
  getRecommendations: () => request('/ai/recommendations'),
  askAiAssistant: (message) => request('/ai/assistant', { method: 'POST', body: { message } }),

  // Analytics
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
