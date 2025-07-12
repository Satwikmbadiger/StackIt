import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

const QuestionForm = () => {
  const { currentUser, postQuestion, setNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || tags.length === 0) {
      setNotification({ message: 'Please fill all fields.', type: 'error' });
      return;
    }
    setLoading(true);
    const res = await postQuestion({ title, description, tags, author: currentUser.username });
    setLoading(false);
    if (res && res.id) {
      setNotification({ message: 'Question posted!', type: 'success' });
      navigate(`/questions/${res.id}`);
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
