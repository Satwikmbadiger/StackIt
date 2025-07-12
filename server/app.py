from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import timedelta
from config import config
import traceback

# Get configuration
config_name = os.getenv('FLASK_ENV', 'development')
app = Flask(__name__)
app.config.from_object(config[config_name])

# Set JWT expiration
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

# Initialize extensions
from extensions import db
db.init_app(app)

# Initialize JWT
jwt = JWTManager(app)

# Enable CORS
CORS(app)  # Allow all origins for debugging

# Add JWT error handlers for better debugging
@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    from flask import request
    print("[JWT ERROR] Missing or invalid Authorization header")
    print(f"Request path: {request.path}")
    print(f"Request headers: {dict(request.headers)}")
    return jsonify({"error": "Missing or invalid Authorization header"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(callback):
    from flask import request
    print("[JWT ERROR] Invalid JWT token")
    print(f"Request path: {request.path}")
    print(f"Request headers: {dict(request.headers)}")
    return jsonify({"error": "Invalid JWT token"}), 401

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    from flask import request
    print("[JWT ERROR] Expired JWT token")
    print(f"Request path: {request.path}")
    print(f"Request headers: {dict(request.headers)}")
    return jsonify({"error": "Expired JWT token"}), 401

# Import models after db and app are set up
from models import *

# Register blueprints
from routes.questions import questions
from routes.answers import answers
from routes.votes import votes
from routes.users import users
from routes.notifications import notifications

app.register_blueprint(questions, url_prefix='/api')
app.register_blueprint(answers, url_prefix='/api')
app.register_blueprint(votes, url_prefix='/api')
app.register_blueprint(users, url_prefix='/api')
app.register_blueprint(notifications, url_prefix='/api')

@app.route("/")
def home():
    return "StackIt Flask backend is running!"

@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "message": "StackIt API is running!"})

@app.route("/api/debug_post", methods=["POST"])
def debug_post():
    from flask import request
    print("[DEBUG] /api/debug_post called")
    print(f"Headers: {dict(request.headers)}")
    print(f"Data: {request.data}")
    try:
        json_data = request.get_json(force=True)
        print(f"JSON: {json_data}")
        return jsonify({"received": json_data}), 200
    except Exception as e:
        print(f"JSON decode error: {e}")
        return jsonify({"error": str(e)}), 400

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(422)
def unprocessable_entity(error):
    from flask import request
    print("[ERROR] 422 Unprocessable Entity")
    print(f"Request data: {request.data}")
    print(f"Request headers: {dict(request.headers)}")
    print(f"Error: {error}")
    return jsonify({"error": "Unprocessable entity", "details": str(error)}), 422

@app.errorhandler(Exception)
def handle_exception(e):
    from flask import request
    print("[ERROR] Unhandled Exception")
    print(f"Request path: {request.path}")
    print(f"Request method: {request.method}")
    print(f"Request data: {request.data}")
    print(f"Request headers: {dict(request.headers)}")
    print(f"Exception: {e}")
    traceback.print_exc()
    return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
        # Create some default tags if they don't exist
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
        print("Database initialized with default tags!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
