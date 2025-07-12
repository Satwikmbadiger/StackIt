import React from 'react';
import { useAppContext } from '../AppContext';
import './Activity.css';

const Activity = () => {
  const { currentUser, questions } = useAppContext();
  if (!currentUser) return <div className="activity-error">Login to view your activity.</div>;

  // Mock recent activity: questions/answers posted
  const userQuestions = questions.filter(q => q.author === currentUser.username);
  const userAnswers = [];
  questions.forEach(q => {
    q.answers.forEach(a => {
      if (a.author === currentUser.username) {
        userAnswers.push({ ...a, questionTitle: q.title, questionId: q.id });
      }
    });
  });

  return (
    <div className="activity-page">
      <h2>Your Recent Activity</h2>
      <div className="activity-section">
        <h3>Questions</h3>
        {userQuestions.length === 0 ? <div className="activity-empty">No questions posted yet.</div> : userQuestions.map(q => <div key={q.id} className="activity-item">Q: {q.title}</div>)}
      </div>
      <div className="activity-section">
        <h3>Answers</h3>
        {userAnswers.length === 0 ? <div className="activity-empty">No answers posted yet.</div> : userAnswers.map(a => (
          <div key={a.id + '-' + a.questionId} className="activity-item">A: On <a href={`/questions/${a.questionId}`}>{a.questionTitle}</a></div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
