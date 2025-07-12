from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db
from datetime import datetime

users = Blueprint('users', __name__)

@users.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        username = data['username'].strip()
        password = data['password']
        email = data.get('email', f"{username}@example.com")  # Default email if not provided
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({"success": False, "message": "Username already exists"}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "message": "Email already exists"}), 400
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "message": "User registered successfully"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "Registration failed"}), 500

@users.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Find user by username
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Store token in localStorage (frontend will handle this)
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user.to_dict(),
            "token": access_token
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": "Login failed"}), 500

@users.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        return jsonify({
            "success": True,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": "Failed to get user info"}), 500

@users.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT tokens are stateless, so we just return success
    # The frontend should remove the token from localStorage
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200

@users.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        return jsonify({
            "success": True,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": "Failed to get user"}), 500