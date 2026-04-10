# ShivMLAI — Zero to AGI Platform

## Project Structure

```
ShivMLAI/
├── frontend/              ← React app (ONE frontend only)
│   ├── src/
│   │   ├── App.js         ← Main router + ShivAgent integrated
│   │   ├── index.js       ← Wrapped with ShivProvider
│   │   ├── components/
│   │   │   ├── ShivAgent.js          ← AI agent floating button
│   │   │   ├── LessonHighlighter.js  ← Real-time highlight
│   │   │   ├── AccountPage.js
│   │   │   ├── GoogleLoginComponent.js
│   │   │   ├── LessonNavigation.js
│   │   │   └── ProgressBar.js
│   │   ├── hooks/
│   │   │   ├── useShivAgent.js       ← Voice + AI logic
│   │   │   ├── useAuth.js
│   │   │   └── useProgress.js
│   │   ├── context/
│   │   │   └── ShivContext.js        ← Global Shiv state
│   │   ├── levels/                   ← All 40 lessons (Levels 1-7)
│   │   └── shared/
│   │       └── lessonStyles.js
│   └── .env.example
│
├── backend/               ← Node.js + MongoDB (auth, progress, admin)
│   └── server.js
│
└── shiv-agent/            ← Python FastAPI (AI only, NO frontend)
    ├── main.py
    ├── requirements.txt
    ├── .env
    ├── services/
    │   ├── ai_service.py
    │   ├── voice_service.py
    │   └── lesson_service.py
    └── prompts/
        └── shiv_prompts.py
```

## Running the project

### 1. Frontend (React)
```bash
cd frontend
cp .env.example .env   # fill in your values
npm install
npm start              # runs on http://localhost:3000
```

### 2. Node.js Backend
```bash
cd backend
npm install
node server.js         # runs on http://localhost:5000
```

### 3. Shiv AI Agent (FastAPI)
```bash
cd shiv-agent
pip install -r requirements.txt
# Edit .env → add GEMINI_API_KEY and MONGODB_URI
uvicorn main:app --reload --port 8000
```

## Environment Variables

### frontend/.env
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SHIV_API=http://localhost:8000
```

### shiv-agent/.env
```
GEMINI_API_KEY=your_gemini_key  # free at aistudio.google.com
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:3000
```
