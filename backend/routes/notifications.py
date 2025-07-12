from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.notification import Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    
    # Get unread notifications first, then read ones, all ordered by creation date (newest first)
    notifications = Notification.query.filter_by(user_id=current_user_id).order_by(
        Notification.is_read.asc(), 
        Notification.created_at.desc()
    ).all()
    
    return jsonify([notification.to_dict() for notification in notifications]), 200


@notifications_bp.route('/notifications/unread/count', methods=['GET'])
@jwt_required()
def get_unread_count():
    current_user_id = get_jwt_identity()
    
    # Count unread notifications
    count = Notification.query.filter_by(user_id=current_user_id, is_read=False).count()
    
    return jsonify({'count': count}), 200


@notifications_bp.route('/notifications/mark-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    current_user_id = get_jwt_identity()
    
    # Mark all notifications as read
    Notification.query.filter_by(user_id=current_user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    
    return jsonify({'message': 'All notifications marked as read'}), 200


@notifications_bp.route('/notifications/<int:notification_id>/mark-read', methods=['POST'])
@jwt_required()
def mark_read(notification_id):
    current_user_id = get_jwt_identity()
    
    # Find notification
    notification = Notification.query.get_or_404(notification_id)
    
    # Check if notification belongs to the current user
    if notification.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Mark as read
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200
