#!/usr/bin/env python3
"""
Setup script for StackIt backend
Creates the database and adds sample data
"""

import os
import sys
from app import app, db
from models import User, Tag, Question, Answer, QuestionTag
from datetime import datetime

def setup_database():
    """Initialize the database with tables and sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Create default tags
        default_tags = [
            'React', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
            'TypeScript', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
            'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'GraphQL', 'REST',
            'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Docker', 'Kubernetes', 'AWS',
            'Azure', 'GCP', 'Firebase', 'Heroku', 'Vercel', 'Netlify', 'Git', 'GitHub', 'GitLab',
            'CI/CD', 'Testing', 'Jest', 'Cypress', 'Selenium', 'Webpack', 'Babel', 'ESLint',
            'Prettier', 'Tailwind', 'Bootstrap', 'Material-UI', 'Ant Design', 'CSS', 'HTML',
            'SASS', 'LESS', 'Vite', 'Parcel', 'npm', 'yarn', 'pnpm', 'Linux', 'Windows',
            'macOS', 'Ubuntu', 'CentOS', 'Debian', 'Alpine', 'Nginx', 'Apache', 'IIS', 'JWT',
            'OAuth', 'OpenID', 'SAML', 'LDAP', 'Active Directory', 'SSO', 'MFA', '2FA', 'HTTPS',
            'SSL', 'TLS', 'API', 'Microservices', 'Monolith', 'Serverless', 'Lambda', 'Functions',
            'Event-Driven', 'Message Queues', 'RabbitMQ', 'Apache Kafka', 'Redis Pub/Sub', 'WebSockets',
            'Socket.io', 'SignalR', 'gRPC', 'Protocol Buffers', 'JSON', 'XML', 'YAML', 'TOML',
            'Markdown', 'LaTeX', 'MathJax', 'KaTeX', 'Chart.js', 'D3.js', 'Three.js', 'WebGL',
            'Canvas', 'SVG', 'PWA', 'Service Workers', 'IndexedDB', 'LocalStorage', 'SessionStorage',
            'Cookies', 'CORS', 'CSP', 'XSS', 'CSRF', 'SQL Injection', 'Rate Limiting', 'Caching',
            'CDN', 'Load Balancing', 'Auto Scaling', 'Monitoring', 'Logging', 'Analytics', 'SEO',
            'Accessibility', 'WCAG', 'ARIA', 'Semantic HTML', 'Progressive Enhancement', 'Graceful Degradation'
        ]
        
        for tag_name in default_tags:
            existing_tag = Tag.query.filter_by(name=tag_name).first()
            if not existing_tag:
                new_tag = Tag(name=tag_name)
                db.session.add(new_tag)
        
        db.session.commit()
        print("✅ Default tags created successfully!")
        
        # Create sample user
        sample_user = User.query.filter_by(username='demo').first()
        if not sample_user:
            sample_user = User(username='demo', email='demo@stackit.com')
            sample_user.set_password('demo')
            db.session.add(sample_user)
            db.session.commit()
            print("✅ Sample user 'demo' created with password 'demo'!")
        
        # Create sample question
        sample_question = Question.query.filter_by(title='Welcome to StackIt!').first()
        if not sample_question:
            sample_question = Question(
                user_id=sample_user.id,
                title='Welcome to StackIt!',
                description='<p><strong>Welcome to StackIt!</strong></p><p>This is a sample question to demonstrate the platform features:</p><ul><li>Rich text formatting</li><li>Tag system</li><li>Voting functionality</li><li>Answer acceptance</li><li>Notification system</li></ul><p>Feel free to ask your own questions and explore the platform!</p>'
            )
            db.session.add(sample_question)
            db.session.flush()
            
            # Add tags to sample question
            sample_tags = ['React', 'JavaScript', 'StackIt']
            for tag_name in sample_tags:
                tag = Tag.query.filter_by(name=tag_name).first()
                if tag:
                    question_tag = QuestionTag(
                        question_id=sample_question.id,
                        tag_id=tag.id
                    )
                    db.session.add(question_tag)
            
            # Create sample answer
            sample_answer = Answer(
                question_id=sample_question.id,
                user_id=sample_user.id,
                content='<p>This is a sample answer to demonstrate the answer functionality!</p><p>You can:</p><ul><li>Format your answers with rich text</li><li>Vote on answers</li><li>Accept the best answer</li></ul>'
            )
            db.session.add(sample_answer)
            
            db.session.commit()
            print("✅ Sample question and answer created!")
        
        print("\n🎉 Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Run the Flask server: python app.py")
        print("2. Start the React frontend: cd ../client && npm start")
        print("3. Login with username: 'demo', password: 'demo'")
        print("\n🌐 The application will be available at:")
        print("- Frontend: http://localhost:3000")
        print("- Backend API: http://localhost:5000")

if __name__ == '__main__':
    setup_database() 