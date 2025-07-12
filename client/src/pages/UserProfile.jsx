import React from 'react';
import { useAppContext } from '../AppContext';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';
import '../App.css';
import '../design-tokens.css';

export default function UserProfile() {
  const { currentUser, questions } = useAppContext();

  if (!currentUser) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Please log in to view your profile.</div>;
  }

  const userQuestions = questions.filter(q => q.author === currentUser.username);
  const userAnswers = questions
    .flatMap(q => (q.answers || []).map(a => ({ ...a, questionTitle: q.title, questionId: q.id })))
    .filter(a => a.author === currentUser.username);

  const helpfulVotes = userAnswers.reduce((sum, a) => sum + (a.votes || 0), 0);
  const profileViews = currentUser.profileViews || 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--color-primary-50), var(--theme-light-background))", paddingBottom: "3rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "4px solid var(--color-primary-400)", boxShadow: "var(--shadow-lg)" }}>
            <img src={currentUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{currentUser.username}</h2>
            <p style={{ color: "var(--theme-light-text-muted)" }}>{currentUser.bio || "No bio yet."}</p>
            <p style={{ fontSize: "0.95rem", color: "var(--theme-light-text-secondary)" }}>
              Joined: {currentUser.joinDate || "N/A"} | Last Seen: {currentUser.lastSeen || "N/A"}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <StatCard label="Reputation" value={currentUser.reputation || 0} icon="📈" />
          <StatCard label="Questions" value={userQuestions.length} icon="❓" />
          <StatCard label="Answers" value={userAnswers.length} icon="✅" />
          <StatCard label="Helpful Votes" value={helpfulVotes} icon="👍" />
          <StatCard label="Profile Views" value={profileViews} icon="👁️" />
        </div>

        {/* Your Questions */}
        <section style={{ marginTop: "3rem" }}>
          <h3>Your Questions</h3>
          {userQuestions.length === 0 ? (
            <div style={{ color: "#888", fontStyle: "italic" }}>You haven't asked any questions yet.</div>
          ) : (
            userQuestions.map(q => <QuestionCard key={q.id} question={q} />)
          )}
        </section>

        {/* Your Answers */}
        <section style={{ marginTop: "3rem" }}>
          <h3>Your Answers</h3>
          {userAnswers.length === 0 ? (
            <div style={{ color: "#888", fontStyle: "italic" }}>You haven't posted any answers yet.</div>
          ) : (
            userAnswers.map(a => (
              <div key={`${a.id}-${a.questionId}`} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.95rem", color: "#555", marginBottom: "0.3rem" }}>
                  On: <a href={`/questions/${a.questionId}`}>{a.questionTitle}</a>
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

// Reusable stat card component
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
