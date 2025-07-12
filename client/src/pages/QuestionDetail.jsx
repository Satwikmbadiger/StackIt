import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import AnswerForm from '../components/AnswerForm';
import VoteButtons from '../components/VoteButtons';
import AcceptAnswerButton from '../components/AcceptAnswerButton';

const QuestionDetail = () => {
  const { id } = useParams();
  const { questions, currentUser, loading } = useAppContext();
  const question = questions.find(q => q.id === Number(id));
  const navigate = useNavigate();

  if (!question) return <div>Question not found.</div>;

  const handleAnswerPosted = (newAnswer) => {
    // The context will automatically refresh questions
    console.log('New answer posted:', newAnswer);
  };

  return (
    <div className="question-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      
      <div className="question-container">
        <div className="question-header">
          <h2>{question.title}</h2>
          <div className="question-meta">
            <span>By {question.author}</span>
            <span>•</span>
            <span>{new Date(question.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="question-content">
          <div className="question-votes">
            <VoteButtons 
              type="questions" 
              id={question.id} 
              votes={question.votes || 0} 
              userVote={question.userVote || 0} 
            />
          </div>
          
          <div className="question-main">
            <div 
              className="question-description" 
              dangerouslySetInnerHTML={{ __html: question.description }} 
            />
            
            <div className="question-tags">
              {question.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="answers-section">
        <h3>Answers ({question.answers?.length || 0})</h3>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="answers-list">
            {!question.answers || question.answers.length === 0 ? (
              <div className="no-answers">No answers yet. Be the first to answer!</div>
            ) : (
              question.answers.map(answer => (
                <div key={answer.id} className={`answer ${answer.accepted ? 'accepted' : ''}`}>
                  <div className="answer-content">
                    <div className="answer-votes">
                      <VoteButtons 
                        type="answers" 
                        id={answer.id} 
                        votes={answer.votes || 0} 
                        userVote={answer.userVote || 0} 
                      />
                    </div>
                    
                    <div className="answer-main">
                      <div 
                        className="answer-text" 
                        dangerouslySetInnerHTML={{ __html: answer.content || answer.text }} 
                      />
                      
                      <div className="answer-meta">
                        <span>By {answer.author}</span>
                        <span>•</span>
                        <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <AcceptAnswerButton
                        answerId={answer.id}
                        questionAuthor={question.author}
                        currentUser={currentUser}
                        isAccepted={answer.accepted || question.acceptedAnswerId === answer.id}
                        onAccept={handleAnswerPosted}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <AnswerForm 
        questionId={question.id} 
        onAnswerPosted={handleAnswerPosted} 
      />
    </div>
  );
};

export default QuestionDetail;
