import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Explore.css';

const TAGS = [
  'React', 'JavaScript', 'Python', 'CSS', 'Django', 'HTML', 'Node', 'Flask', 'SQL', 'TypeScript', 'Tailwind', 'Redux', 'MongoDB', 'Express', 'Vue', 'Angular'
];

const Explore = () => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    // Navigate to the main page with the tag filter applied
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2>Explore Tags</h2>
        <p>Click on a tag to filter questions by that topic</p>
      </div>
      <div className="explore-tags">
        {TAGS.map(tag => (
          <button
            className="explore-tag clickable"
            key={tag}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
            <span className="tag-count">({Math.floor(Math.random() * 50) + 1})</span>
          </button>
        ))}
      </div>
      <div className="explore-actions">
        <Link to="/" className="back-to-questions">
          ← Back to Questions
        </Link>
      </div>
    </div>
  );
};

export default Explore;
