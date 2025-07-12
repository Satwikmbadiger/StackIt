import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

const QuestionForm = () => {
  const { currentUser, postQuestion, loading } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || tags.length === 0) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await postQuestion({
        user_id: currentUser?.id, // Send user_id for demo
        title,
        description,
        tags,
      });
      if (response.success) {
        navigate(`/questions/${response.question.id}`);
      } else {
        setError(response.message || 'Failed to post question');
      }
    } catch (error) {
      setError('Failed to post question. Please try again.');
    }
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <h3>Ask a Question</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <RichTextEditor value={description} onChange={setDescription} />
      <TagSelector selectedTags={tags} onTagsChange={setTags} />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Question'}</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default QuestionForm;
