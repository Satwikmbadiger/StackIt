import React from 'react';
import './RightPanel.css';

const RightPanel = () => (
  <aside className="right-panel">
    <div className="rp-section">
      <h4>Trending Tags</h4>
      <div className="rp-tags">
        {['React', 'JavaScript', 'Python', 'CSS', 'Django'].map(tag => (
          <span className="rp-tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
    <div className="rp-section">
      <h4>Stats</h4>
      <div className="rp-stats">
        <div>Questions: 120</div>
        <div>Answers: 340</div>
        <div>Users: 56</div>
      </div>
    </div>
  </aside>
);

export default RightPanel;
