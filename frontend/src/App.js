import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuestionList from './components/QuestionList';
import Pagination from './components/Pagination';
import './styles/App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
            </div>
          )}
          
          {error && (
            <div className="error">
              <p>Error: {error}</p>
              <button onClick={fetchQuestions} className="retry-btn">
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              <QuestionList questions={questions} />
              <Pagination />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
