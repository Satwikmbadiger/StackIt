// Simple notification area stub
import React from 'react';

const Notification = ({ message, type }) => (
  message ? <div className={`notification ${type}`}>{message}</div> : null
);

export default Notification;
