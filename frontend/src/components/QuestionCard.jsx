import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start">
        {/* Vote and Answer Stats */}
        <div className="flex flex-col items-center mr-4 text-center w-16">
          <div className="text-gray-600">
            <span className="font-bold text-lg">{question.answer_count}</span>
            <div className="text-xs">
              {question.answer_count === 1 ? 'answer' : 'answers'}
            </div>
          </div>
        </div>
        
        {/* Question Content */}
        <div className="flex-1">
          <Link to={`/questions/${question.id}`} className="text-xl font-semibold text-primary-600 hover:text-primary-800">
            {question.title}
          </Link>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {question.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/?tag=${tag.name}`}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs hover:bg-gray-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Asked by</span>
            <Link to={`/users/${question.user_id}`} className="ml-1 font-medium text-primary-600 hover:text-primary-800">
              {question.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{new Date(question.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
