import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

/**
 * Header component that displays the navigation bar.
 * 
 * @param {object} props 
 * @param {object} props.user - The current user object.
 * @param {function} props.onLogout - The function to call when the user logs out.
 * @param {function} props.onAsk - The function to call when the user clicks the 'Ask Question' button.
 * @param {function} props.onSearch - The function to call when the user searches for something.
 * @param {array} props.notifications - The list of notifications.
 * @param {function} props.onMarkAllRead - The function to call when the user marks all notifications as read.
 */
const Header = ({ user, onLogout, onAsk, onSearch, notifications, onMarkAllRead }) => {
  return (
    <header className="header">
      <div className="header-center">
        <span className="header-logo">StackIt</span>
        <form className="header-search">
          <input 
            type="text" 
            placeholder="Search..." 
            onChange={e => onSearch && onSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="header-actions">
        <NavLink to="/ask" className="ask-btn">Ask Question</NavLink>
        <span className="notif-bell" tabIndex={0} aria-label="Notifications">🔔</span>
        {user ? (
          <>
            <NavLink to="/profile" className="header-avatar">{user.username[0].toUpperCase()}</NavLink>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="header-link">Login</NavLink>
            <NavLink to="/register" className="header-link">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
