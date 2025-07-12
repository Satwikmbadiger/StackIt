import React from 'react';
import VoteButtons from './VoteButtons';
import AcceptAnswerButton from './AcceptAnswerButton';
import './AnswerCard.css';

const AnswerCard = ({ answer, onVote, onAccept, canAccept }) => (
  <div className={`answer-card${answer.accepted ? ' accepted' : ''}`}> 
    <div className="answer-meta">
      <span className="answer-author">By @{answer.author}</span>
      {answer.accepted && <span className="accepted-pill">Accepted</span>}
    </div>
    <div className="answer-text" dangerouslySetInnerHTML={{ __html: answer.text }} />
    <div className="answer-actions">
      <VoteButtons score={answer.votes} onUpvote={() => onVote(1)} onDownvote={() => onVote(-1)} />
      {canAccept && (
        <AcceptAnswerButton accepted={answer.accepted} onAccept={onAccept} />
      )}
    </div>
  </div>
);

export default AnswerCard;
