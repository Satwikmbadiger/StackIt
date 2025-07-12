from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/stackit')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Import models
from models.user import User
from models.question import Question
from models.answer import Answer
from models.vote import Vote
from models.tag import Tag
from models.notification import Notification

# Import routes
from routes.auth import auth_bp
from routes.questions import questions_bp
from routes.answers import answers_bp
from routes.users import users_bp
from routes.tags import tags_bp
from routes.notifications import notifications_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(questions_bp, url_prefix='/api')
app.register_blueprint(answers_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(tags_bp, url_prefix='/api')
app.register_blueprint(notifications_bp, url_prefix='/api')

@app.route('/')
def index():
    return {"message": "Welcome to StackIt API"}

if __name__ == '__main__':
    # Create all database tables
    with app.app_context():
        db.create_all()
    
    # Run the app
    app.run(debug=True)
