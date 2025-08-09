import { useState } from 'react';
import './App.css';
import { uploadFile } from './api/upload';
import { Quiz } from './components/Quiz';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('pdf');
  const [numQuestions, setNumQuestions] = useState(5);
  const [level, setLevel] = useState('medium');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<Question[] | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage('Please select a file first.');
      return;
    }
    setStatusMessage('Uploading document and generating quiz...');
    setIsLoading(true);
    setQuizData(null);
    try {
      const result = await uploadFile(file, docType, numQuestions, level);
      setQuizData(result.quiz.questions);
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message || 'Operation failed.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setFile(null);
    setQuizData(null);
    setStatusMessage('');
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (quizData) {
    return <Quiz questions={quizData} onFinish={resetApp} />;
  }

  return (
    <>
      <h1>Document Quiz Generator</h1>
      <p className="read-the-docs">Upload a document to generate a quiz!</p>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="fileInput">1. Choose a file:</label>
          <input
            id="fileInput"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="docType">2. Select document type:</label>
          <select
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="photo">Photo</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="numQuestions">3. Number of questions:</label>
          <input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) =>
              setNumQuestions(Math.max(1, parseInt(e.target.value, 10)))
            }
            min="1"
            max="20"
          />
        </div>
        <div className="form-group">
          <label htmlFor="level">4. Difficulty Level:</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>
      {statusMessage && !isLoading && (
        <p className="status-message">{statusMessage}</p>
      )}
    </>
  );
}

export default App;
