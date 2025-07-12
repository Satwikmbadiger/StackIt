from flask import Blueprint, jsonify
from models import db
from models.tag import Tag

tags_bp = Blueprint('tags', __name__)

@tags_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    return jsonify([tag.to_dict() for tag in tags]), 200


@tags_bp.route('/tags/popular', methods=['GET'])
def get_popular_tags():
    # Get tags ordered by the number of questions they are associated with
    tags = Tag.query.join(Tag.questions).group_by(Tag.id).order_by(db.func.count(Tag.questions).desc()).limit(10).all()
    
    # Add question count to each tag
    result = []
    for tag in tags:
        tag_dict = tag.to_dict()
        tag_dict['question_count'] = len(tag.questions)
        result.append(tag_dict)
    
    return jsonify(result), 200
