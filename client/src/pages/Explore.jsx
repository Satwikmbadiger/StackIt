import React from 'react';
import './Explore.css';

const TAGS = [
  'React', 'JavaScript', 'Python', 'CSS', 'Django', 'HTML', 'Node', 'Flask', 'SQL', 'TypeScript', 'Tailwind', 'Redux', 'MongoDB', 'Express', 'Vue', 'Angular'
];

const Explore = () => (
  <div className="explore-page">
    <h2>Explore Tags</h2>
    <div className="explore-tags">
      {TAGS.map(tag => (
        <div className="explore-tag" key={tag}>{tag}</div>
      ))}
    </div>
    <div className="explore-info">Select a tag to filter questions (functionality coming soon!)</div>
  </div>
);

export default Explore;
