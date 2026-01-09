/**
 * API Service for Backend Communication
 * Centralized API calls to the backend server
 * Updated: 2026-01-10 - Fixed API URL configuration
 */

// API Base URL - loaded from environment variable
const API_URL = 'https://b2b-production-febe.up.railway.app/api';
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
}
console.log('API URL configured:', API_URL);

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// ========== AUTH APIs ==========
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    return fetchWithAuth(`${API_URL}/auth/profile`);
  },

  updateProfile: async (userData) => {
    return fetchWithAuth(`${API_URL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ========== CUSTOMER APIs ==========
export const customerAPI = {
  getAll: async () => {
    return fetchWithAuth(`${API_URL}/customers`);
  },

  getById: async (id) => {
    return fetchWithAuth(`${API_URL}/customers/${id}`);
  },

  create: async (customerData) => {
    return fetchWithAuth(`${API_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  update: async (id, customerData) => {
    return fetchWithAuth(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== INVOICE APIs ==========
export const invoiceAPI = {
  getAll: async () => {
    return fetchWithAuth(`${API_URL}/invoices`);
  },

  getById: async (id) => {
    return fetchWithAuth(`${API_URL}/invoices/${id}`);
  },

  create: async (invoiceData) => {
    return fetchWithAuth(`${API_URL}/invoices`, {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  },

  update: async (id, invoiceData) => {
    return fetchWithAuth(`${API_URL}/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`${API_URL}/invoices/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== PAYMENT APIs ==========
export const paymentAPI = {
  getAll: async () => {
    return fetchWithAuth(`${API_URL}/payments`);
  },

  getById: async (id) => {
    return fetchWithAuth(`${API_URL}/payments/${id}`);
  },

  create: async (paymentData) => {
    return fetchWithAuth(`${API_URL}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  getByInvoice: async (invoiceId) => {
    return fetchWithAuth(`${API_URL}/payments/invoice/${invoiceId}`);
  },
};

// ========== HEALTH CHECK ==========
export const healthCheck = async () => {
  const response = await fetch(`${API_URL}/health`);
  return handleResponse(response);
};

export default {
  auth: authAPI,
  customers: customerAPI,
  invoices: invoiceAPI,
  payments: paymentAPI,
  healthCheck,
};
