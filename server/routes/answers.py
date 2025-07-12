from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Answer, Question, User, AnswerVote, Notification, db
from datetime import datetime

answers = Blueprint('answers', __name__)

@answers.route('/answers', methods=['POST'])
def create_answer():
    try:
        data = request.get_json()
        user_id = data.get('user_id')  # Accept user_id from frontend for demo
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        if not data or not data.get('questionId') or not data.get('content'):
            return jsonify({"error": "Question ID and content are required"}), 400
        
        question_id = data['questionId']
        content = data['content']
        
        # Check if question exists
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        # Create the answer
        answer = Answer(
            question_id=question_id,
            user_id=user_id,
            content=content
        )
        
        db.session.add(answer)
        db.session.flush()  # Get the answer ID
        
        # Create notification for question owner
        if question.user_id != int(user_id):  # Don't notify if answering own question
            notification = Notification(
                user_id=question.user_id,
                message=f"{User.query.get(user_id).username} answered your question: {question.title}",
                notification_type='answer',
                related_id=question_id
            )
            db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Answer posted successfully",
            "answer": answer.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to post answer"}), 500

@answers.route('/answers/<int:answer_id>', methods=['GET'])
def get_answer(answer_id):
    try:
        answer = Answer.query.get(answer_id)
        
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        
        # Get user vote for current user (if authenticated)
        user_vote = 0
        if request.headers.get('Authorization'):
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
                if user_id:
                    vote = AnswerVote.query.filter_by(
                        user_id=user_id, 
                        answer_id=answer.id
                    ).first()
                    if vote:
                        user_vote = 1 if vote.vote_type == 'up' else -1
            except:
                pass
        
        answer_dict = answer.to_dict()
        answer_dict['userVote'] = user_vote
        
        return jsonify(answer_dict), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch answer"}), 500

@answers.route('/answers/<int:answer_id>', methods=['PUT'])
@jwt_required()
def update_answer(answer_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        
        if answer.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        if data.get('content'):
            answer.content = data['content']
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Answer updated successfully",
            "answer": answer.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update answer"}), 500

@answers.route('/answers/<int:answer_id>', methods=['DELETE'])
@jwt_required()
def delete_answer(answer_id):
    try:
        user_id = get_jwt_identity()
        
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        
        if answer.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        db.session.delete(answer)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Answer deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete answer"}), 500

@answers.route('/answers/accept', methods=['POST'])
@jwt_required()
def accept_answer():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data or not data.get('answerId'):
            return jsonify({"error": "Answer ID is required"}), 400
        
        answer_id = data['answerId']
        answer = Answer.query.get(answer_id)
        
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        
        # Check if user is the question owner
        question = Question.query.get(answer.question_id)
        if question.user_id != user_id:
            return jsonify({"error": "Only question owner can accept answers"}), 403
        
        # Unaccept any previously accepted answer for this question
        Question.query.filter_by(id=answer.question_id).update({'accepted_answer_id': None})
        Answer.query.filter_by(question_id=answer.question_id).update({'is_accepted': False})
        
        # Accept this answer
        answer.is_accepted = True
        question.accepted_answer_id = answer.id
        
        # Create notification for answer author
        if answer.user_id != user_id:  # Don't notify if accepting own answer
            notification = Notification(
                user_id=answer.user_id,
                message=f"Your answer to '{question.title}' was accepted!",
                notification_type='accept',
                related_id=answer.question_id
            )
            db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Answer accepted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to accept answer"}), 500
