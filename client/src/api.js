// api.js - All backend API calls for Flask integration
// For now, these are mock implementations. Replace fetch URLs with Flask endpoints.

const API_BASE = 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'API request failed', response.status);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth endpoints
  async login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  async register(username, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  // Questions endpoints
  async getQuestions() {
    const response = await fetch(`${API_BASE}/questions`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getQuestion(id) {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async postQuestion(data) {
    const response = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Answers endpoints
  async postAnswer(data) {
    const response = await fetch(`${API_BASE}/answers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Voting endpoints
  async vote(data) {
    const response = await fetch(`${API_BASE}/votes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Accept answer endpoint
  async acceptAnswer(data) {
    const response = await fetch(`${API_BASE}/answers/accept`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Notifications endpoints
  async getNotifications() {
    const response = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async markNotificationsRead() {
    const response = await fetch(`${API_BASE}/notifications/mark-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get current user
  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Utility function to check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },

  // Store token after login
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Remove token on logout
  removeToken() {
    localStorage.removeItem('token');
  },

  // Check if token exists
  hasToken() {
    return !!localStorage.getItem('token');
  },
};
