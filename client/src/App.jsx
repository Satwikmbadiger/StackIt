import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import QuestionList from './pages/QuestionList';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionForm from './components/QuestionForm';
import UserProfile from './pages/UserProfile';
import { AppProvider, useAppContext } from './AppContext';

function AppRoutes() {
  const { currentUser, notification, logout } = useAppContext();
  return (
    <Router>
      <div className="app-container">
        <Navbar user={currentUser} onLogout={logout} />
        <Notification message={notification.message} type={notification.type} />
        <main className="main-content" style={{ display: "flex", justifyContent: "center" }}>
          <Routes>
            <Route path="/" element={<QuestionList />} />
            <Route path="/ask" element={currentUser ? <QuestionForm /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:tab" element={<UserProfile />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
