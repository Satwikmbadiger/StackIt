import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { questionService, tagService } from '../services/api';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get the current tag filter from URL
  const tagFilter = searchParams.get('tag');
  
  // Fetch questions when component mounts or filter changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await questionService.getQuestions(page, 10, tagFilter);
        setQuestions(response.data.questions);
        setTotalPages(response.data.pages);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [page, tagFilter]);
  
  // Fetch popular tags
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await tagService.getPopularTags();
        setPopularTags(response.data);
      } catch (err) {
        console.error('Failed to fetch popular tags:', err);
      }
    };
    
    fetchPopularTags();
  }, []);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="homepage-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Popular Tags</h2>
        <div className="tags-list">
          {popularTags.map(tag => (
            <Link
              key={tag.id}
              to={`/?tag=${tag.name}`}
              className={`tag-chip${tagFilter === tag.name ? ' active' : ''}`}
            >
              {tag.name}
              <span className="tag-count">({tag.question_count})</span>
            </Link>
          ))}
        </div>
        {tagFilter && (
          <Link to="/" className="clear-filter">← Clear filter</Link>
        )}
      </aside>
      <main className="main-content">
        <div className="main-header">
          <h1 className="main-title">
            {tagFilter ? `Questions tagged [${tagFilter}]` : 'All Questions'}
          </h1>
          <Link to="/ask" className="btn-primary">Ask Question</Link>
        </div>
        <section className="questions-list">
          {loading ? (
            <div className="loading-center">
              <span className="loader" />
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="loading-center">
              <p>No questions found</p>
              {tagFilter && (
                <Link to="/" className="clear-filter">View all questions</Link>
              )}
            </div>
          ) : (
            questions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))
          )}
        </section>
        {totalPages > 1 && (
          <nav className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="page-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`page-btn${pageNum === page ? ' active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </nav>
        )}
      </main>
    </div>
  );
};

export default HomePage;
