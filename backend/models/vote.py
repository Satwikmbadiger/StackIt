from models import db
from datetime import datetime

class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vote_type = db.Column(db.String(10), nullable=False)  # 'upvote' or 'downvote'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to ensure one vote per user per answer
    __table_args__ = (
        db.UniqueConstraint('answer_id', 'user_id', name='unique_vote_per_user_per_answer'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'answer_id': self.answer_id,
            'user_id': self.user_id,
            'vote_type': self.vote_type,
            'created_at': self.created_at.isoformat()
        }
