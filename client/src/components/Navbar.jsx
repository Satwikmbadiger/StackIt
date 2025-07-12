// Navigation bar for StackIt
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';


const Navbar = ({ user, onLogout }) => (
  <nav className="navbar" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
    <div style={{ width: "70vw", maxWidth: 1200, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div className="navbar__logo">
        <Link to="/">StackIt</Link>
      </div>
      <div className="navbar__links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/">Home</Link>
        <Link to="/ask">Ask Question</Link>
        <Link to="/profile" className="navbar__link">Profile</Link>
        <NotificationBell />
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
    </div>
  </nav>
);

export default Navbar;
