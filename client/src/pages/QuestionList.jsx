import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import RightPanel from '../components/RightPanel';
import './QuestionList.css';

const QuestionList = () => {
  const { questions, loading, refreshQuestions, currentUser } = useAppContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    refreshQuestions();
  }, []);

  // Filter logic (simple search by title)
  const filtered = questions.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="qlayout-root">
      <Sidebar />
      <main className="qlayout-main">
        <div className="qlist-header-row">
          <div className="qlist-logo">StackIt</div>
          <Link to="/ask" className="qlist-ask-btn">Ask New question</Link>
          <button className="qlist-filter-btn">Newest</button>
          <button className="qlist-filter-btn">Unanswered</button>
          <button className="qlist-filter-btn">More ▾</button>
          <input
            className="qlist-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {currentUser ? (
            <Link to="/profile" className="qlist-login-btn">
              <span className="qlist-avatar">{currentUser.username[0].toUpperCase()}</span>
            </Link>
          ) : (
            <Link to="/login" className="qlist-login-btn">Login</Link>
          )}
        </div>
        <Breadcrumbs />
        <div className="qlist-feed">
          {loading ? (
            <div className="qlist-loading">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="qlist-empty">No questions found.</div>
          ) : (
            filtered.map(q => (
              <QuestionCard key={q.id} question={q} />
            ))
          )}
        </div>
        <div className="qlist-pagination">
          <span className="qlist-page-arrow">&lt;</span>
          {[1,2,3,4,5,6,7].map(num => (
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
