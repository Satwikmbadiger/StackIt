from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Question, User, Tag, QuestionTag, db
from datetime import datetime

questions = Blueprint('questions', __name__)

@questions.route('/questions', methods=['GET'])
def get_questions():
    try:
        # Get all questions with their answers and votes
        questions = Question.query.order_by(Question.created_at.desc()).all()
        
        questions_data = []
        for question in questions:
            # Get user vote for current user (if authenticated)
            user_vote = 0
            if request.headers.get('Authorization'):
                try:
                    from flask_jwt_extended import get_jwt_identity
                    user_id = get_jwt_identity()
                    if user_id:
                        vote = QuestionVote.query.filter_by(
                            user_id=user_id, 
                            question_id=question.id
                        ).first()
                        if vote:
                            user_vote = 1 if vote.vote_type == 'up' else -1
                except:
                    pass
            
            question_dict = question.to_dict()
            question_dict['userVote'] = user_vote
            questions_data.append(question_dict)
        
        return jsonify(questions_data), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch questions"}), 500

@questions.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    try:
        question = Question.query.get(question_id)
        
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        # Get user vote for current user (if authenticated)
        user_vote = 0
        if request.headers.get('Authorization'):
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
                if user_id:
                    vote = QuestionVote.query.filter_by(
                        user_id=user_id, 
                        question_id=question.id
                    ).first()
                    if vote:
                        user_vote = 1 if vote.vote_type == 'up' else -1
            except:
                pass
        
        question_dict = question.to_dict()
        question_dict['userVote'] = user_vote
        
        return jsonify(question_dict), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch question"}), 500

@questions.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({"error": "Title and description are required"}), 400
        
        title = data['title'].strip()
        description = data['description']
        tags = data.get('tags', [])
        
        # Create the question
        question = Question(
            user_id=user_id,
            title=title,
            description=description
        )
        
        db.session.add(question)
        db.session.flush()  # Get the question ID
        
        # Handle tags
        for tag_name in tags:
            tag_name = tag_name.strip()
            if tag_name:
                # Find or create tag
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                    db.session.flush()
                
                # Create question-tag relationship
                question_tag = QuestionTag(
                    question_id=question.id,
                    tag_id=tag.id
                )
                db.session.add(question_tag)
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Question created successfully",
            "question": question.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create question"}), 500

@questions.route('/questions/<int:question_id>', methods=['PUT'])
@jwt_required()
def update_question(question_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        if question.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        if data.get('title'):
            question.title = data['title'].strip()
        if data.get('description'):
            question.description = data['description']
        
        # Handle tags update
        if 'tags' in data:
            # Remove existing tags
            QuestionTag.query.filter_by(question_id=question.id).delete()
            
            # Add new tags
            for tag_name in data['tags']:
                tag_name = tag_name.strip()
                if tag_name:
                    tag = Tag.query.filter_by(name=tag_name).first()
                    if not tag:
                        tag = Tag(name=tag_name)
                        db.session.add(tag)
                        db.session.flush()
                    
                    question_tag = QuestionTag(
                        question_id=question.id,
                        tag_id=tag.id
                    )
                    db.session.add(question_tag)
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Question updated successfully",
            "question": question.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update question"}), 500

@questions.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    try:
        user_id = get_jwt_identity()
        
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        
        if question.user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        db.session.delete(question)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Question deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete question"}), 500

@questions.route('/tags', methods=['GET'])
def get_tags():
    try:
        tags = Tag.query.order_by(Tag.name).all()
        return jsonify([tag.to_dict() for tag in tags]), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch tags"}), 500
