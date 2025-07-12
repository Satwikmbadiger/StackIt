import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import RightPanel from '../components/RightPanel';
import Filters from '../components/Filters';
import './QuestionList.css';

const QuestionList = () => {
  const { questions, loading, refreshQuestions, currentUser } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refreshQuestions();
  }, []);

  // Handle URL parameters (for tags from Explore page)
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl && !selectedTags.includes(tagFromUrl)) {
      setSelectedTags([tagFromUrl]);
    }
  }, [searchParams, selectedTags]);

  // Advanced filtering and sorting logic
  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = [...questions];

    // Text search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    switch (filterBy) {
      case 'unanswered':
        filtered = filtered.filter(q => !q.answers || q.answers.length === 0);
        break;
      case 'answered':
        filtered = filtered.filter(q => q.answers && q.answers.length > 0);
        break;
      case 'no_accepted':
        filtered = filtered.filter(q => q.answers && q.answers.length > 0 && !q.answers.some(a => a.is_accepted));
        break;
      case 'has_accepted':
        filtered = filtered.filter(q => q.answers && q.answers.some(a => a.is_accepted));
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => 
        q.tags && selectedTags.every(tag => 
          q.tags.some(qTag => qTag.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'votes':
        filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        break;
      case 'answers':
        filtered.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
        break;
      case 'activity':
        filtered.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
        break;
      default: // 'newest'
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return filtered;
  }, [questions, searchQuery, filterBy, selectedTags, sortBy]);

  return (
    <div className="qlayout-root">
      <Sidebar />
      <main className="qlayout-main">
        <div className="qlist-header-row">
          <div className="qlist-logo">StackIt</div>
          <Link to="/ask" className="qlist-ask-btn">Ask New question</Link>
          {currentUser ? (
            <Link to="/profile" className="qlist-login-btn">
              <span className="qlist-avatar">{currentUser.username[0].toUpperCase()}</span>
            </Link>
          ) : (
            <Link to="/login" className="qlist-login-btn">Login</Link>
          )}
        </div>
        <Breadcrumbs />
        
        {/* New Filters Component */}
        <Filters
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Results Counter */}
        <div className="qlist-results-info">
          <span className="results-count">
            {loading ? 'Loading...' : `${filteredAndSortedQuestions.length} question${filteredAndSortedQuestions.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        <div className="qlist-feed">
          {loading ? (
            <div className="qlist-loading">
              <div className="loading-spinner"></div>
              <span>Loading questions...</span>
            </div>
          ) : filteredAndSortedQuestions.length === 0 ? (
            <div className="qlist-empty">
              <div className="empty-icon">🔍</div>
              <h3>No questions found</h3>
              <p>
                {searchQuery || filterBy !== 'all' || selectedTags.length > 0 
                  ? 'Try adjusting your filters or search terms to find more questions.' 
                  : 'Be the first to ask a question!'
                }
              </p>
              {searchQuery || filterBy !== 'all' || selectedTags.length > 0 ? (
                <button 
                  onClick={() => {
                    setSortBy('newest');
                    setFilterBy('all');
                    setSelectedTags([]);
                    setSearchQuery('');
                  }}
                  className="clear-all-btn"
                >
                  Clear All Filters
                </button>
              ) : (
                <Link to="/ask" className="ask-first-question-btn">
                  Ask the First Question
                </Link>
              )}
            </div>
          ) : (
            filteredAndSortedQuestions.map(q => (
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
