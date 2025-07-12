from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


@users_bp.route('/users/<int:user_id>/questions', methods=['GET'])
def get_user_questions(user_id):
    # Check if user exists
    user = User.query.get_or_404(user_id)
    
    # Get query parameters for pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Get the user's questions, ordered by creation date (newest first)
    questions_page = user.questions.order_by(db.desc('created_at')).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'questions': [question.to_dict() for question in questions_page.items],
        'total': questions_page.total,
        'pages': questions_page.pages,
        'current_page': page
    }), 200


@users_bp.route('/users/<int:user_id>/answers', methods=['GET'])
def get_user_answers(user_id):
    # Check if user exists
    user = User.query.get_or_404(user_id)
    
    # Get query parameters for pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Get the user's answers, ordered by creation date (newest first)
    answers_page = user.answers.order_by(db.desc('created_at')).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'answers': [answer.to_dict() for answer in answers_page.items],
        'total': answers_page.total,
        'pages': answers_page.pages,
        'current_page': page
    }), 200


@users_bp.route('/users/<string:username>/exists', methods=['GET'])
def check_username(username):
    user = User.query.filter_by(username=username).first()
    return jsonify({'exists': user is not None}), 200
