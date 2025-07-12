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

  // Check authentication status and fetch questions on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      
      // Check if user is authenticated
      if (api.hasToken()) {
        try {
          const userRes = await api.getCurrentUser();
          if (userRes.success) {
            setCurrentUser({ ...userRes.user, notifications: [], onMarkAllRead: markAllRead });
          } else {
            api.removeToken(); // Remove invalid token
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          api.removeToken(); // Remove invalid token
        }
      }
      
      // Fetch questions
      try {
        const qs = await api.getQuestions();
        setQuestions(qs);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
      
      setLoading(false);
    })();
  }, []);

  // Auth
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
    // Optimistically update the UI
    setQuestions(prevQuestions => prevQuestions.map(q => {
      if (type === 'questions' && q.id === id) {
        return {
          ...q,
          votes: (q.votes || 0) + delta,
          userVote: delta // or set to 0 if removing vote
        };
      }
      return q;
    }));
    // Fire and forget backend update
    api.vote({ type, id, delta, user_id: currentUser?.id })
      .then(() => {
        // Optionally, refresh from backend in the background
        refreshQuestions();
      })
      .catch(() => {
        // Optionally, revert optimistic update on error
        refreshQuestions();
      });
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
