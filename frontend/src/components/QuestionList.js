import React from 'react';
import QuestionCard from './QuestionCard';
import '../styles/QuestionList.css';

const QuestionList = ({ questions }) => {
  return (
    <div className="question-list">
      <div className="question-list-header">
        <h2>All Questions</h2>
        <p>{questions.length} questions</p>
      </div>
      
      <div className="questions-container">
        {questions.map(question => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
