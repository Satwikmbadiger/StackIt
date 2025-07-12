// Accept answer button stub
import React from 'react';

const AcceptAnswerButton = ({ accepted, onAccept }) => (
  <button
    className={`accept-answer-btn${accepted ? ' accepted' : ''}`}
    onClick={onAccept}
    disabled={accepted}
  >
    {accepted ? 'Accepted' : 'Accept Answer'}
  </button>
);

export default AcceptAnswerButton;
