import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

// OWNER: Assign to team member responsible for navigation/sidebar
const Sidebar = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} end>Home</NavLink>
        <NavLink to="/explore" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Explore</NavLink>
        <NavLink to="/activity" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Activity</NavLink>
        <NavLink to="/messages" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Messages</NavLink>
        {currentUser && <NavLink to="/profile" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Profile</NavLink>}
        <NavLink to="/ask" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Ask Question</NavLink>
        {currentUser ? (
          <button className="sidebar-link logout-link" onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Login</NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
