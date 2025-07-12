// api.js - All backend API calls for Flask integration
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

  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  // Questions
  async getQuestions() {
    const response = await fetch(`${API_BASE}/questions`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  async getQuestion(id) {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  async postQuestion(data) {
    const response = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Answers
  async postAnswer(data) {
    const response = await fetch(`${API_BASE}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async acceptAnswer(data) {
    const response = await fetch(`${API_BASE}/answers/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Voting
  async vote(data) {
    const response = await fetch(`${API_BASE}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Notifications
  async getNotifications() {
    const response = await fetch(`${API_BASE}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  async markNotificationsRead() {
    const response = await fetch(`${API_BASE}/notifications/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  // Token management
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  hasToken() {
    return !!localStorage.getItem('token');
  },
};