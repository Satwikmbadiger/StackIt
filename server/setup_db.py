#!/usr/bin/env python3
"""
Database setup script for StackIt
This script initializes the database and creates default tags
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, Tag

def setup_database():
    """Initialize the database and create default tags"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Create default tags if they don't exist
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
        
        tags_created = 0
        for tag_name in default_tags:
            existing_tag = Tag.query.filter_by(name=tag_name).first()
            if not existing_tag:
                new_tag = Tag(name=tag_name)
                db.session.add(new_tag)
                tags_created += 1
        
        db.session.commit()
        print(f"✅ {tags_created} default tags created successfully!")
        print("✅ Database setup completed!")

if __name__ == "__main__":
    print("🚀 Setting up StackIt database...")
    setup_database() 