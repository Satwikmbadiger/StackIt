import React from 'react';
import { useAppContext } from '../AppContext';
import './VoteButtons.css';

const VoteButtons = ({ type, id, votes = 0, userVote = 0 }) => {
  const { currentUser, vote } = useAppContext();

  const handleVote = async (delta) => {
    if (!currentUser) {
      // You could show a login prompt here
      return;
    }

    try {
      await vote(type, id, delta);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const getVoteButtonClass = (voteType) => {
    if (!currentUser) return 'vote-btn disabled';
    if (userVote === voteType) return 'vote-btn active';
    return 'vote-btn';
  };

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={getVoteButtonClass(1)}
        onClick={() => handleVote(userVote === 1 ? 0 : 1)}
        title={currentUser ? "Upvote" : "Login to vote"}
        disabled={!currentUser}
      >
        ▲
      </button>
      
      <span className="vote-count">{votes}</span>
      
      <button
        type="button"
        className={getVoteButtonClass(-1)}
        onClick={() => handleVote(userVote === -1 ? 0 : -1)}
        title={currentUser ? "Downvote" : "Login to vote"}
        disabled={!currentUser}
      >
        ▼
      </button>
    </div>
  );
};

export default VoteButtons;
