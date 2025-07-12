import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  return (
    <div className="question-card bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="qc-header flex justify-between items-start">
        <Link to={`/questions/${question.id}`} className="qc-title text-xl font-semibold text-primary-600 hover:text-primary-800">
          {question.title}
        </Link>
        <div className="qc-meta text-sm text-gray-500">
          <span className="qc-answers font-medium text-gray-800">{question.answer_count} {question.answer_count === 1 ? 'answer' : 'answers'}</span>
          <span className="qc-dot mx-1">•</span>
          <span className="qc-date">{new Date(question.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="qc-tags flex flex-wrap gap-2 mt-2">
        {question.tags.map(tag => (
          <Link
            key={tag.id}
            to={`/?tag=${tag.name}`}
            className="qc-tag bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-xs hover:bg-gray-200"
          >
            {tag.name}
          </Link>
        ))}
      </div>
      <div className="qc-user mt-2 text-sm text-gray-500">
        <span>Asked by </span>
        <Link to={`/users/${question.user_id}`} className="qc-username font-medium text-primary-600 hover:text-primary-800">
          {question.username}
        </Link>
      </div>
    </div>
  );
};

export default QuestionCard;
