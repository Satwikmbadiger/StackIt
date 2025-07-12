import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';
import '../App.css';
import '../design-tokens.css';

export default function UserProfile() {
  const { id } = useParams();
  const { currentUser, questions: localQuestions } = useAppContext();

  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Own profile
  const isOwnProfile = !id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (isOwnProfile && currentUser) {
        setUser(currentUser);
        setQuestions(localQuestions.filter(q => q.author === currentUser.username));
        setLoading(false);
      } else {
        try {
          const userRes = await api.getUser(id);
          if (userRes.success) {
            setUser(userRes.user);
            const allQuestions = await api.getQuestions();
            setQuestions(allQuestions.filter(q => q.author === userRes.user.username));
          } else {
            setUser(null);
            setQuestions([]);
          }
        } catch (e) {
          setUser(null);
          setQuestions([]);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, localQuestions, isOwnProfile]);

  if (!isOwnProfile && loading) return <div style={{ padding: '2rem' }}>Loading user profile...</div>;
  if (!user) return <div style={{ padding: '2rem' }}>User not found.</div>;
  if (isOwnProfile && !currentUser) return <div style={{ padding: '2rem' }}>Please log in to view your profile.</div>;

  const userAnswers = localQuestions
    .flatMap(q => (q.answers || []).map(a => ({ ...a, questionTitle: q.title, questionId: q.id })))
    .filter(a => a.author === user.username);

  const helpfulVotes = userAnswers.reduce((sum, a) => sum + (a.votes || 0), 0);
  const profileViews = user.profileViews || 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--color-primary-50), var(--theme-light-background))", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "4px solid var(--color-primary-400)", boxShadow: "var(--shadow-lg)" }}>
            <img src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user.username}</h2>
            <p style={{ color: "var(--theme-light-text-muted)" }}>{user.bio || "No bio yet."}</p>
            <p style={{ fontSize: "0.95rem", color: "var(--theme-light-text-secondary)" }}>
              Joined: {user.joinDate || new Date(user.created_at).toLocaleDateString() || "N/A"} | Last Seen: {user.lastSeen || "N/A"}
            </p>
            {!isOwnProfile && <p>Email: {user.email}</p>}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <StatCard label="Reputation" value={user.reputation || 0} icon="📈" />
          <StatCard label="Questions" value={questions.length} icon="❓" />
          <StatCard label="Answers" value={userAnswers.length} icon="✅" />
          <StatCard label="Helpful Votes" value={helpfulVotes} icon="👍" />
          <StatCard label="Profile Views" value={profileViews} icon="👁️" />
        </div>

        {/* Questions Section */}
        <section style={{ marginTop: "3rem" }}>
          <h3>{isOwnProfile ? 'Your' : `${user.username}'s`} Questions</h3>
          {questions.length === 0 ? (
            <div style={{ color: "#888", fontStyle: "italic" }}>No questions asked yet.</div>
          ) : (
            questions.map(q => (
              <QuestionCard key={q.id} question={q} />
            ))
          )}
        </section>

        {/* Answers Section */}
        <section style={{ marginTop: "3rem" }}>
          <h3>{isOwnProfile ? 'Your' : `${user.username}'s`} Answers</h3>
          {userAnswers.length === 0 ? (
            <div style={{ color: "#888", fontStyle: "italic" }}>No answers posted yet.</div>
          ) : (
            userAnswers.map(a => (
              <div key={`${a.id}-${a.questionId}`} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.95rem", color: "#555", marginBottom: "0.3rem" }}>
                  On: <Link to={`/questions/${a.questionId}`}>{a.questionTitle}</Link>
                </div>
                <AnswerCard answer={a} />
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

// Reusable StatCard Component
const StatCard = ({ label, value, icon }) => (
  <div style={{
    flex: "1 1 160px",
    background: "white",
    padding: "1rem",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{icon}</div>
    <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>{value}</div>
    <div style={{ color: "var(--theme-light-text-muted)", fontSize: "0.95rem" }}>{label}</div>
  </div>
);
