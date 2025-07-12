import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

const QuestionForm = () => {
  const { currentUser, postQuestion, loading, setNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || tags.length === 0) {
      setNotification({ message: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      const response = await postQuestion({
        user_id: currentUser?.id,
        title,
        description,
        tags,
      });

      if (response.success) {
        setNotification({ message: 'Question posted successfully!', type: 'success' });
        navigate(`/questions/${response.question.id}`);
      } else {
        setNotification({ message: response.message || 'Failed to post question', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Error posting question. Try again.', type: 'error' });
    }
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <h3>Ask a Question</h3>

      <label htmlFor="q-title">Title</label>
      <input
        id="q-title"
        type="text"
        className="ask-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter your question title"
        required
        autoComplete="off"
      />

      <label htmlFor="q-desc">Description</label>
      <div className="ask-rich-editor">
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <label htmlFor="q-tags">Tags</label>
      <div className="ask-tags">
        <TagSelector selectedTags={tags} onChange={setTags} />
      </div>

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Question'}
      </button>
    </form>
  );
};

export default QuestionForm;
