# StackIt – A Minimal Q&A Forum Platform

StackIt is a modern, feature-rich question-and-answer platform designed for collaborative learning and structured knowledge sharing. Built with React frontend and Flask backend, it provides a clean, user-friendly interface focused on the core experience of asking and answering questions within a community.

## 🚀 Features

### Core Features (Implemented)

#### 1. **Rich Text Editor** ✨
- **Bold, Italic, Strikethrough** formatting
- **Numbered lists and Bullet points**
- **Emoji insertion** with picker
- **Hyperlink insertion** with URL validation
- **Image upload** with preview
- **Text alignment** (Left, Center, Right)
- **Real-time preview** of formatted content

#### 2. **Advanced Tag System** 🏷️
- **Multi-select tag input** with search functionality
- **Predefined tag suggestions** (100+ technology tags)
- **Custom tag creation** by typing and pressing Enter
- **Tag removal** with click-to-remove interface
- **Visual tag display** with color-coded styling

#### 3. **Voting System** ⬆️⬇️
- **Upvote/Downvote** questions and answers
- **Real-time vote count** updates
- **User vote tracking** (prevents duplicate voting)
- **Visual feedback** for voted items
- **Login-required** voting with helpful prompts

#### 4. **Answer Acceptance** ✅
- **Question owners** can mark answers as accepted
- **Visual acceptance indicators** with badges
- **One accepted answer** per question limit
- **Acceptance status** clearly displayed
- **Permission-based** access control

#### 5. **Notification System** 🔔
- **Real-time notifications** for:
  - New answers to your questions
  - Comments on your answers
  - @username mentions
- **Unread notification count** badge
- **Dropdown notification list** with timestamps
- **Mark all as read** functionality
- **Notification history** (last 10 notifications)

#### 6. **User Authentication** 👤
- **User registration** and login
- **Session management** with tokens
- **Protected routes** for authenticated features
- **User-specific** content and actions

#### 7. **Modern UI/UX** 🎨
- **Responsive design** for all screen sizes
- **Clean, modern interface** with smooth animations
- **Hover effects** and visual feedback
- **Loading states** and error handling
- **Accessibility features** (focus management, ARIA labels)

## 🛠️ Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Context API** for state management
- **CSS3** with modern styling and animations
- **Fetch API** for HTTP requests

### Backend
- **Flask** Python web framework
- **SQLite** database (can be upgraded to PostgreSQL)
- **JWT** authentication
- **RESTful API** design
- **CORS** support for cross-origin requests

## 📁 Project Structure

```
StackIt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── RichTextEditor.jsx
│   │   │   ├── TagSelector.jsx
│   │   │   ├── VoteButtons.jsx
│   │   │   ├── AcceptAnswerButton.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── AnswerForm.jsx
│   │   ├── pages/         # Page components
│   │   ├── AppContext.jsx # Global state management
│   │   └── api.js         # API communication
│   └── public/
├── server/                # Flask backend
│   ├── routes/           # API endpoints
│   ├── models.py         # Database models
│   └── app.py           # Main application
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StackIt
   ```

2. **Set up the backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage Guide

### For Users

#### Asking Questions
1. **Login** to your account (or register if new)
2. **Click "Ask Question"** in the navigation
3. **Enter a descriptive title** for your question
4. **Use the rich text editor** to write your question:
   - Format text with **bold**, *italic*, ~~strikethrough~~
   - Add lists (numbered or bulleted)
   - Insert emojis 😀 and images 📷
   - Add hyperlinks 🔗
   - Align text left, center, or right
5. **Select relevant tags** from the dropdown or create custom ones
6. **Submit** your question

#### Answering Questions
1. **Navigate** to any question
2. **Use the rich text editor** to write your answer
3. **Submit** your answer
4. **Vote** on other answers to help the community

#### Voting and Accepting
- **Upvote** helpful content (▲)
- **Downvote** incorrect or unhelpful content (▼)
- **Question owners** can accept the best answer (✅)

#### Notifications
- **Click the bell icon** 🔔 to view notifications
- **Unread count** is shown on the badge
- **Mark all as read** to clear notifications
- **Real-time updates** for new notifications

### For Developers

#### Adding New Features
1. **Frontend components** go in `client/src/components/`
2. **API endpoints** go in `server/routes/`
3. **Database models** go in `server/models.py`
4. **Styling** uses CSS modules or component-specific CSS

#### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `POST /api/answers` - Post answer
- `POST /api/votes` - Vote on content
- `POST /api/answers/accept` - Accept answer
- `GET /api/notifications` - Get user notifications

## 🎯 Key Features in Detail

### Rich Text Editor
The custom rich text editor provides a comprehensive editing experience:
- **Toolbar interface** with intuitive icons
- **Real-time formatting** with visual feedback
- **Image upload** with drag-and-drop support
- **Emoji picker** with categorized emojis
- **Link dialog** with URL validation
- **Keyboard shortcuts** for common actions

### Tag System
Advanced tagging with search and suggestions:
- **100+ predefined tags** covering programming, frameworks, and tools
- **Search functionality** to find specific tags
- **Custom tag creation** for unique topics
- **Visual tag chips** with remove buttons
- **Tag validation** and duplicate prevention

### Notification System
Real-time notification management:
- **WebSocket-like** real-time updates
- **Notification categories** (answers, comments, mentions)
- **Time-based formatting** (just now, 5m ago, 2h ago)
- **Unread indicators** with visual badges
- **Bulk actions** (mark all as read)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:
```env
FLASK_SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///stackit.db
JWT_SECRET_KEY=your-jwt-secret
```

### Customization
- **Tag categories** can be modified in `TagSelector.jsx`
- **Rich text editor** features can be extended in `RichTextEditor.jsx`
- **Notification types** can be added in the backend
- **Styling** can be customized in component CSS files

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
python -m pytest
```

## 📝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**StackIt** - Empowering communities through knowledge sharing! 🚀


