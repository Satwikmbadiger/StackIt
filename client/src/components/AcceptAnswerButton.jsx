
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import './AcceptAnswerButton.css';

const AcceptAnswerButton = ({ answerId, questionAuthor, currentUser, isAccepted, onAccept }) => {
  const { acceptAnswer, loading } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const canAccept = currentUser && currentUser.username === questionAuthor && !isAccepted;

  const handleAccept = async () => {
    if (!canAccept) return;

    setIsProcessing(true);
    try {
      await acceptAnswer(answerId);
      if (onAccept) {
        onAccept(answerId);
      }
    } catch (error) {
      console.error('Failed to accept answer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!canAccept && !isAccepted) {
    return null;
  }

  return (
    <div className="accept-answer-container">
      {isAccepted ? (
        <div className="accepted-badge">
          <span className="accepted-icon">✓</span>
          <span>Accepted</span>
        </div>
      ) : (
        <button
          type="button"
          className="accept-answer-btn"
          onClick={handleAccept}
          disabled={loading || isProcessing}
          title="Mark this answer as accepted"
        >
          {loading || isProcessing ? 'Accepting...' : 'Accept Answer'}
        </button>
      )}
    </div>
  );
};


export default AcceptAnswerButton;
