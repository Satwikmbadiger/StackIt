from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import QuestionVote, AnswerVote, Question, Answer, User, Notification, db
from datetime import datetime

votes = Blueprint('votes', __name__)

@votes.route('/votes', methods=['POST'])
def vote():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        if not data or not data.get('type') or not data.get('id') or not data.get('delta'):
            return jsonify({"error": "Type, ID, and delta are required"}), 400
        
        vote_type = data['type']  # 'questions' or 'answers'
        item_id = data['id']
        delta = data['delta']  # 1 for upvote, -1 for downvote, 0 for remove vote
        
        if vote_type == 'questions':
            return handle_question_vote(int(user_id), item_id, delta)
        elif vote_type == 'answers':
            return handle_answer_vote(int(user_id), item_id, delta)
        else:
            return jsonify({"error": "Invalid vote type"}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to process vote"}), 500

def handle_question_vote(user_id, question_id, delta):
    try:
        # Check if question exists
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        # Check if user is voting on their own question
        if question.user_id == user_id:
            return jsonify({"error": "Cannot vote on your own question"}), 400
        
        # Find existing vote
        existing_vote = QuestionVote.query.filter_by(
            user_id=user_id, 
            question_id=question_id
        ).first()
        
        if delta == 0:
            # Remove vote
            if existing_vote:
                db.session.delete(existing_vote)
                db.session.commit()
                return jsonify({"success": True, "message": "Vote removed"}), 200
            else:
                return jsonify({"error": "No vote to remove"}), 400
        
        # Determine vote type
        vote_type = 'up' if delta == 1 else 'down'
        
        if existing_vote:
            if existing_vote.vote_type == vote_type:
                # Same vote type, remove it
                db.session.delete(existing_vote)
                db.session.commit()
                return jsonify({"success": True, "message": "Vote removed"}), 200
            else:
                # Different vote type, update it
                existing_vote.vote_type = vote_type
                db.session.commit()
                return jsonify({"success": True, "message": "Vote updated"}), 200
        else:
            # Create new vote
            new_vote = QuestionVote(
                user_id=user_id,
                question_id=question_id,
                vote_type=vote_type
            )
            db.session.add(new_vote)
            db.session.commit()
            return jsonify({"success": True, "message": "Vote recorded"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to process question vote"}), 500

def handle_answer_vote(user_id, answer_id, delta):
    try:
        # Check if answer exists
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        
        # Check if user is voting on their own answer
        if answer.user_id == user_id:
            return jsonify({"error": "Cannot vote on your own answer"}), 400
        
        # Find existing vote
        existing_vote = AnswerVote.query.filter_by(
            user_id=user_id, 
            answer_id=answer_id
        ).first()
        
        if delta == 0:
            # Remove vote
            if existing_vote:
                db.session.delete(existing_vote)
                db.session.commit()
                return jsonify({"success": True, "message": "Vote removed"}), 200
            else:
                return jsonify({"error": "No vote to remove"}), 400
        
        # Determine vote type
        vote_type = 'up' if delta == 1 else 'down'
        
        if existing_vote:
            if existing_vote.vote_type == vote_type:
                # Same vote type, remove it
                db.session.delete(existing_vote)
                db.session.commit()
                return jsonify({"success": True, "message": "Vote removed"}), 200
            else:
                # Different vote type, update it
                existing_vote.vote_type = vote_type
                db.session.commit()
                return jsonify({"success": True, "message": "Vote updated"}), 200
        else:
            # Create new vote
            new_vote = AnswerVote(
                user_id=user_id,
                answer_id=answer_id,
                vote_type=vote_type
            )
            db.session.add(new_vote)
            db.session.commit()
            return jsonify({"success": True, "message": "Vote recorded"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to process answer vote"}), 500

@votes.route('/votes/question/<int:question_id>', methods=['GET'])
def get_question_votes(question_id):
    try:
        votes = QuestionVote.query.filter_by(question_id=question_id).all()
        vote_data = []
        
        for vote in votes:
            user = User.query.get(vote.user_id)
            vote_data.append({
                'id': vote.id,
                'user_id': vote.user_id,
                'username': user.username if user else 'Unknown',
                'vote_type': vote.vote_type,
                'created_at': vote.created_at.isoformat()
            })
        
        return jsonify(vote_data), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch question votes"}), 500

@votes.route('/votes/answer/<int:answer_id>', methods=['GET'])
def get_answer_votes(answer_id):
    try:
        votes = AnswerVote.query.filter_by(answer_id=answer_id).all()
        vote_data = []
        
        for vote in votes:
            user = User.query.get(vote.user_id)
            vote_data.append({
                'id': vote.id,
                'user_id': vote.user_id,
                'username': user.username if user else 'Unknown',
                'vote_type': vote.vote_type,
                'created_at': vote.created_at.isoformat()
            })
        
        return jsonify(vote_data), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch answer votes"}), 500
