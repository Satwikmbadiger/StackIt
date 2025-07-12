from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Notification, User, db
from datetime import datetime

notifications = Blueprint('notifications', __name__)

@notifications.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        
        # Get user's notifications, ordered by most recent first
        notifications = Notification.query.filter_by(
            user_id=user_id
        ).order_by(Notification.created_at.desc()).limit(50).all()
        
        notifications_data = [notification.to_dict() for notification in notifications]
        
        return jsonify(notifications_data), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch notifications"}), 500

@notifications.route('/notifications/unread', methods=['GET'])
@jwt_required()
def get_unread_count():
    try:
        user_id = get_jwt_identity()
        
        # Count unread notifications
        unread_count = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).count()
        
        return jsonify({"unread_count": unread_count}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to get unread count"}), 500

@notifications.route('/notifications/mark-read', methods=['POST'])
@jwt_required()
def mark_notifications_read():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if data and data.get('notification_id'):
            # Mark specific notification as read
            notification_id = data['notification_id']
            notification = Notification.query.filter_by(
                id=notification_id,
                user_id=user_id
            ).first()
            
            if notification:
                notification.is_read = True
                db.session.commit()
                return jsonify({"success": True, "message": "Notification marked as read"}), 200
            else:
                return jsonify({"error": "Notification not found"}), 404
        else:
            # Mark all notifications as read
            Notification.query.filter_by(
                user_id=user_id,
                is_read=False
            ).update({'is_read': True})
            
            db.session.commit()
            return jsonify({"success": True, "message": "All notifications marked as read"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to mark notifications as read"}), 500

@notifications.route('/notifications/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    try:
        user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=user_id
        ).first()
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Notification deleted"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete notification"}), 500

@notifications.route('/notifications/clear-all', methods=['DELETE'])
@jwt_required()
def clear_all_notifications():
    try:
        user_id = get_jwt_identity()
        
        # Delete all user's notifications
        Notification.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        
        return jsonify({"success": True, "message": "All notifications cleared"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to clear notifications"}), 500

# Helper function to create notifications (used by other routes)
def create_notification(user_id, message, notification_type='general', related_id=None):
    try:
        notification = Notification(
            user_id=user_id,
            message=message,
            notification_type=notification_type,
            related_id=related_id
        )
        db.session.add(notification)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return False
