from flask import Blueprint

users = Blueprint('users', __name__)

@users.route('/users')
def get_users():
    return "Users route works!"