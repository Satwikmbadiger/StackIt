import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Auth check
      if (api.hasToken()) {
        try {
          const userRes = await api.getCurrentUser();
          if (userRes.success) {
            setCurrentUser({ ...userRes.user, notifications: [], onMarkAllRead: markAllRead });
          } else {
            api.removeToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          api.removeToken();
        }
      }

      // Load questions
      try {
        const qs = await api.getQuestions();
        setQuestions(qs);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }

      setLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.login(username, password);
      setLoading(false);
      if (res.success) {
        api.setToken(res.token);
        setCurrentUser({ ...res.user, notifications: [], onMarkAllRead: markAllRead });
        setNotifications([]);
        setNotification({ message: 'Login successful!', type: 'success' });
        return true;
      } else {
        setNotification({ message: res.message || 'Invalid credentials.', type: 'error' });
        return false;
      }
    } catch (error) {
      setLoading(false);
      setNotification({ message: 'Login failed. Please try again.', type: 'error' });
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
    api.removeToken();
    setCurrentUser(null);
    setNotifications([]);
    setNotification({ message: 'Logged out.', type: 'info' });
  };

  const addNotification = (message) => {
    const newNotif = { message, read: false, time: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    if (currentUser) setCurrentUser(u => ({ ...u, notifications: [newNotif, ...(u.notifications || [])].slice(0, 10) }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUser) setCurrentUser(u => ({ ...u, notifications: (u.notifications || []).map(n => ({ ...n, read: true })) }));
  };

  const refreshQuestions = async () => {
    setLoading(true);
    const qs = await api.getQuestions();
    setQuestions(qs);
    setLoading(false);
  };

  const postQuestion = async (data) => {
    setLoading(true);
    try {
      const response = await api.postQuestion(data);
      await refreshQuestions();
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error('Failed to post question:', error);
      throw error;
    }
  };

  const postAnswer = async (questionId, data) => {
    setLoading(true);
    const a = await api.postAnswer({ questionId, ...data });
    await refreshQuestions();
    setLoading(false);
    return a;
  };

  const vote = async (type, id, delta) => {
    setQuestions(prev => prev.map(q => {
      if (type === 'questions' && q.id === id) {
        return {
          ...q,
          votes: (q.votes || 0) + delta,
          userVote: delta
        };
      }
      return q;
    }));

    try {
      await api.vote({ type, id, delta, user_id: currentUser?.id });
    } catch {
      console.error("Vote failed, refreshing...");
    } finally {
      await refreshQuestions();
    }
  };

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
