import React from 'react';
import { useAppContext } from '../AppContext';
import './Messages.css';

const Messages = () => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <div className="messages-error">Login to view your messages.</div>;

  // Mock messages
  const messages = [
    { id: 1, from: 'Admin', text: 'Welcome to StackIt!' },
    { id: 2, from: 'JaneDoe', text: 'Thanks for your answer!' }
  ];

  return (
    <div className="messages-page">
      <h2>Messages</h2>
      <div className="messages-list">
        {messages.length === 0 ? <div className="messages-empty">No messages yet.</div> : messages.map(m => (
          <div key={m.id} className="message-item">
            <span className="message-from">From: {m.from}</span>
            <span className="message-text">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
