"""
Script to initialize the database with sample data for development
"""

import os
import sys
from datetime import datetime, timedelta
import random
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import models
from models.user import User
from models.question import Question
from models.answer import Answer
from models.vote import Vote
from models.tag import Tag
from models.notification import Notification

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/stackit')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def seed_database():
    """Seed the database with sample data"""
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        print("Creating sample data...")
        
        # Create users
        users = [
            User(
                username="admin",
                email="admin@stackit.com",
                password="admin123",
                role="admin"
            ),
            User(
                username="johndoe",
                email="john@example.com",
                password="password123"
            ),
            User(
                username="janedoe",
                email="jane@example.com",
                password="password123"
            ),
            User(
                username="bobsmith",
                email="bob@example.com",
                password="password123"
            )
        ]
        
        # Add users to the database
        for user in users:
            existing_user = User.query.filter_by(username=user.username).first()
            if not existing_user:
                db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        # Create tags
        tags = [
            Tag(name="react"),
            Tag(name="javascript"),
            Tag(name="python"),
            Tag(name="flask"),
            Tag(name="sql"),
            Tag(name="postgresql"),
            Tag(name="html"),
            Tag(name="css"),
            Tag(name="tailwind"),
            Tag(name="authentication"),
            Tag(name="jwt"),
            Tag(name="api"),
            Tag(name="vite")
        ]
        
        # Add tags to the database
        for tag in tags:
            existing_tag = Tag.query.filter_by(name=tag.name).first()
            if not existing_tag:
                db.session.add(tag)
        
        db.session.commit()
        print(f"Created {len(tags)} tags")
        
        # Create sample questions
        sample_questions = [
            {
                "title": "How to implement JWT authentication in React?",
                "description": """<p>I'm building a React application that needs to authenticate users with a Flask backend. I've set up JWT on the server side, but I'm not sure how to properly handle the tokens in React.</p>
                <p>Specifically, I have these questions:</p>
                <ul>
                    <li>Where should I store the JWT token? LocalStorage, cookies, or somewhere else?</li>
                    <li>How do I include the token in API requests?</li>
                    <li>What's the best way to handle token expiration?</li>
                </ul>
                <p>Any code examples would be greatly appreciated!</p>""",
                "user_id": 2,  # johndoe
                "tags": ["react", "javascript", "authentication", "jwt"]
            },
            {
                "title": "Optimizing PostgreSQL queries for large datasets",
                "description": """<p>I have a PostgreSQL database with several tables containing millions of records. I've noticed that some of my queries are taking too long to execute, especially when joining multiple tables.</p>
                <p>Here's an example of a slow query:</p>
                <pre><code>SELECT u.username, q.title, COUNT(a.id) as answer_count
FROM users u
JOIN questions q ON u.id = q.user_id
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY u.id, q.id
ORDER BY answer_count DESC;</code></pre>
                <p>This query takes about 15 seconds to execute. How can I optimize it?</p>
                <p>I've already tried adding indexes on the foreign key columns, but it didn't help much.</p>""",
                "user_id": 3,  # janedoe
                "tags": ["postgresql", "sql", "python", "flask"]
            },
            {
                "title": "Best practices for organizing a React + Vite project",
                "description": """<p>I'm starting a new project using React with Vite, and I want to establish a good folder structure from the beginning.</p>
                <p>How do you usually organize your React projects? Specifically:</p>
                <ul>
                    <li>What's your folder structure?</li>
                    <li>How do you organize components, pages, and utilities?</li>
                    <li>Do you use feature-based or type-based organization?</li>
                    <li>How do you handle state management?</li>
                </ul>
                <p>I'd appreciate any advice from experienced React developers who have worked with Vite.</p>""",
                "user_id": 4,  # bobsmith
                "tags": ["react", "javascript", "vite"]
            },
            {
                "title": "Creating a responsive navigation menu with Tailwind CSS",
                "description": """<p>I'm trying to create a responsive navigation menu using Tailwind CSS that works well on both desktop and mobile devices.</p>
                <p>On desktop, it should show all menu items horizontally. On mobile, it should collapse into a hamburger menu.</p>
                <p>I've tried following some tutorials, but I'm having trouble with the mobile menu toggle functionality. Here's what I have so far:</p>
                <pre><code>&lt;nav class="bg-white shadow-md"&gt;
  &lt;div class="container mx-auto px-4"&gt;
    &lt;div class="flex justify-between"&gt;
      &lt;div class="flex"&gt;
        &lt;div class="flex-shrink-0 flex items-center"&gt;
          &lt;img class="h-8 w-auto" src="/logo.svg" alt="Logo"&gt;
        &lt;/div&gt;
        &lt;div class="hidden md:flex"&gt;
          &lt;a href="#" class="px-3 py-2 rounded-md text-sm font-medium"&gt;Home&lt;/a&gt;
          &lt;a href="#" class="px-3 py-2 rounded-md text-sm font-medium"&gt;About&lt;/a&gt;
          &lt;a href="#" class="px-3 py-2 rounded-md text-sm font-medium"&gt;Services&lt;/a&gt;
          &lt;a href="#" class="px-3 py-2 rounded-md text-sm font-medium"&gt;Contact&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="flex items-center md:hidden"&gt;
        &lt;button class="mobile-menu-button"&gt;
          &lt;svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
            &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /&gt;
          &lt;/svg&gt;
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="mobile-menu hidden md:hidden"&gt;
    &lt;a href="#" class="block px-3 py-2 rounded-md text-base font-medium"&gt;Home&lt;/a&gt;
    &lt;a href="#" class="block px-3 py-2 rounded-md text-base font-medium"&gt;About&lt;/a&gt;
    &lt;a href="#" class="block px-3 py-2 rounded-md text-base font-medium"&gt;Services&lt;/a&gt;
    &lt;a href="#" class="block px-3 py-2 rounded-md text-base font-medium"&gt;Contact&lt;/a&gt;
  &lt;/div&gt;
&lt;/nav&gt;</code></pre>
                <p>How do I toggle the mobile menu when the hamburger button is clicked? And are there any other improvements I should make to this code?</p>""",
                "user_id": 2,  # johndoe
                "tags": ["html", "css", "tailwind", "javascript"]
            },
        ]
        
        # Add questions to the database
        questions_added = []
        for q_data in sample_questions:
            # Check if question already exists
            existing = Question.query.filter_by(title=q_data["title"]).first()
            if existing:
                continue
                
            # Create question
            question = Question(
                title=q_data["title"],
                description=q_data["description"],
                user_id=q_data["user_id"],
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 14))
            )
            
            # Add tags
            for tag_name in q_data["tags"]:
                tag = Tag.query.filter_by(name=tag_name).first()
                if tag:
                    question.tags.append(tag)
            
            db.session.add(question)
            questions_added.append(question)
        
        db.session.commit()
        print(f"Created {len(questions_added)} questions")
        
        # Create sample answers
        sample_answers = [
            {
                "question_id": 1,  # JWT authentication question
                "user_id": 3,  # janedoe
                "content": """<p>For JWT authentication in React, here's how I usually handle it:</p>
                <h3>1. Storing the Token</h3>
                <p>You have a few options:</p>
                <ul>
                    <li><strong>localStorage</strong>: Easy to use but vulnerable to XSS attacks</li>
                    <li><strong>httpOnly cookies</strong>: More secure but requires backend configuration</li>
                    <li><strong>Memory</strong>: Secure but lost on page refresh</li>
                </ul>
                <p>For most applications, I recommend httpOnly cookies if possible. If not, localStorage is acceptable with proper XSS protection.</p>
                <h3>2. Including the Token in Requests</h3>
                <p>With axios:</p>
                <pre><code>// Set up an axios instance
const api = axios.create({
  baseURL: 'https://api.example.com',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);</code></pre>
                <h3>3. Handling Token Expiration</h3>
                <p>Add a response interceptor:</p>
                <pre><code>api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);</code></pre>
                <p>Hope this helps!</p>""",
                "accepted": True
            },
            {
                "question_id": 1,  # JWT authentication question
                "user_id": 4,  # bobsmith
                "content": """<p>Another approach is to use the React Context API to manage auth state:</p>
                <pre><code>// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      // Fetch user data
      fetchUserProfile(token);
    }
  }, [token]);
  
  const login = async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};</code></pre>
                <p>This approach centralizes auth logic and makes it available throughout your app.</p>"""
            },
            {
                "question_id": 2,  # PostgreSQL question
                "user_id": 2,  # johndoe
                "content": """<p>I've worked with large PostgreSQL databases before, and here are some optimizations you can try:</p>
                <h3>1. Analyze Your Query</h3>
                <p>Use <code>EXPLAIN ANALYZE</code> to see what's happening:</p>
                <pre><code>EXPLAIN ANALYZE
SELECT u.username, q.title, COUNT(a.id) as answer_count
FROM users u
JOIN questions q ON u.id = q.user_id
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY u.id, q.id
ORDER BY answer_count DESC;</code></pre>
                <p>This will show you where PostgreSQL is spending time.</p>
                <h3>2. Add Proper Indexes</h3>
                <p>Based on your query, you should have these indexes:</p>
                <pre><code>CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);</code></pre>
                <h3>3. Consider Materialized Views</h3>
                <p>If this query runs often but the data doesn't change frequently, consider a materialized view:</p>
                <pre><code>CREATE MATERIALIZED VIEW question_stats AS
SELECT u.id as user_id, u.username, q.id as question_id, q.title, COUNT(a.id) as answer_count
FROM users u
JOIN questions q ON u.id = q.user_id
LEFT JOIN answers a ON q.id = a.question_id
GROUP BY u.id, u.username, q.id, q.title
ORDER BY answer_count DESC;

-- Then refresh it periodically
REFRESH MATERIALIZED VIEW question_stats;</code></pre>
                <h3>4. Optimize the Query</h3>
                <p>Try this alternative query:</p>
                <pre><code>SELECT u.username, q.title, a.answer_count
FROM users u
JOIN questions q ON u.id = q.user_id
LEFT JOIN (
    SELECT question_id, COUNT(id) as answer_count
    FROM answers
    GROUP BY question_id
) a ON q.id = a.question_id
ORDER BY a.answer_count DESC NULLS LAST;</code></pre>
                <p>This pre-aggregates the answers, which might be faster.</p>
                <h3>5. Adjust Database Configuration</h3>
                <p>Make sure your PostgreSQL is configured properly for your hardware. Important parameters:</p>
                <ul>
                    <li><code>shared_buffers</code>: Usually 25% of RAM</li>
                    <li><code>work_mem</code>: Higher for complex sorts and joins</li>
                    <li><code>maintenance_work_mem</code>: Higher for VACUUM operations</li>
                </ul>
                <p>Try these changes and see what works best for your specific case!</p>""",
                "accepted": True
            },
            {
                "question_id": 3,  # React project structure
                "user_id": 2,  # johndoe
                "content": """<p>For a React + Vite project, here's a structure I've found to work well:</p>
                <pre><code>src/
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable components
│   ├── common/    # Very generic components (Button, Input, etc.)
│   ├── layout/    # Layout components (Header, Footer, Sidebar)
│   └── ui/        # More specific UI components
├── hooks/         # Custom React hooks
├── pages/         # Components that represent pages/routes
├── services/      # API services, external integrations
├── store/         # State management (Redux, Zustand, etc.)
├── utils/         # Utility/helper functions
├── App.jsx        # Main App component
└── main.jsx       # Entry point</code></pre>
                <p>For state management, it depends on your app's complexity:</p>
                <ul>
                    <li>Small apps: React Context + useReducer</li>
                    <li>Medium apps: Zustand or Jotai</li>
                    <li>Large apps: Redux Toolkit (with RTK Query for API calls)</li>
                </ul>
                <p>I've found that feature-based organization works well when the app grows larger. In that case, your structure might look like:</p>
                <pre><code>src/
├── features/      # Feature-based organization
│   ├── auth/      # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   ├── users/     # User management feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── products/  # Product management feature
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── store/
├── shared/        # Shared/common code
│   ├── components/
│   ├── hooks/
│   └── utils/
├── App.jsx
└── main.jsx</code></pre>
                <p>This structure scales well and keeps related code together.</p>"""
            },
            {
                "question_id": 4,  # Tailwind navbar
                "user_id": 3,  # janedoe
                "content": """<p>Here's how you can toggle the mobile menu using JavaScript:</p>
                <pre><code>// Add this JavaScript code
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the button and menu
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  // Add click event listener to the button
  menuButton.addEventListener('click', function() {
    // Toggle the 'hidden' class on the mobile menu
    mobileMenu.classList.toggle('hidden');
  });
});</code></pre>
                <p>If you're using React, you can do it this way:</p>
                <pre><code>import React, { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
            </div>
            <div className="hidden md:flex">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium">About</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium">Services</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium">Contact</a>
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="mobile-menu-button"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`mobile-menu md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Home</a>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">About</a>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Services</a>
        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;</code></pre>
                <p>A few improvements to consider:</p>
                <ol>
                  <li>Add transitions for a smoother experience</li>
                  <li>Add active states for the current page</li>
                  <li>Consider adding an overlay behind the mobile menu</li>
                  <li>Add keyboard accessibility (Esc to close, Tab navigation)</li>
                </ol>
                <p>Hope this helps!</p>""",
                "accepted": False
            },
        ]
        
        # Add answers to the database
        answers_added = []
        for a_data in sample_answers:
            # Create answer
            answer = Answer(
                content=a_data["content"],
                question_id=a_data["question_id"],
                user_id=a_data["user_id"],
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 10)),
                accepted=a_data.get("accepted", False)
            )
            
            db.session.add(answer)
            answers_added.append(answer)
        
        db.session.commit()
        print(f"Created {len(answers_added)} answers")
        
        # Add some votes
        votes_added = 0
        for answer in Answer.query.all():
            # Random number of votes
            num_votes = random.randint(1, 3)
            
            for _ in range(num_votes):
                # Random user (excluding the answer author)
                user_ids = [u.id for u in User.query.all() if u.id != answer.user_id]
                if not user_ids:
                    continue
                    
                user_id = random.choice(user_ids)
                
                # Check if vote already exists
                existing = Vote.query.filter_by(
                    answer_id=answer.id,
                    user_id=user_id
                ).first()
                
                if existing:
                    continue
                
                # Random vote type
                vote_type = random.choice(["upvote", "upvote", "upvote", "downvote"])  # More upvotes than downvotes
                
                vote = Vote(
                    answer_id=answer.id,
                    user_id=user_id,
                    vote_type=vote_type,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
                )
                
                db.session.add(vote)
                votes_added += 1
        
        db.session.commit()
        print(f"Created {votes_added} votes")
        
        # Add some notifications
        notifications_added = 0
        for user in User.query.all():
            # Random number of notifications
            num_notifications = random.randint(1, 3)
            
            for i in range(num_notifications):
                # Random notification type
                notification_type = random.choice(["answer", "mention", "vote"])
                
                if notification_type == "answer":
                    # Random question by this user
                    question = Question.query.filter_by(user_id=user.id).first()
                    if not question:
                        continue
                        
                    # Random answer author
                    answer_authors = [u for u in User.query.all() if u.id != user.id]
                    if not answer_authors:
                        continue
                        
                    author = random.choice(answer_authors)
                    
                    message = f"{author.username} answered your question: {question.title}"
                    link = f"/questions/{question.id}"
                    
                elif notification_type == "mention":
                    # Random question
                    question = Question.query.first()
                    if not question:
                        continue
                        
                    # Random mentioner
                    mentioners = [u for u in User.query.all() if u.id != user.id]
                    if not mentioners:
                        continue
                        
                    mentioner = random.choice(mentioners)
                    
                    message = f"{mentioner.username} mentioned you in a question: {question.title}"
                    link = f"/questions/{question.id}"
                    
                else:  # vote
                    # Random answer by this user
                    answer = Answer.query.filter_by(user_id=user.id).first()
                    if not answer:
                        continue
                        
                    # Random voter
                    voters = [u for u in User.query.all() if u.id != user.id]
                    if not voters:
                        continue
                        
                    voter = random.choice(voters)
                    
                    # Get the question
                    question = Question.query.get(answer.question_id)
                    if not question:
                        continue
                    
                    message = f"{voter.username} upvoted your answer to: {question.title}"
                    link = f"/questions/{question.id}#answer-{answer.id}"
                
                # Create notification
                notification = Notification(
                    user_id=user.id,
                    message=message,
                    link=link,
                    is_read=random.choice([True, False]),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
                )
                
                db.session.add(notification)
                notifications_added += 1
        
        db.session.commit()
        print(f"Created {notifications_added} notifications")
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
