# StackIt Frontend

A React-based frontend for the StackIt Q&A application with dark mode and responsive design.

## Features

- **Dark Mode UI**: Professional dark theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern React**: Uses functional components with hooks
- **Question List**: Displays questions with stats, tags, and metadata
- **Navigation**: Header with filters, search, and navigation
- **Pagination**: Static pagination UI (ready for backend integration)

## Setup

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
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation header
│   ├── QuestionList.js # List of questions
│   ├── QuestionCard.js # Individual question card
│   └── Pagination.js   # Pagination component
├── styles/             # CSS stylesheets
│   ├── index.css       # Global styles and variables
│   ├── App.css         # Main app styles
│   ├── Header.css      # Header component styles
│   ├── QuestionList.css # Question list styles
│   ├── QuestionCard.css # Question card styles
│   └── Pagination.css  # Pagination styles
├── App.js              # Main app component
└── index.js            # App entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## API Integration

The app fetches questions from the backend API at `/api/questions`. Make sure the backend server is running on port 5000 for proper API communication.
