# StackIt - Setup Guide

This document provides detailed instructions for setting up the StackIt Q&A Forum Platform.

## Database Setup

### PostgreSQL Installation

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

2. Create a new database:
   ```sql
   CREATE DATABASE stackit;
   CREATE USER stackit_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE stackit TO stackit_user;
   ```

### Database Schema

The application uses the following tables:

- **users**: User accounts and authentication
- **questions**: Questions posted by users
- **answers**: Answers to questions
- **votes**: Upvotes/downvotes on answers
- **tags**: Question categorization tags
- **notifications**: User notifications

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://stackit_user:your_password@localhost/stackit

# JWT Configuration
JWT_SECRET_KEY=your_secure_random_key
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour

# Application Configuration
FLASK_APP=app.py
FLASK_ENV=development
```

## Frontend Configuration

### Tailwind CSS Setup

The Tailwind CSS configuration is in `tailwind.config.js`. Update it to include your project paths:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### API Configuration

Update the API base URL in `src/services/api.js` to point to your backend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Development Workflow

1. Start the backend server:
   ```bash
   cd backend
   flask run
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Production Deployment

### Backend Deployment

1. Install Gunicorn:
   ```bash
   pip install gunicorn
   ```

2. Start the production server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Frontend Deployment

1. Build the production assets:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the static files from the `dist` directory using a web server like Nginx or Apache.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify the database credentials in your `.env` file
- Check that the database exists and the user has appropriate permissions

### Frontend Build Issues

- Clear the npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### CORS Issues

- Ensure that CORS is properly configured in the Flask backend
- Check that the frontend is making requests to the correct API URL
