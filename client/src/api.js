// api.js - All backend API calls for Flask integration
// For now, these are mock implementations. Replace fetch URLs with Flask endpoints.

const API_BASE = '/api';

export const api = {
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) return { success: true, user: data.user };
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (e) {
      return { success: false, message: 'Network error' };
    }
  },

  async register(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      return { success: false, message: data.message || 'Registration failed' };
    } catch (e) {
      return { success: false, message: 'Network error' };
    }
  },

  async getQuestions() {
    try {
      const res = await fetch(`${API_BASE}/questions`);
      const data = await res.json();
      return data;
    } catch (e) {
      return [];
    }
  },

  async getQuestion(id) {
    try {
      const res = await fetch(`${API_BASE}/questions/${id}`);
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    }
  },

  async postQuestion({ title, description, tags, author }) {
    try {
      const res = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags, author }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    }
  },

  async postAnswer({ questionId, text, author }) {
    try {
      const res = await fetch(`${API_BASE}/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    }
  },

  async vote({ type, id, delta }) {
    try {
      const res = await fetch(`${API_BASE}/${type}/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false };
    }
  },

  async acceptAnswer({ answerId }) {
    try {
      const res = await fetch(`${API_BASE}/answers/${answerId}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false };
    }
  },
};
