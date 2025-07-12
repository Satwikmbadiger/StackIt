// Navigation bar for StackIt
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = ({ user, onLogout }) => (
  <nav className="navbar">
    <div className="navbar__logo">
      <Link to="/">StackIt</Link>
    </div>
    <div className="navbar__links">
      <Link to="/">Home</Link>
      <Link to="/ask">Ask Question</Link>

      <NotificationBell notifications={user?.notifications || []} onMarkAllRead={user?.onMarkAllRead || (()=>{})} />

      {user ? (
        <>
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  </nav>
);

export default Navbar;
