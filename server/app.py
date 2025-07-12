from flask import Flask
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

from extensions import db

db.init_app(app)

# Import models after db and app are set up
from models import *


# Register blueprints
from routes.questions import questions
from routes.answers import answers
from routes.votes import votes
from routes.users import users

app.register_blueprint(questions)
app.register_blueprint(answers)
app.register_blueprint(votes)
app.register_blueprint(users)

@app.route("/")
def home():
    return "StackIt Flask backend is running!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
