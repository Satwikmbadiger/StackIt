# StackIt Backend

A Flask-based REST API for the StackIt Q&A application.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /api/questions` - Get all questions
- `GET /api/questions/<id>` - Get a specific question by ID
- `GET /` - Health check endpoint
