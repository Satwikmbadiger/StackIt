# StackIt - Q&A Forum Platform

StackIt is a minimal question-and-answer platform designed for collaborative learning and structured knowledge sharing. The platform allows users to ask questions, provide answers, and engage with a community.

## Features

- Ask and answer questions with a rich text editor
- Upvote/downvote answers
- Accept answers as solutions
- Tag-based question organization
- Real-time notification system
- User authentication and authorization

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: PostgreSQL

## Project Structure

```
StackIt/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── ...
├── backend/           # Flask backend
│   ├── app.py
│   ├── models/
│   ├── routes/
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.8+
- PostgreSQL

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   DATABASE_URL=postgresql://username:password@localhost/stackit
   JWT_SECRET_KEY=your_secret_key
   ```

5. Initialize the database:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Start the Flask server:
   ```bash
   flask run
   ```

## User Roles

- **Guest**: Can view all questions and answers
- **User**: Can register, log in, post questions/answers, and vote
- **Admin**: Can moderate content (delete inappropriate content)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
