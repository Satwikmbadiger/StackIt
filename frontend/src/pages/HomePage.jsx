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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.name}`}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tagFilter === tag.name
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                  <span className="ml-1">({tag.question_count})</span>
                </Link>
              ))}
            </div>
            {tagFilter && (
              <div className="mt-4">
                <Link to="/" className="text-primary-600 hover:text-primary-800">
                  ← Clear filter
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {tagFilter 
                  ? `Questions tagged [${tagFilter}]`
                  : 'All Questions'}
              </h1>
              <Link to="/ask" className="btn-primary">
                Ask Question
              </Link>
            </div>
            
            {/* Questions list */}
            <div>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No questions found</p>
                  {tagFilter && (
                    <p className="mt-2">
                      <Link to="/" className="text-primary-600 hover:underline">
                        View all questions
                      </Link>
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {questions.map(question => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageNum === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded ${
                      page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
