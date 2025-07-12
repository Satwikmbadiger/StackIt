# StackIt Setup Guide

This guide will help you set up StackIt with your PostgreSQL database on Railway.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL database (Railway)

## Backend Setup

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory with your Railway PostgreSQL credentials:

```env
# Database Configuration (Replace with your Railway PostgreSQL URL)
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

**To get your Railway PostgreSQL URL:**
1. Go to your Railway dashboard
2. Select your PostgreSQL database
3. Click on "Connect" tab
4. Copy the "Postgres Connection URL"
5. Replace `postgresql://` with `postgresql://` if needed

### 3. Initialize Database

```bash
cd server
python setup_db.py
```

This will:
- Create all database tables
- Add default tags for questions

### 4. Start the Backend Server

```bash
cd server
python app.py
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start the Frontend

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

## Testing the Setup

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Create a new account

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Login with your credentials

3. **Ask a question:**
   - Click "Ask Question" button
   - Fill in title, description, and select tags
   - Submit the question

## API Endpoints

The backend provides the following main endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create a new question
- `GET /api/questions/<id>` - Get specific question
- `POST /api/answers` - Post an answer
- `POST /api/votes` - Vote on questions/answers

## Troubleshooting

### Database Connection Issues

1. **Check your DATABASE_URL format:**
   ```
   postgresql://username:password@host:port/database_name
   ```

2. **Verify Railway database is running:**
   - Check Railway dashboard for database status
   - Ensure the database is not paused

3. **Test connection:**
   ```bash
   cd server
   python -c "from app import app; from models import db; app.app_context().push(); db.engine.connect(); print('Connection successful!')"
   ```

### CORS Issues

If you get CORS errors, ensure:
- Backend is running on port 5000
- Frontend is running on port 3000
- CORS is properly configured in `server/config.py`

### JWT Token Issues

If authentication fails:
1. Check JWT_SECRET_KEY is set in `.env`
2. Ensure token is being sent in Authorization header
3. Verify token format: `Bearer <token>`

## Production Deployment

For production deployment:

1. Set `FLASK_ENV=production` in your environment
2. Use a strong JWT_SECRET_KEY
3. Configure proper CORS origins
4. Use a production WSGI server like Gunicorn
5. Set up proper logging and monitoring

## Support

If you encounter any issues:
1. Check the console logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure database connection is working
4. Check that all dependencies are installed 