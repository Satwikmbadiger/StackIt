import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated()) {
      fetchUnreadCount();
    }
  }, [isAuthenticated()]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">StackIt</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated() && (
            <Link to="/ask" className="nav-link">Ask</Link>
          )}
        </div>
        <div className="nav-actions">
          {isAuthenticated() ? (
            <>
              <Link to="/notifications" className="icon-link" title="Notifications">
                <span className="icon-bell" />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </Link>
              <div className="user-menu">
                <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
                  <span className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</span>
                </button>
                {showMenu && (
                  <div className="dropdown">
                    <Link to={`/users/${user?.id}`} className="dropdown-link">Profile</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="dropdown-link">Admin</Link>
                    )}
                    <button onClick={logout} className="dropdown-link">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
