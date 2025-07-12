import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import TagSelector from '../components/TagSelector';
import { questionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AskQuestionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/ask' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Handle title change
  const handleTitleChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, title: value });
    
    if (errors.title) {
      setErrors({ ...errors, title: '' });
    }
  };
  
  // Handle description change (from rich text editor)
  const handleDescriptionChange = (content) => {
    setFormData({ ...formData, description: content });
    
    if (errors.description) {
      setErrors({ ...errors, description: '' });
    }
  };
  
  // Handle tags change
  const handleTagsChange = (tags) => {
    setFormData({ ...formData, tags });
    
    if (errors.tags) {
      setErrors({ ...errors, tags: '' });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be less than 150 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.tags.length) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await questionService.createQuestion(formData);
      navigate(`/questions/${response.data.question.id}`);
    } catch (err) {
      console.error('Failed to create question:', err);
      
      if (err.response?.data?.error) {
        setErrors({ form: err.response.data.error });
      } else {
        setErrors({ form: 'An unexpected error occurred. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Character count for title
  const titleCharCount = formData.title.length;
  const titleCharLeft = 150 - titleCharCount;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Ask a Question</h1>
        </div>
        
        {errors.form && (
          <div className="p-6 bg-red-50 text-red-600 border-b">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
              Title
            </label>
            <div className="mb-1">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                className={`input ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., How to implement JWT authentication in React?"
                maxLength={150}
              />
            </div>
            <div className="flex justify-between text-sm">
              {errors.title ? (
                <p className="text-red-500">{errors.title}</p>
              ) : (
                <p className="text-gray-500">
                  Be specific and imagine you're asking a question to another person
                </p>
              )}
              <p className={`${titleCharLeft < 20 ? 'text-orange-500' : 'text-gray-500'}`}>
                {titleCharLeft} characters left
              </p>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Include all the information someone would need to answer your question..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <label htmlFor="tags" className="block mb-2 font-medium text-gray-700">
              Tags
            </label>
            <TagSelector
              selectedTags={formData.tags}
              onChange={handleTagsChange}
            />
            {!errors.tags && (
              <p className="mt-1 text-sm text-gray-500">
                Add up to 5 tags to describe what your question is about
              </p>
            )}
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-2 px-6 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                'Post Your Question'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionPage;
