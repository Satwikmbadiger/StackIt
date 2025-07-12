# StackIt - Q&A Web Application

A full-stack Q&A platform similar to Stack Overflow, built with React and Flask.

## Features

### Frontend (React)
- 🌙 **Dark Mode UI** - Professional dark theme
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔍 **Search & Filters** - Find questions easily
- 🏷️ **Tag System** - Organize questions by topics
- 📊 **Question Stats** - Vote count, answer count, views
- 📄 **Pagination** - Navigate through multiple pages

### Backend (Flask)
- 🚀 **REST API** - Clean API endpoints
- 📊 **Sample Data** - Pre-loaded with example questions
- 🔌 **CORS Enabled** - Frontend-backend communication
- 🛠️ **Easy to Extend** - Add new features easily

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
stackit/
├── backend/            # Flask API server
│   ├── app.py         # Main Flask application
│   ├── requirements.txt # Python dependencies
│   └── README.md      # Backend documentation
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── styles/    # CSS stylesheets
│   │   ├── App.js     # Main app component
│   │   └── index.js   # Entry point
│   ├── public/        # Static files
│   ├── package.json   # Node dependencies
│   └── README.md      # Frontend documentation
└── README.md          # This file
```

## API Endpoints

- `GET /api/questions` - Get all questions
- `GET /api/questions/<id>` - Get specific question
- `GET /` - Health check

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **CSS3** - Custom dark theme styling
- **Responsive Design** - Mobile-first approach

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Python 3.8+** - Backend programming language

## Features in Detail

### Navigation Header
- StackIt logo
- "Ask New Question" button
- Filter buttons (Newest, Unanswered, More dropdown)
- Search bar with search icon
- Login button
- Mobile-responsive hamburger menu

### Question Cards
- Vote count, answer count, and view count
- Question title and description
- Tag system with colored badges
- User information and timestamp
- Hover effects and transitions

### Responsive Design
- Desktop: Full layout with sidebar stats
- Tablet: Adjusted spacing and fonts
- Mobile: Stacked layout, collapsible navigation

## Development

### Adding New Features

1. **New API Endpoints**: Add routes in `backend/app.py`
2. **New Components**: Create in `frontend/src/components/`
3. **Styling**: Add CSS in `frontend/src/styles/`

### Code Style
- Use functional components with hooks
- Follow dark theme color variables
- Maintain responsive design patterns
- Use semantic HTML elements

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Question creation and editing
- [ ] Voting system
- [ ] Answer system
- [ ] User profiles
- [ ] Real-time notifications
- [ ] Search functionality
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Image upload support
- [ ] Email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
