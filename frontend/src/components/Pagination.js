import React from 'react';
import '../styles/Pagination.css';

const Pagination = () => {
  return (
    <div className="pagination">
      <button className="pagination-btn" disabled>
        ← Previous
      </button>
      
      <div className="pagination-numbers">
        <button className="pagination-number active">1</button>
        <button className="pagination-number">2</button>
        <button className="pagination-number">3</button>
        <span className="pagination-dots">...</span>
        <button className="pagination-number">10</button>
      </div>
      
      <button className="pagination-btn">
        Next →
      </button>
    </div>
  );
};

export default Pagination;
