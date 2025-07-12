from app import db
from datetime import datetime

class Answer(db.Model):
    __tablename__ = 'answers'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    accepted = db.Column(db.Boolean, default=False)
    
    # Relationships
    votes = db.relationship('Vote', backref='answer', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        upvotes = sum(1 for vote in self.votes if vote.vote_type == 'upvote')
        downvotes = sum(1 for vote in self.votes if vote.vote_type == 'downvote')
        
        return {
            'id': self.id,
            'content': self.content,
            'question_id': self.question_id,
            'user_id': self.user_id,
            'username': self.author.username,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'accepted': self.accepted,
            'vote_count': upvotes - downvotes,
            'upvotes': upvotes,
            'downvotes': downvotes
        }
