import React from 'react';
import QuestionForm from '../components/QuestionForm';
import './AskQuestion.css';

const AskQuestion = () => {
  return (
    <div className="ask-question-page">
      <div className="ask-question-card">
        <h2 className="ask-title">Ask a public question</h2>
        <QuestionForm />
      </div>
    </div>
  );
};

export default AskQuestion;
