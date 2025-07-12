#!/usr/bin/env python3
"""
Test script to verify database connection
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_connection():
    """Test the database connection"""
    try:
        from app import app
        from models import db
        
        with app.app_context():
            # Test connection
            db.engine.connect()
            print("✅ Database connection successful!")
            
            # Test if tables exist
            from models import User, Question, Tag
            user_count = User.query.count()
            question_count = Question.query.count()
            tag_count = Tag.query.count()
            
            print(f"✅ Database tables exist!")
            print(f"   Users: {user_count}")
            print(f"   Questions: {question_count}")
            print(f"   Tags: {tag_count}")
            
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print()
        print("Troubleshooting tips:")
        print("1. Check your DATABASE_URL in .env file")
        print("2. Ensure Railway database is running")
        print("3. Verify the connection string format")
        print("4. Check if the database exists")
        return False

if __name__ == "__main__":
    print("🔍 Testing database connection...")
    print(f"Database URL: {os.getenv('DATABASE_URL', 'Not set')}")
    print("-" * 50)
    
    success = test_connection()
    
    if success:
        print("\n🎉 All tests passed! Your database is ready.")
    else:
        print("\n💥 Database connection failed. Please check your configuration.")
        sys.exit(1) 