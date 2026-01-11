/**
 * API Service for Backend Communication
 * Centralized API calls to the backend server
 * Updated: 2026-01-11 - Enhanced with better error handling and performance optimizations
 */

// API Base URL - loaded from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://b2b-production-febe.up.railway.app/api';

if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_URL);
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Helper function to get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create abort controller with timeout
const createAbortController = (timeoutMs = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

// Helper function to make authenticated requests with timeout and error handling
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { controller, timeoutId } = createAbortController();

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'include'
    });

    clearTimeout(timeoutId);
    return handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }

    // Log only in development
    if (import.meta.env.DEV) {
      console.error('API Request failed:', error);
    }

    throw error;
  }
};

// ========== AUTH APIs ==========
export const authAPI = {
  register: async (userData) => {
    const { controller, timeoutId } = createAbortController();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  login: async (email, password) => {
    const { controller, timeoutId } = createAbortController();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
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
