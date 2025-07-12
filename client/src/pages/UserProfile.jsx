import React from 'react';
import { useAppContext } from '../AppContext';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';
import './UserProfile.css';

// OWNER: Assign to team member responsible for user features
const UserProfile = () => {
  const { currentUser, questions } = useAppContext();
  if (!currentUser) return <div className="profile-error">You must be logged in to view your profile.</div>;

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
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{currentUser.username[0].toUpperCase()}</div>
        <div className="profile-username">@{currentUser.username}</div>
        <div className="profile-email">{currentUser.email || '—'}</div>
      </div>
      <div className="profile-section">
        <h3>Your Questions</h3>
        {userQuestions.length === 0 ? <div className="profile-empty">No questions posted yet.</div> : userQuestions.map(q => <QuestionCard key={q.id} question={q} />)}
      </div>
      <div className="profile-section">
        <h3>Your Answers</h3>
        {userAnswers.length === 0 ? <div className="profile-empty">No answers posted yet.</div> : userAnswers.map(a => (
          <div key={a.id + '-' + a.questionId} className="profile-answer-wrap">
            <div className="profile-answer-q">On: <a href={`/questions/${a.questionId}`}>{a.questionTitle}</a></div>
            <AnswerCard answer={a} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
