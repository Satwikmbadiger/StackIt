from flask import Blueprint, request, jsonify
from extensions import db
from models import Question

questions = Blueprint("questions", __name__)

@questions.route("/questions", methods=["GET"])
def get_questions():
    all_qns = Question.query.all()
    result = [
        {
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "user_id": q.user_id,
            "created_at": q.created_at
        }
        for q in all_qns
    ]
    return jsonify(result)

@questions.route("/questions", methods=["POST"])
def create_question():
    data = request.get_json()
    new_qn = Question(
        title=data["title"],
        description=data["description"],
        user_id=data["user_id"]
    )
    db.session.add(new_qn)
    db.session.commit()
    return jsonify({"message": "Question posted!"}), 201
