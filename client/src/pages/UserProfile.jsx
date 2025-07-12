
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndQuestions = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await api.getUser(id);
        if (userRes.success) {
          setUser(userRes.user);
        }
        // Fetch all questions and filter by user_id
        const allQuestions = await api.getQuestions();
        setQuestions(allQuestions.filter(q => q.author === userRes.user.username));
      } catch (e) {
        setUser(null);
        setQuestions([]);
      }
      setLoading(false);
    };
    fetchUserAndQuestions();
  }, [id]);

  if (loading) return <div>Loading user profile...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="user-profile-page">
      <h2>{user.username}'s Profile</h2>
      <div>Email: {user.email}</div>
      <div>Role: {user.role}</div>
      <div>Joined: {new Date(user.created_at).toLocaleDateString()}</div>
      <h3>Questions Asked</h3>
      {questions.length === 0 ? (
        <div>No questions asked yet.</div>
      ) : (
        <ul>
          {questions.map(q => (
            <li key={q.id}>
              <Link to={`/questions/${q.id}`}>{q.title}</Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};


export default UserProfile; 

