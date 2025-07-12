from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.question import Question
from models.tag import Tag
from models.user import User
from models.notification import Notification
import re  # For parsing mentions

questions_bp = Blueprint('questions', __name__)

@questions_bp.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['title', 'description', 'tags']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate title length
    if len(data['title']) > 150:
        return jsonify({'error': 'Title must be less than 150 characters'}), 400
    
    # Validate tags
    if not data['tags'] or len(data['tags']) == 0:
        return jsonify({'error': 'At least one tag is required'}), 400
    
    # Create new question
    question = Question(
        title=data['title'],
        description=data['description'],
        user_id=current_user_id
    )
    
    # Add tags to question
    for tag_name in data['tags']:
        # Check if tag exists, create if not
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        
        question.tags.append(tag)
    
    # Check for mentions in the description
    mentioned_users = set()
    for match in re.finditer(r'@(\w+)', data['description']):
        username = match.group(1)
        user = User.query.filter_by(username=username).first()
        if user and user.id != current_user_id:
            mentioned_users.add(user)
    
    db.session.add(question)
    db.session.commit()
    
    # Create notifications for mentioned users
    author = User.query.get(current_user_id)
    for user in mentioned_users:
        notification = Notification(
            user_id=user.id,
            message=f"{author.username} mentioned you in a question: {data['title']}",
            link=f"/questions/{question.id}"
        )
        db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Question created successfully',
        'question': question.to_dict()
    }), 201


@questions_bp.route('/questions', methods=['GET'])
def get_questions():
    # Get query parameters
    tag = request.args.get('tag')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Build query
    query = Question.query
    
    # Filter by tag if provided
    if tag:
        query = query.join(Question.tags).filter(Tag.name == tag)
    
    # Order by created_at (newest first)
    query = query.order_by(Question.created_at.desc())
    
    # Paginate results
    questions_page = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'questions': [q.to_dict() for q in questions_page.items],
        'total': questions_page.total,
        'pages': questions_page.pages,
        'current_page': page
    }), 200


@questions_bp.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = Question.query.get_or_404(question_id)
    
    # Get question details with related data
    question_data = question.to_dict()
    
    # Get answers for the question
    answers = [answer.to_dict() for answer in question.answers]
    
    # Sort answers by vote count (highest first) and accepted status
    answers.sort(key=lambda a: (not a['accepted'], -a['vote_count']))
    
    question_data['answers'] = answers
    
    return jsonify(question_data), 200


@questions_bp.route('/questions/<int:question_id>', methods=['PUT'])
@jwt_required()
def update_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get_or_404(question_id)
    
    # Check if user is the author
    if question.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update fields if provided
    if 'title' in data:
        if len(data['title']) > 150:
            return jsonify({'error': 'Title must be less than 150 characters'}), 400
        question.title = data['title']
    
    if 'description' in data:
        question.description = data['description']
    
    if 'tags' in data and data['tags']:
        # Clear existing tags
        question.tags = []
        
        # Add new tags
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            
            question.tags.append(tag)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Question updated successfully',
        'question': question.to_dict()
    }), 200


@questions_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    question = Question.query.get_or_404(question_id)
    
    # Check if user is the author or an admin
    if question.user_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(question)
    db.session.commit()
    
    return jsonify({'message': 'Question deleted successfully'}), 200
