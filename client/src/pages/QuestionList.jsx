import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const QuestionList = () => {
  const { questions, currentUser, loading } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="question-list-page">
      <h2>All Questions</h2>
      {currentUser && (
        <button onClick={() => navigate('/ask')} className="ask-btn">Ask Question</button>
      )}
      {loading ? (
        <div>Loading questions...</div>
      ) : (
        <div className="question-list">
          {questions.length === 0 && <div>No questions yet.</div>}
          {questions.map(q => (
            <div key={q.id} className="question-summary">
              <Link to={`/questions/${q.id}`} className="question-title">{q.title}</Link>
              <div className="question-meta">
                <span>By {q.author}</span>
                <span>Tags: {q.tags.join(', ')}</span>
                <span>Answers: {q.answers.length}</span>
                <span>Votes: {q.votes}</span>
              </div>
              <div className="question-desc" dangerouslySetInnerHTML={{ __html: q.description }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
