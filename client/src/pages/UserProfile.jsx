import React from "react";
import { useAppContext } from "../AppContext";
import "../design-tokens.css";
import "../App.css";

export default function UserProfile() {
  const { currentUser, questions, loading } = useAppContext();

  if (!currentUser) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Please log in to view your profile.</div>;
  }

  // Calculate stats from real data
  const userQuestions = questions.filter(q => q.author === currentUser.username);
  const userAnswers = questions.flatMap(q => q.answers || []).filter(a => a.author === currentUser.username);
  const helpfulVotes = userAnswers.reduce((sum, a) => sum + (a.votes || 0), 0);
  const profileViews = currentUser.profileViews || 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--color-primary-50) 0%, var(--theme-light-background) 100%)",
        color: "var(--theme-light-text-primary)",
        fontFamily: "var(--font-primary)",
        display: "flex",
        justifyContent: "center",
        padding: "0 0 3rem 0"
      }}
    >
      <div style={{ width: "70vw", maxWidth: 1200, margin: "2.5rem 0" }}>
        {/* Profile Header */}
        <section className="profile-hero" style={{
          position: "relative",
          background: "rgba(255,255,255,0.85)",
          minHeight: 220,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-2xl)",
          marginBottom: "2.5rem"
        }}>
          <div className="profile-glass" style={{
            background: "var(--theme-light-surface)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "var(--shadow-md)",
            padding: "2.5rem 3rem",
            marginBottom: "-2rem",
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            position: "relative",
            zIndex: 2,
            width: "100%"
          }}>
            <div
              className="profile-avatar"
              style={{
                position: "relative",
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                border: "4px solid var(--color-primary-400)",
                background: "#fff",
                flexShrink: 0,
                transition: "box-shadow 0.3s, border 0.3s"
              }}
            >
              <img
                src={currentUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div className="profile-info" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", minWidth: 0 }}>
              <div className="profile-username" style={{ fontSize: "2.1rem", fontWeight: 700, color: "var(--color-primary-700)", display: "flex", alignItems: "center", gap: "0.7rem", wordBreak: "break-all" }}>
                {currentUser.username}
              </div>
              <div className="profile-displayname" style={{ fontSize: "1.1rem", color: "var(--theme-light-text-secondary)", fontWeight: 500, opacity: 0.85 }}>
                {currentUser.displayName || currentUser.username}
              </div>
              <div className="profile-title" style={{ fontSize: "1.05rem", color: "var(--color-primary-500)", fontWeight: 500, opacity: 0.9 }}>{currentUser.bio || ""}</div>
              <div className="profile-location" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-primary-400)", fontSize: "1rem", opacity: 0.85 }}>{currentUser.location || ""}</div>
              <div className="profile-meta" style={{ display: "flex", gap: "1.2rem", fontSize: "0.98rem", color: "var(--theme-light-text-muted)", marginTop: "0.5rem", opacity: 0.8 }}>
                <span>Member since {currentUser.joinDate || "N/A"}</span>
                <span>Last seen {currentUser.lastSeen || "N/A"}</span>
              </div>
            </div>
          </div>
        </section>
        {/* Quick Stats Bar */}
        <div className="profile-stats-bar" style={{ display: "flex", gap: "2rem", background: "rgba(255,255,255,0.95)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", padding: "1.2rem 2rem", margin: "2.5rem auto 0 auto", maxWidth: 900, justifyContent: "space-between", position: "relative", zIndex: 2, backdropFilter: "blur(2px)" }}>
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "var(--theme-light-text-primary)", fontSize: "1.1rem", fontWeight: 500, minWidth: 120, position: "relative", borderRadius: "var(--radius-lg)", background: "var(--theme-light-background)", boxShadow: "var(--shadow-sm)", padding: "1rem 0.7rem", transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <div className="stat-icon" style={{ fontSize: "1.7rem", marginBottom: "0.2rem", color: "var(--color-primary-500)" }}>&#128200;</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{currentUser.reputation || 0}</div>
            <div className="stat-label" style={{ fontSize: "1rem", color: "var(--theme-light-text-muted)", fontWeight: 400 }}>Reputation</div>
          </div>
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "var(--theme-light-text-primary)", fontSize: "1.1rem", fontWeight: 500, minWidth: 120, position: "relative", borderRadius: "var(--radius-lg)", background: "var(--theme-light-background)", boxShadow: "var(--shadow-sm)", padding: "1rem 0.7rem", transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <div className="stat-icon" style={{ fontSize: "1.7rem", marginBottom: "0.2rem", color: "var(--color-primary-500)" }}>&#10067;</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{userQuestions.length}</div>
            <div className="stat-label" style={{ fontSize: "1rem", color: "var(--theme-light-text-muted)", fontWeight: 400 }}>Questions</div>
          </div>
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "var(--theme-light-text-primary)", fontSize: "1.1rem", fontWeight: 500, minWidth: 120, position: "relative", borderRadius: "var(--radius-lg)", background: "var(--theme-light-background)", boxShadow: "var(--shadow-sm)", padding: "1rem 0.7rem", transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <div className="stat-icon" style={{ fontSize: "1.7rem", marginBottom: "0.2rem", color: "var(--color-primary-500)" }}>&#10004;</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{userAnswers.length}</div>
            <div className="stat-label" style={{ fontSize: "1rem", color: "var(--theme-light-text-muted)", fontWeight: 400 }}>Answers</div>
          </div>
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "var(--theme-light-text-primary)", fontSize: "1.1rem", fontWeight: 500, minWidth: 120, position: "relative", borderRadius: "var(--radius-lg)", background: "var(--theme-light-background)", boxShadow: "var(--shadow-sm)", padding: "1rem 0.7rem", transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <div className="stat-icon" style={{ fontSize: "1.7rem", marginBottom: "0.2rem", color: "var(--color-primary-500)" }}>&#128077;</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{helpfulVotes}</div>
            <div className="stat-label" style={{ fontSize: "1rem", color: "var(--theme-light-text-muted)", fontWeight: 400 }}>Helpful Votes</div>
          </div>
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: "var(--theme-light-text-primary)", fontSize: "1.1rem", fontWeight: 500, minWidth: 120, position: "relative", borderRadius: "var(--radius-lg)", background: "var(--theme-light-background)", boxShadow: "var(--shadow-sm)", padding: "1rem 0.7rem", transition: "box-shadow 0.2s", cursor: "pointer" }}>
            <div className="stat-icon" style={{ fontSize: "1.7rem", marginBottom: "0.2rem", color: "var(--color-primary-500)" }}>&#128065;</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{profileViews}</div>
            <div className="stat-label" style={{ fontSize: "1rem", color: "var(--theme-light-text-muted)", fontWeight: 400 }}>Profile Views</div>
          </div>
        </div>
        {/* Charts Section */}
        <div style={{ maxWidth: 900, margin: "2.5rem auto", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* Bar Chart: Questions vs Answers */}
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", padding: "1.5rem", flex: 1, minWidth: 320, transition: "box-shadow 0.2s" }}>
            <h3 style={{ color: "var(--theme-light-text-primary)", marginBottom: "1rem" }}>Questions vs Answers</h3>
            <svg width="100%" height="120" viewBox="0 0 320 120">
              <rect x="40" y={100 - userQuestions.length} width="60" height={userQuestions.length} fill="var(--color-primary-500)" rx="12" />
              <rect x="140" y={100 - userAnswers.length} width="60" height={userAnswers.length} fill="var(--color-primary-400)" rx="12" />
              <text x="70" y="115" textAnchor="middle" fill="var(--theme-light-text-primary)" fontSize="1rem">Questions</text>
              <text x="170" y="115" textAnchor="middle" fill="var(--theme-light-text-primary)" fontSize="1rem">Answers</text>
              <text x="70" y={100 - userQuestions.length - 10} textAnchor="middle" fill="var(--theme-light-text-primary)" fontSize="1.2rem" fontWeight="bold">{userQuestions.length}</text>
              <text x="170" y={100 - userAnswers.length - 10} textAnchor="middle" fill="var(--theme-light-text-primary)" fontSize="1.2rem" fontWeight="bold">{userAnswers.length}</text>
            </svg>
          </div>
          {/* Activity Heatmap */}
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", padding: "1.5rem", flex: 1, minWidth: 320, transition: "box-shadow 0.2s" }}>
            <h3 style={{ color: "var(--theme-light-text-primary)", marginBottom: "1rem" }}>Daily Activity</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: "4px" }}>
              {userQuestions.slice(0, 98).map((q, i) => {
                // Simulate activity: highlight days with questions
                let color = "var(--theme-light-border)";
                if (q.answers && q.answers.length > 2) color = "var(--color-primary-500)";
                else if (q.answers && q.answers.length > 0) color = "var(--color-primary-400)";
                return (
                  <div key={i} title={`Day ${i + 1}: ${q.answers ? q.answers.length : 0} answers`} style={{ width: 16, height: 16, borderRadius: 4, background: color, transition: "background 0.3s" }}></div>
                );
              })}
            </div>
            <div style={{ color: "var(--theme-light-text-muted)", fontSize: "0.95rem", marginTop: "0.7rem" }}>Recent Activity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
