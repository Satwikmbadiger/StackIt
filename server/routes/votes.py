from flask import Blueprint, request, jsonify
from extensions import db
from models import Vote

votes = Blueprint("votes", __name__)

@votes.route("/votes", methods=["POST"])
def vote():
    data = request.get_json()
    new_vote = Vote(
        user_id=data["user_id"],
        answer_id=data["answer_id"],
        vote_type=data["vote_type"]
    )
    db.session.add(new_vote)
    db.session.commit()
    return jsonify({"message": "Vote registered!"}), 201
