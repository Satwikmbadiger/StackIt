import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import RichTextEditor from './RichTextEditor';

const AnswerForm = ({ questionId, onAnswerPosted }) => {
  const { currentUser, postAnswer, loading } = useAppContext();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Please provide an answer.');
      return;
    }

    try {
      const newAnswer = await postAnswer(questionId, {
        content,
        author: currentUser.username,
      });

      setContent('');
      setError('');

      if (onAnswerPosted) {
        onAnswerPosted(newAnswer);
      }
    } catch (err) {
      setError('Failed to post answer. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="answer-form-login-prompt">
        <p>Please <a href="/login">log in</a> to post an answer.</p>
      </div>
    );
  }

  return (
    <div className="answer-form">
      <h3>Your Answer</h3>
      <form onSubmit={handleSubmit}>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your answer here... Use the toolbar above to format your text."
        />

        {error && <div className="form-error">{error}</div>}

        <div className="answer-form-actions">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="submit-answer-btn"
          >
            {loading ? 'Posting...' : 'Post Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
