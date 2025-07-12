import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import AnswerForm from '../components/AnswerForm';
import VoteButtons from '../components/VoteButtons';
import AcceptAnswerButton from '../components/AcceptAnswerButton';

const QuestionDetail = () => {
  const { id } = useParams();
  const { questions, currentUser, postAnswer, vote, acceptAnswer, loading } = useAppContext();
  const question = questions.find(q => q.id === Number(id));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!question) return <div>Question not found.</div>;

  const handleVote = async (delta) => {
    await vote('questions', question.id, delta);
  };

  const handleAnswerVote = async (answerId, delta) => {
    await vote('answers', answerId, delta);
  };

  const handleAccept = async (answerId) => {
    await acceptAnswer(answerId);
  };

  const handlePostAnswer = async (text) => {
    if (!currentUser) {
      setError('Login to post an answer.');
      return;
    }
    if (!text.trim()) {
      setError('Answer cannot be empty.');
      return;
    }
    await postAnswer(question.id, { text, author: currentUser.username });
    setError('');
  };

  return (
    <div className="question-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      <h2>{question.title}</h2>
      <div className="question-meta">
        <span>By {question.author}</span>
        <span>Tags: {question.tags.join(', ')}</span>
        <span>Votes: {question.votes}</span>
      </div>
      <div className="question-desc" dangerouslySetInnerHTML={{ __html: question.description }} />
      <VoteButtons score={question.votes} onUpvote={() => handleVote(1)} onDownvote={() => handleVote(-1)} />
      <h3>Answers</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="answers-list">
          {question.answers.length === 0 && <div className="empty-answers">No answers yet.</div>}
          {question.answers.map(a => (
            <AnswerCard
              key={a.id}
              answer={a}
              onVote={delta => handleAnswerVote(a.id, delta)}
              onAccept={() => handleAccept(a.id)}
              canAccept={currentUser && question.author === currentUser.username}
            />
          ))}
        </div>
      )}
      {/* Only logged-in users can answer */}
      {currentUser && <AnswerForm onSubmit={handlePostAnswer} />}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default QuestionDetail;
