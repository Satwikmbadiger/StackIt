import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question }) => {
  return (
    <div className="question-card">
      <div className="qc-header">
        <div className="qc-title">{question.title}</div>
        <div className="qc-ans-pill">{question.answers?.length || 0} ans</div>
      </div>
      <div className="qc-desc">{question.description?.slice(0, 120)}{question.description?.length > 120 ? '...' : ''}</div>
      <div className="qc-tags-user">
        <div className="qc-tags">
          {question.tags?.map(tag => (
            <span className="qc-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="qc-user">By <span>@{question.author}</span> • 2 hours ago</div>
      </div>
    </div>
  );
};

export default QuestionCard;
