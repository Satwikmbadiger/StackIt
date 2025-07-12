import React from 'react';
import '../styles/QuestionCard.css';

const QuestionCard = ({ question }) => {
  const { title, description, tags, username, answers } = question;

  return (
    <div className="question-card">
      <div className="question-stats">
        <div className="stat">
          <span className="stat-number">0</span>
          <span className="stat-label">votes</span>
        </div>
        <div className={`stat ${answers === 0 ? 'unanswered' : ''}`}>
          <span className="stat-number">{answers}</span>
          <span className="stat-label">answers</span>
        </div>
        <div className="stat">
          <span className="stat-number">123</span>
          <span className="stat-label">views</span>
        </div>
      </div>

      <div className="question-content">
        <h3 className="question-title">{title}</h3>
        <p className="question-description">{description}</p>
        
        <div className="question-footer">
          <div className="question-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="question-meta">
            <span className="username">asked by {username}</span>
            <span className="timestamp">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
