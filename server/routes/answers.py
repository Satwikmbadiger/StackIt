from flask import Blueprint, request, jsonify
from extensions import db
from models import Answer

answers = Blueprint("answers", __name__)

@answers.route("/answers/<int:question_id>", methods=["GET"])
def get_answers(question_id):
    ans = Answer.query.filter_by(question_id=question_id).all()
    result = [
        {
            "id": a.id,
            "content": a.content,
            "user_id": a.user_id,
            "is_accepted": a.is_accepted,
            "created_at": a.created_at
        }
        for a in ans
    ]
    return jsonify(result)

@answers.route("/answers/<int:question_id>", methods=["POST"])
def add_answer(question_id):
    data = request.get_json()
    new_ans = Answer(
        content=data["content"],
        user_id=data["user_id"],
        question_id=question_id
    )
    db.session.add(new_ans)
    db.session.commit()
    return jsonify({"message": "Answer posted!"}), 201
