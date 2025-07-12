from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample questions data
sample_questions = [
    {
        "id": 1,
        "title": "How to join 2 columns in SQL?",
        "description": "I do not know the code for it as I am a beginner. Can someone help me understand the different types of joins in SQL?",
        "tags": ["SQL", "Beginner"],
        "username": "User1",
        "answers": 5
    },
    {
        "id": 2,
        "title": "React useState vs useEffect best practices",
        "description": "What are the best practices when using useState and useEffect hooks in React? When should I use each one?",
        "tags": ["React", "JavaScript", "Hooks"],
        "username": "ReactDev",
        "answers": 3
    },
    {
        "id": 3,
        "title": "Python list comprehension optimization",
        "description": "How can I optimize my list comprehensions in Python for better performance? Are there any alternatives?",
        "tags": ["Python", "Performance", "List-Comprehension"],
        "username": "PythonGuru",
        "answers": 8
    },
    {
        "id": 4,
        "title": "CSS Grid vs Flexbox - when to use which?",
        "description": "I'm confused about when to use CSS Grid vs Flexbox. What are the main differences and use cases for each?",
        "tags": ["CSS", "Grid", "Flexbox", "Layout"],
        "username": "WebDesigner",
        "answers": 12
    },
    {
        "id": 5,
        "title": "Git merge conflicts resolution",
        "description": "I keep getting merge conflicts when working with my team. What's the best way to resolve them without losing code?",
        "tags": ["Git", "Version-Control", "Teamwork"],
        "username": "DevOpsNewbie",
        "answers": 7
    },
    {
        "id": 6,
        "title": "Database indexing strategies",
        "description": "What are the best practices for creating database indexes? How do I know when my query needs an index?",
        "tags": ["Database", "Performance", "Indexing"],
        "username": "DBExpert",
        "answers": 0
    },
    {
        "id": 7,
        "title": "Node.js memory leak debugging",
        "description": "My Node.js application seems to have memory leaks. What tools and techniques can I use to identify and fix them?",
        "tags": ["Node.js", "Debugging", "Memory"],
        "username": "BackendDev",
        "answers": 2
    },
    {
        "id": 8,
        "title": "Docker container networking issues",
        "description": "I'm having trouble with container-to-container communication in Docker. Services can't reach each other.",
        "tags": ["Docker", "Networking", "DevOps"],
        "username": "CloudEngineer",
        "answers": 4
    }
]

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Return all questions"""
    return jsonify(sample_questions)

@app.route('/api/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """Return a specific question by ID"""
    question = next((q for q in sample_questions if q['id'] == question_id), None)
    if question:
        return jsonify(question)
    return jsonify({'error': 'Question not found'}), 404

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'message': 'StackIt API is running!', 'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
