import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { useAppContext } from '../AppContext';

const AnswerForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const { loading } = useAppContext();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Answer cannot be empty.');
      return;
    }
    await onSubmit(text);
    setText('');
    setError('');
  };

  return (
    <form className="answer-form" onSubmit={handleSubmit}>
      <h4>Your Answer</h4>
      <RichTextEditor value={text} onChange={setText} />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Answer'}</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default AnswerForm;
