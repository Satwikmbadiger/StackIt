import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Notifications are stored per user for demo
  const [notifications, setNotifications] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Fetch questions on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const qs = await api.getQuestions();
      setQuestions(qs);
      setLoading(false);
    })();
  }, []);

  // Auth
  const login = async (username, password) => {
    setLoading(true);
    const res = await api.login(username, password);
    setLoading(false);
    if (res.success) {
      setCurrentUser({ ...res.user, notifications: [], onMarkAllRead: markAllRead });
      setNotifications([]);
      setNotification({ message: 'Login successful!', type: 'success' });
      return true;
    } else {
      setNotification({ message: res.message || 'Invalid credentials.', type: 'error' });
      return false;
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    const res = await api.register(username, password);
    setLoading(false);
    if (res.success) {
      setNotification({ message: 'Registration successful! Please log in.', type: 'success' });
      return true;
    } else {
      setNotification({ message: res.message || 'Registration failed.', type: 'error' });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setNotifications([]);
    setNotification({ message: 'Logged out.', type: 'info' });
  };

  // Notifications
  const addNotification = (message) => {
    const newNotif = { message, read: false, time: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    if (currentUser) setCurrentUser(u => ({ ...u, notifications: [newNotif, ...(u.notifications || [])].slice(0, 10) }));
  };
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUser) setCurrentUser(u => ({ ...u, notifications: (u.notifications || []).map(n => ({ ...n, read: true })) }));
  };

  // Questions
  const refreshQuestions = async () => {
    setLoading(true);
    const qs = await api.getQuestions();
    setQuestions(qs);
    setLoading(false);
  };

  const postQuestion = async (data) => {
    setLoading(true);
    const q = await api.postQuestion(data);
    await refreshQuestions();
    setLoading(false);
    return q;
  };

  // Answers
  const postAnswer = async (questionId, data) => {
    setLoading(true);
    const a = await api.postAnswer({ questionId, ...data });
    await refreshQuestions();
    setLoading(false);
    return a;
  };

  // Voting
  const vote = async (type, id, delta) => {
    setLoading(true);
    await api.vote({ type, id, delta });
    await refreshQuestions();
    setLoading(false);
  };

  // Accept answer
  const acceptAnswer = async (answerId) => {
    setLoading(true);
    await api.acceptAnswer({ answerId });
    await refreshQuestions();
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: currentUser ? { ...currentUser, notifications: notifications, onMarkAllRead: markAllRead } : null,
        questions,
        loading,
        notification,
        login,
        register,
        logout,
        refreshQuestions,
        setNotification,
        addNotification,
        markAllRead,
        postQuestion,
        postAnswer,
        vote,
        acceptAnswer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
