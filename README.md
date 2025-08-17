# EvaluateAI - AI-Powered Document Quiz Generator

![EvaluateAI Banner](https://via.placeholder.com/1200x400/1a1a1a/ffffff?text=EvaluateAI+-+Transform+Documents+into+Interactive+Quizzes)

## 🚀 Overview

EvaluateAI is a cutting-edge AI-powered platform that transforms any document into intelligent, interactive quizzes in minutes. Built with modern technologies and powered by Google's Gemini AI, it revolutionizes the way educators, trainers, and learners create and consume educational content.

### ✨ Key Features

- **🧠 AI-Powered Intelligence**: Advanced machine learning algorithms analyze documents and generate contextually relevant questions
- **📄 Multi-Format Support**: Upload PDF, DOCX, images, and more with intelligent content extraction
- **🎯 Adaptive Learning**: Personalized difficulty levels and question types that adapt to learning styles
- **💬 Interactive Q&A**: Chat with your documents using natural language queries
- **📊 Smart Summaries**: Generate comprehensive summaries from uploaded documents
- **🔒 Enterprise Security**: Bank-level security ensures your documents and data stay protected
- **⚡ Lightning Fast**: Create quizzes in minutes instead of hours
- **🎨 Modern UI**: Beautiful, responsive interface with dark theme

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   (Gemini AI)   │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • API Endpoints │    │ • Text Chunking │
│ • Upload UI     │    │ • File Processing│   │ • Quiz Gen      │
│ • Quiz Interface│    │ • Python Bridge │    │ • Q&A System    │
│ • Q&A Chat      │    │                 │    │ • Summarization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌─────────────────┐
                       │   Vector DB     │
                       │   (ChromaDB)    │
                       │                 │
                       │ • Document      │
                       │   Embeddings    │
                       │ • Semantic      │
                       │   Search        │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library
- **GSAP** - Smooth animations and transitions
- **CSS3** - Modern styling with flexbox/grid

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Python** - AI processing and document handling
- **Multer** - File upload middleware

### AI & ML
- **Google Gemini AI** - Advanced language models
  - `gemini-1.5-flash` - Fast text processing
  - `gemini-1.5-pro` - Advanced reasoning
- **ChromaDB** - Vector database for embeddings
- **Python Libraries**:
  - `google-generativeai` - Gemini API integration
  - `chromadb` - Vector storage
  - `python-dotenv` - Environment management

### Document Processing
- **PDF Processing** - Extract text from PDF files
- **DOCX Support** - Microsoft Word document parsing
- **Image OCR** - Text extraction from images
- **Multi-format** - Comprehensive document support

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://python.org/)
- **npm** or **yarn** - Package managers
- **Git** - Version control

## 🔑 API Keys Setup

You'll need three Google Gemini API keys for optimal performance:

1. **GEMINI_CHUNKER_API_KEY** - For document chunking and processing
2. **GEMINI_QUIZ_API_KEY** - For quiz generation
3. **GEMINI_QA_API_KEY** - For Q&A interactions

### Getting Gemini API Keys

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create three separate API keys
4. Copy the keys for environment setup

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/evaluateai.git
cd evaluateai
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd src

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Or using virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
# Navigate to backend directory
cd backend

# Create environment file
touch .env
```

Add the following content to your `.env` file:

```env
# Gemini API Keys
GEMINI_CHUNKER_API_KEY=your_chunker_api_key_here
GEMINI_QUIZ_API_KEY=your_quiz_api_key_here
GEMINI_QA_API_KEY=your_qa_api_key_here

# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
CHROMA_DB_PATH=./chroma_db
```

### 5. Python Dependencies

Create a `requirements.txt` file in the `backend` directory:

```txt
google-generativeai==0.3.2
chromadb==0.4.18
python-dotenv==1.0.0
PyPDF2==3.0.1
python-docx==0.8.11
Pillow==10.1.0
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

## 🏃‍♂️ Running the Application

### Development Mode

#### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if using)
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the Node.js server
node server.js

# Or using nodemon for auto-restart
npm run dev
```

The backend server will start on `http://localhost:8000`

#### 2. Start the Frontend Development Server

```bash
# Navigate to frontend directory (in a new terminal)
cd src

# Start the development server
npm run dev

# Or using yarn
yarn dev
```

The frontend development server will start on `http://localhost:5173`

### Production Mode

#### 1. Build the Frontend

```bash
cd src
npm run build
```

#### 2. Serve the Application

```bash
cd backend
npm run start:prod
```

## 📁 Project Structure

```
evaluateai/
├── src/                       # React frontend application
│   ├── public/                # Static assets
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── UploadPage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── SummaryPage.tsx
│   │   │   └── QAPage.tsx
│   │   ├── api/              # API utility functions
│   │   ├── styles/           # CSS styles
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                   # Backend server
│   ├── uploads/              # Temporary file storage
│   ├── chat_logs/            # Q&A conversation logs
│   ├── chroma_db/            # Vector database storage
│   ├── main.py               # Python AI processing script
│   ├── server.js             # Node.js Express server
│   ├── package.json
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
├── README.md
└── .gitignore
```

## 🔄 API Endpoints

### File Upload & Processing

```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: Document file (PDF, DOCX, etc.)
- type: Processing type ('quiz', 'summary', 'qa')
- numQuestions: Number of questions (for quiz)
- level: Difficulty level ('easy', 'medium', 'hard')
- summaryLength: Summary length ('short', 'medium', 'long')
```

### Quiz Generation

```http
POST /api/generate-quiz
Content-Type: application/json

{
  "docId": "document_uuid",
  "numQuestions": 5,
  "level": "medium"
}
```

### Summary Generation

```http
POST /api/generate-summary
Content-Type: application/json

{
  "docId": "document_uuid",
  "length": "medium"
}
```

### Q&A Interaction

```http
POST /api/ask-question
Content-Type: application/json

{
  "docId": "document_uuid",
  "question": "Your question here",
  "history": []
}
```

### Data Cleanup

```http
POST /api/cleanup
Content-Type: application/json

{
  "docId": "document_uuid"
}
```

## 🎯 Usage Guide

### 1. Upload a Document

1. Navigate to the upload page
2. Drag and drop or click to select your document
3. Choose the processing type:
   - **Quiz**: Generate interactive questions
   - **Summary**: Create document summaries
   - **Q&A**: Enable document chat

### 2. Quiz Generation

1. Select quiz options:
   - Number of questions (1-20)
   - Difficulty level (Easy/Medium/Hard)
2. Click "Generate Quiz"
3. Take the interactive quiz with real-time feedback
4. View your score and explanations

### 3. Document Summarization

1. Choose summary length:
   - Short (2-3 paragraphs)
   - Medium (4-6 paragraphs)
   - Long (7+ paragraphs)
2. Click "Generate Summary"
3. Read the AI-generated summary

### 4. Q&A Chat

1. Click "Start Q&A Session"
2. Ask questions about your document
3. Get intelligent, context-aware responses
4. Continue the conversation naturally

## 🛡️ Security Features

- **Data Privacy**: Documents are processed locally and cleaned up after sessions
- **API Key Security**: Environment-based configuration
- **Input Validation**: Comprehensive file type and size validation
- **Error Handling**: Graceful error management and user feedback
- **Session Management**: Automatic cleanup of temporary data

## 🚨 Troubleshooting

### Common Issues

#### 1. Python Script Errors

```bash
# Check Python path
which python3

# Verify dependencies
pip list | grep google-generativeai

# Test Gemini API connection
python -c "import google.generativeai as genai; print('Import successful')"
```

#### 2. API Key Issues

```bash
# Verify environment variables
echo $GEMINI_CHUNKER_API_KEY

# Check .env file location
ls -la backend/.env
```

#### 3. Port Conflicts

```bash
# Check if ports are in use
lsof -i :8000  # Backend port
lsof -i :5173  # Frontend port

# Kill processes if needed
kill -9 <PID>
```

#### 4. File Upload Issues

- Check file size limits (default: 10MB)
- Verify supported file types: PDF, DOCX, TXT, images
- Ensure proper file permissions

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `API key not found` | Missing environment variables | Check `.env` file configuration |
| `Python script failed` | Python dependency issues | Reinstall requirements: `pip install -r requirements.txt` |
| `File too large` | File exceeds size limit | Reduce file size or increase limit in `server.js` |
| `Unsupported format` | Invalid file type | Use supported formats: PDF, DOCX, TXT, images |

## 🔧 Configuration

### Environment Variables

```env
# Required - Gemini API Keys
GEMINI_CHUNKER_API_KEY=your_key_here
GEMINI_QUIZ_API_KEY=your_key_here
GEMINI_QA_API_KEY=your_key_here

# Optional - Server Configuration
PORT=8000
NODE_ENV=development
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Optional - Database Configuration
CHROMA_DB_PATH=./chroma_db
CHAT_LOGS_PATH=./chat_logs
UPLOADS_PATH=./uploads

# Optional - AI Configuration
DEFAULT_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=models/embedding-001
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

### Customization Options

#### Modify Quiz Parameters

```python
# In main.py, adjust these values:
DEFAULT_CHUNK_SIZE = 1000
MAX_QUESTIONS = 20
DIFFICULTY_LEVELS = ['easy', 'medium', 'hard']
```

#### Change UI Theme

```css
/* In App.css, modify color variables */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --background-color: #1a1a1a;
  --text-color: #e0e0e0;
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m "Add your feature"`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Narain** - Lead Full Stack Developer
- **Nikitha** - Senior Frontend Developer  
- **Karthikeyan** - Senior Backend Developer

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the team** at hello@evaluateai.com

## 🎉 Acknowledgments

- **Google AI** for the powerful Gemini API
- **ChromaDB** for vector database capabilities
- **React Team** for the amazing frontend framework
- **Open Source Community** for the incredible tools and libraries

---

**Made with ❤️ by the EvaluateAI Team**
