from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.answer import Answer
from models.question import Question
from models.user import User
from models.notification import Notification
from models.vote import Vote
import re  # For parsing mentions

answers_bp = Blueprint('answers', __name__)

@answers_bp.route('/answers', methods=['POST'])
@jwt_required()
def create_answer():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['content', 'question_id']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify question exists
    question = Question.query.get(data['question_id'])
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Create new answer
    answer = Answer(
        content=data['content'],
        question_id=data['question_id'],
        user_id=current_user_id
    )
    
    db.session.add(answer)
    
    # Create notification for question author if not the same as answer author
    if question.user_id != current_user_id:
        answerer = User.query.get(current_user_id)
        notification = Notification(
            user_id=question.user_id,
            message=f"{answerer.username} answered your question: {question.title}",
            link=f"/questions/{question.id}#answer-{answer.id}"
        )
        db.session.add(notification)
    
    # Check for mentions in the answer
    mentioned_users = set()
    for match in re.finditer(r'@(\w+)', data['content']):
        username = match.group(1)
        user = User.query.filter_by(username=username).first()
        if user and user.id != current_user_id:
            mentioned_users.add(user)
    
    db.session.commit()
    
    # Create notifications for mentioned users
    author = User.query.get(current_user_id)
    for user in mentioned_users:
        # Skip if the user is the question author (already notified)
        if user.id == question.user_id:
            continue
            
        notification = Notification(
            user_id=user.id,
            message=f"{author.username} mentioned you in an answer to: {question.title}",
            link=f"/questions/{question.id}#answer-{answer.id}"
        )
        db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Answer created successfully',
        'answer': answer.to_dict()
    }), 201


@answers_bp.route('/answers/<int:answer_id>', methods=['PUT'])
@jwt_required()
def update_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get_or_404(answer_id)
    
    # Check if user is the author
    if answer.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update content if provided
    if 'content' in data:
        answer.content = data['content']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Answer updated successfully',
        'answer': answer.to_dict()
    }), 200


@answers_bp.route('/answers/<int:answer_id>', methods=['DELETE'])
@jwt_required()
def delete_answer(answer_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    answer = Answer.query.get_or_404(answer_id)
    
    # Check if user is the author or an admin
    if answer.user_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(answer)
    db.session.commit()
    
    return jsonify({'message': 'Answer deleted successfully'}), 200


@answers_bp.route('/answers/<int:answer_id>/accept', methods=['POST'])
@jwt_required()
def accept_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.get_or_404(answer_id)
    question = Question.query.get(answer.question_id)
    
    # Check if user is the question author
    if question.user_id != current_user_id:
        return jsonify({'error': 'Only the question author can accept an answer'}), 403
    
    # Reset any previously accepted answers for this question
    for a in question.answers:
        if a.accepted:
            a.accepted = False
    
    # Accept this answer
    answer.accepted = True
    db.session.commit()
    
    # Notify the answer author that their answer was accepted
    if answer.user_id != current_user_id:
        notification = Notification(
            user_id=answer.user_id,
            message=f"Your answer to '{question.title}' was accepted",
            link=f"/questions/{question.id}#answer-{answer.id}"
        )
        db.session.add(notification)
        db.session.commit()
    
    return jsonify({
        'message': 'Answer accepted successfully',
        'answer': answer.to_dict()
    }), 200


@answers_bp.route('/votes', methods=['POST'])
@jwt_required()
def vote():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['answer_id', 'vote_type']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate vote type
    if data['vote_type'] not in ['upvote', 'downvote']:
        return jsonify({'error': 'Invalid vote type'}), 400
    
    # Check if answer exists
    answer = Answer.query.get(data['answer_id'])
    if not answer:
        return jsonify({'error': 'Answer not found'}), 404
    
    # Check if user has already voted on this answer
    existing_vote = Vote.query.filter_by(
        answer_id=data['answer_id'],
        user_id=current_user_id
    ).first()
    
    if existing_vote:
        # If vote type is the same, remove the vote (toggle off)
        if existing_vote.vote_type == data['vote_type']:
            db.session.delete(existing_vote)
            db.session.commit()
            return jsonify({
                'message': 'Vote removed successfully',
                'answer': answer.to_dict()
            }), 200
        else:
            # If vote type is different, update the vote
            existing_vote.vote_type = data['vote_type']
    else:
        # Create new vote
        vote = Vote(
            answer_id=data['answer_id'],
            user_id=current_user_id,
            vote_type=data['vote_type']
        )
        db.session.add(vote)
    
    db.session.commit()
    
    # If this is an upvote and the user is not the answer author, notify the author
    if data['vote_type'] == 'upvote' and not existing_vote and answer.user_id != current_user_id:
        voter = User.query.get(current_user_id)
        question = Question.query.get(answer.question_id)
        notification = Notification(
            user_id=answer.user_id,
            message=f"{voter.username} upvoted your answer to: {question.title}",
            link=f"/questions/{question.id}#answer-{answer.id}"
        )
        db.session.add(notification)
        db.session.commit()
    
    return jsonify({
        'message': 'Vote recorded successfully',
        'answer': answer.to_dict()
    }), 200
