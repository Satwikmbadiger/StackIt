import React from 'react';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getProfile: () => api.get('/profile'),
};

// Question Services
export const questionService = {
  getQuestions: (page = 1, perPage = 10, tag) => {
    let url = `/questions?page=${page}&per_page=${perPage}`;
    if (tag) {
      url += `&tag=${tag}`;
    }
    return api.get(url);
  },
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (questionData) => api.post('/questions', questionData),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

// Answer Services
export const answerService = {
  createAnswer: (answerData) => api.post('/answers', answerData),
  updateAnswer: (id, answerData) => api.put(`/answers/${id}`, answerData),
  deleteAnswer: (id) => api.delete(`/answers/${id}`),
  acceptAnswer: (id) => api.post(`/answers/${id}/accept`),
  vote: (voteData) => api.post('/votes', voteData),
};

// Tag Services
export const tagService = {
  getTags: () => api.get('/tags'),
  getPopularTags: () => api.get('/tags/popular'),
};

// User Services
export const userService = {
  getUser: (id) => api.get(`/users/${id}`),
  getUserQuestions: (id, page = 1, perPage = 10) => 
    api.get(`/users/${id}/questions?page=${page}&per_page=${perPage}`),
  getUserAnswers: (id, page = 1, perPage = 10) => 
    api.get(`/users/${id}/answers?page=${page}&per_page=${perPage}`),
  checkUsername: (username) => api.get(`/users/${username}/exists`),
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAllRead: () => api.post('/notifications/mark-read'),
  markRead: (id) => api.post(`/notifications/${id}/mark-read`),
};

export default api;
