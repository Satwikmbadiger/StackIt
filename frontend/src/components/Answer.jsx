import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { answerService } from '../services/api';

const Answer = ({ answer, questionUserId, onVote, onAccept, onEdit, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Handle upvote
  const handleUpvote = async () => {
    if (!isAuthenticated()) return;
    try {
      await answerService.vote({ 
        answer_id: answer.id, 
        vote_type: 'upvote' 
      });
      onVote();
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };
  
  // Handle downvote
  const handleDownvote = async () => {
    if (!isAuthenticated()) return;
    try {
      await answerService.vote({ 
        answer_id: answer.id, 
        vote_type: 'downvote' 
      });
      onVote();
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  };
  
  // Handle accepting answer
  const handleAccept = async () => {
    try {
      await answerService.acceptAnswer(answer.id);
      onAccept();
    } catch (err) {
      console.error('Failed to accept answer:', err);
    }
  };
  
  return (
    <div id={`answer-${answer.id}`} className={`border-b border-gray-200 py-6 ${answer.accepted ? 'bg-green-50' : ''}`}>
      <div className="flex">
        {/* Vote buttons */}
        <div className="flex flex-col items-center mr-4">
          <button 
            onClick={handleUpvote}
            disabled={!isAuthenticated()}
            className="text-gray-500 hover:text-green-600 focus:outline-none"
            title={isAuthenticated() ? "Upvote" : "Login to vote"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          <span className="text-xl font-bold my-2">{answer.vote_count}</span>
          
          <button 
            onClick={handleDownvote}
            disabled={!isAuthenticated()}
            className="text-gray-500 hover:text-red-600 focus:outline-none"
            title={isAuthenticated() ? "Downvote" : "Login to vote"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Accepted checkmark */}
          {answer.accepted && (
            <div className="mt-2 text-green-600" title="Accepted answer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Answer content */}
        <div className="flex-1">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: answer.content }} />
          
          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="text-sm text-gray-500">
              Answered by 
              <Link to={`/users/${answer.user_id}`} className="ml-1 font-medium text-primary-600 hover:text-primary-800">
                {answer.username}
              </Link>
              <span className="mx-1">•</span>
              <span>{new Date(answer.created_at).toLocaleString()}</span>
            </div>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {/* Edit/Delete buttons (for answer author) */}
              {user && (user.id === answer.user_id || user.role === 'admin') && (
                <>
                  <button 
                    onClick={() => onEdit(answer)}
                    className="text-gray-600 hover:text-primary-600 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(answer.id)}
                    className="text-gray-600 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
              
              {/* Accept button (for question author) */}
              {user && user.id === questionUserId && !answer.accepted && (
                <button 
                  onClick={handleAccept}
                  className="text-gray-600 hover:text-green-600 text-sm"
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
