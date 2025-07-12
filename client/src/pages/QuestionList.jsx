import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import VoteButtons from '../components/VoteButtons';

const QuestionList = () => {
  const { questions, currentUser, loading } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="question-list-page">
      <div className="question-list-header">
        <h2>All Questions</h2>
        {currentUser && (
          <button onClick={() => navigate('/ask')} className="ask-btn">Ask Question</button>
        )}
      </div>
      
      {loading ? (
        <div className="loading">Loading questions...</div>
      ) : (
        <div className="question-list">
          {questions.length === 0 && (
            <div className="no-questions">
              <p>No questions yet. Be the first to ask a question!</p>
            </div>
          )}
          {questions.map(question => (
            <div key={question.id} className="question-summary">
              <div className="question-votes">
                <VoteButtons 
                  type="questions" 
                  id={question.id} 
                  votes={question.votes || 0} 
                  userVote={question.userVote || 0} 
                />
              </div>
              
              <div className="question-main">
                <Link to={`/questions/${question.id}`} className="question-title">
                  {question.title}
                </Link>
                
                <div className="question-description" dangerouslySetInnerHTML={{ __html: question.description }} />
                
                <div className="question-meta">
                  <span>By <Link to={`/users/${question.author_id || ''}`}>{question.author}</Link></span>
                  <span>•</span>
                  <span>{new Date(question.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{question.answers?.length || 0} answers</span>
                </div>
                
                <div className="question-tags">
                  {question.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
