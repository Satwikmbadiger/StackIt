import React, { useState, useEffect, useRef } from 'react';
import './NotificationBell.css';

const NotificationBell = ({ notifications, onMarkAllRead }) => {
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="notification-bell" ref={bellRef}>
      <button
        className="bell-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <span role="img" aria-label="bell">🔔</span>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            Notifications
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <ul>
            {notifications.length === 0 ? (
              <li className="empty">No notifications</li>
            ) : (
              notifications.map((n, i) => (
                <li key={i} className={n.read ? '' : 'unread'}>
                  {n.message}
                  <span className="time">{n.time}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
