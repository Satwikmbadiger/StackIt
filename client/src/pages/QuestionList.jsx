import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { Link, useNavigate } from 'react-router-dom';
import VoteButtons from '../components/VoteButtons';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import RightPanel from '../components/RightPanel';
import './QuestionList.css';

const QuestionList = () => {
  const { questions, loading, refreshQuestions, currentUser } = useAppContext();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshQuestions();
  }, []);

  const filtered = questions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="qlayout-root">
      <Sidebar />
      <main className="qlayout-main">
        {/* Top Header */}
        <div className="qlist-header-row">
          <div className="qlist-logo">StackIt</div>

          {currentUser && (
            <button onClick={() => navigate('/ask')} className="qlist-ask-btn">
              Ask Question
            </button>
          )}

          <button className="qlist-filter-btn">Newest</button>
          <button className="qlist-filter-btn">Unanswered</button>
          <button className="qlist-filter-btn">More ▾</button>

          <input
            className="qlist-search"
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {currentUser ? (
            <Link to="/profile" className="qlist-login-btn">
              <span className="qlist-avatar">
                {currentUser.username[0].toUpperCase()}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="qlist-login-btn">Login</Link>
          )}
        </div>

        {/* Question Feed */}
        <div className="qlist-feed">
          {loading ? (
            <div className="qlist-loading">Loading questions...</div>
          ) : filtered.length === 0 ? (
            <div className="qlist-empty">No questions found.</div>
          ) : (
            filtered.map(question => (
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

                  <div
                    className="question-description"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />

                  <div className="question-meta">
                    <span>By <Link to={`/users/${question.author_id || ''}`}>{question.author}</Link></span>
                    <span>•</span>
                    <span>{new Date(question.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{question.answers?.length || 0} answers</span>
                  </div>

                  <div className="question-tags">
                    {question.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Stub */}
        <div className="qlist-pagination">
          <span className="qlist-page-arrow">&lt;</span>
          {[1, 2, 3, 4, 5].map(num => (
            <span key={num} className="qlist-page-num">{num}</span>
          ))}
          <span className="qlist-page-arrow">&gt;</span>
        </div>
      </main>
      <RightPanel />
    </div>
  );
};

export default QuestionList;
