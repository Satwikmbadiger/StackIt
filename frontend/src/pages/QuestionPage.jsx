import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { questionService, answerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import Answer from '../components/Answer';

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [answerSubmitting, setAnswerSubmitting] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const response = await questionService.getQuestion(id);
        setQuestion(response.data);
        setAnswers(response.data.answers);
      } catch (err) {
        console.error('Failed to fetch question:', err);
        setError('Failed to load the question. It may have been removed or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestion();
  }, [id]);
  
  // Handle submitting a new answer
  const handleSubmitAnswer = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/questions/${id}` } });
      return;
    }
    
    if (!newAnswer.trim()) return;
    
    setAnswerSubmitting(true);
    
    try {
      const response = await answerService.createAnswer({
        content: newAnswer,
        question_id: id
      });
      
      // Add the new answer to the list
      setAnswers([...answers, response.data.answer]);
      
      // Clear the input
      setNewAnswer('');
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // Handle error
    } finally {
      setAnswerSubmitting(false);
    }
  };
  
  // Handle editing an answer
  const handleEditAnswer = (answer) => {
    setEditingAnswer({
      id: answer.id,
      content: answer.content
    });
  };
  
  // Handle updating an answer
  const handleUpdateAnswer = async () => {
    if (!editingAnswer?.content.trim()) return;
    
    try {
      const response = await answerService.updateAnswer(
        editingAnswer.id,
        { content: editingAnswer.content }
      );
      
      // Update the answer in the list
      setAnswers(answers.map(a => 
        a.id === editingAnswer.id ? response.data.answer : a
      ));
      
      // Clear the editing state
      setEditingAnswer(null);
    } catch (err) {
      console.error('Failed to update answer:', err);
      // Handle error
    }
  };
  
  // Handle deleting an answer
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    
    try {
      await answerService.deleteAnswer(answerId);
      
      // Remove the answer from the list
      setAnswers(answers.filter(a => a.id !== answerId));
    } catch (err) {
      console.error('Failed to delete answer:', err);
      // Handle error
    }
  };
  
  // Handle accepting an answer
  const handleAcceptAnswer = async () => {
    // Refresh the question to get updated data
    try {
      const response = await questionService.getQuestion(id);
      setAnswers(response.data.answers);
    } catch (err) {
      console.error('Failed to refresh question data:', err);
    }
  };
  
  // Handle voting on an answer
  const handleVote = async () => {
    // Refresh the question to get updated vote counts
    try {
      const response = await questionService.getQuestion(id);
      setAnswers(response.data.answers);
    } catch (err) {
      console.error('Failed to refresh question data:', err);
    }
  };
  
  // Handle deleting the question
  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await questionService.deleteQuestion(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete question:', err);
      // Handle error
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading question...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md max-w-2xl mx-auto">
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Question header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">{question.title}</h1>
            
            <div className="flex flex-wrap items-center mt-4 gap-2">
              {question.tags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.name}`}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              Asked by 
              <Link to={`/users/${question.user_id}`} className="ml-1 font-medium text-primary-600 hover:text-primary-800">
                {question.username}
              </Link>
              <span className="mx-1">•</span>
              <span>{new Date(question.created_at).toLocaleString()}</span>
              
              {/* Edit/Delete buttons for question owner or admin */}
              {user && (user.id === question.user_id || user.role === 'admin') && (
                <div className="mt-2">
                  <Link to={`/questions/${id}/edit`} className="text-primary-600 hover:text-primary-800 mr-4">
                    Edit
                  </Link>
                  <button 
                    onClick={handleDeleteQuestion}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Question content */}
          <div className="p-6 border-b">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
          </div>
          
          {/* Answer count */}
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
          </div>
          
          {/* Answers */}
          <div>
            {answers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No answers yet. Be the first to answer this question!</p>
              </div>
            ) : (
              answers.map(answer => (
                <Answer
                  key={answer.id}
                  answer={answer}
                  questionUserId={question.user_id}
                  onVote={handleVote}
                  onAccept={handleAcceptAnswer}
                  onEdit={handleEditAnswer}
                  onDelete={handleDeleteAnswer}
                />
              ))
            )}
          </div>
          
          {/* Edit answer form */}
          {editingAnswer && (
            <div className="p-6 border-t bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Edit Your Answer</h3>
              <RichTextEditor
                value={editingAnswer.content}
                onChange={(content) => setEditingAnswer({ ...editingAnswer, content })}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingAnswer(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAnswer}
                  className="btn-primary"
                >
                  Update Answer
                </button>
              </div>
            </div>
          )}
          
          {/* New answer form */}
          {!editingAnswer && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              
              {isAuthenticated() ? (
                <>
                  <RichTextEditor
                    value={newAnswer}
                    onChange={setNewAnswer}
                    placeholder="Write your answer here..."
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={answerSubmitting || !newAnswer.trim()}
                      className="btn-primary"
                    >
                      {answerSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </span>
                      ) : (
                        'Post Your Answer'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p>You need to <Link to="/login" className="text-primary-600 hover:underline">log in</Link> to post an answer.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
