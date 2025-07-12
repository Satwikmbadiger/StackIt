// Voting buttons stub
import React from 'react';

const VoteButtons = ({ score, onUpvote, onDownvote }) => (
  <div className="vote-buttons">
    <button onClick={onUpvote} aria-label="Upvote">▲</button>
    <div>{score}</div>
    <button onClick={onDownvote} aria-label="Downvote">▼</button>
  </div>
);

export default VoteButtons;
