from extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# ----------------------
# User Table
# ----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='author', lazy=True, foreign_keys='Question.user_id')
    answers = db.relationship('Answer', backref='author', lazy=True, foreign_keys='Answer.user_id')
    question_votes = db.relationship('QuestionVote', backref='user', lazy=True)
    answer_votes = db.relationship('AnswerVote', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

# ----------------------
# Question Table
# ----------------------
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)  # rich HTML content
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=True)
    
    # Relationships
    answers = db.relationship('Answer', backref='question', lazy=True, cascade='all, delete-orphan', foreign_keys='Answer.question_id')
    question_tags = db.relationship('QuestionTag', backref='question', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('QuestionVote', backref='question', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_answers=True, include_votes=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'author': self.author.username,
            'created_at': self.created_at.isoformat(),
            'tags': [qt.tag.name for qt in self.question_tags],
            'acceptedAnswerId': self.accepted_answer_id,
            'votes': sum(1 if v.vote_type == 'up' else -1 for v in self.votes) if include_votes else 0
        }
        
        if include_answers:
            data['answers'] = [answer.to_dict() for answer in self.answers]
        
        return data

# ----------------------
# Tag Table
# ----------------------
class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

# ----------------------
# QuestionTag (many-to-many)
# ----------------------
class QuestionTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'), nullable=False)
    
    # Relationship
    tag = db.relationship('Tag', backref='question_tags')

# ----------------------
# Answer Table
# ----------------------
class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)  # rich HTML content
    is_accepted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    votes = db.relationship('AnswerVote', backref='answer', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_votes=True):
        data = {
            'id': self.id,
            'content': self.content,
            'author': self.author.username,
            'created_at': self.created_at.isoformat(),
            'accepted': self.is_accepted,
            'votes': sum(1 if v.vote_type == 'up' else -1 for v in self.votes) if include_votes else 0
        }
        return data

# ----------------------
# Question Vote Table
# ----------------------
class QuestionVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'up' or 'down'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate votes
    __table_args__ = (db.UniqueConstraint('user_id', 'question_id', name='unique_question_vote'),)

# ----------------------
# Answer Vote Table
# ----------------------
class AnswerVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'up' or 'down'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate votes
    __table_args__ = (db.UniqueConstraint('user_id', 'answer_id', name='unique_answer_vote'),)

# ----------------------
# Notification Table
# ----------------------
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)  # 'answer', 'comment', 'mention'
    related_id = db.Column(db.Integer, nullable=True)  # ID of related question/answer
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'notification_type': self.notification_type,
            'related_id': self.related_id,
            'read': self.is_read,
            'time': self.created_at.isoformat()
        }
