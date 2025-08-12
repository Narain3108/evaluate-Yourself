import { useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import './Appp.css';
import { LandingPage } from './pages/LandingPage'
import { UploadPage } from './pages/UploadPage';
import { Quiz } from './components/Quiz';
import { SummaryPage } from './pages/SummaryPage';
import { QAPage } from './pages/QAPage'; // Import the new page

export interface Question {
  question: string
  options: string[]
  answer: string // This is the correct answer text from the backend
  correctAnswer?: number // This is the index, added on the frontend
  explanation: string // AI-generated explanation for the answer
}

export interface Summary {
  content: string;
  fileName?: string;
}

function App() {
  const [page, setPage] = useState<'landing' | 'upload' | 'quiz' | 'summary' | 'qa'>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [docInfo, setDocInfo] = useState({ id: '', name: '' });

  const handleGetStarted = () => setPage('upload');
  const handleBackToHome = () => setPage('landing');
  const handleBackToUpload = () => {
    setQuestions([]);
    setSummary(null);
    setPage('upload');
  };

  const handleStartQuiz = (qs: Question[]) => {
    // Convert the string answer from the backend to the correct index (`correctAnswer`)
    // that the Quiz component needs to function correctly.
    const processedQuestions = qs.map((q) => ({
      ...q,
      correctAnswer: q.options.indexOf(q.answer),
    }));
    setQuestions(processedQuestions);
    setPage('quiz');
  };

  const handleSummaryComplete = (s: Summary) => {
    setSummary(s);
    setPage('summary');
  };

  const handleStartQA = (docId: string, fileName: string) => {
    setDocInfo({ id: docId, name: fileName });
    setPage("qa");
  };

  // Route transition on page change
  useLayoutEffect(() => {
    gsap.from('.route-page', { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' });
  }, [page]);

  return (
    <div className="app-shell">
      {/* ...existing code... header/nav if you have it ... */}
      <main className="app-main" aria-live="polite">
        <div key={page} className="route-page">
          {page === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
          {page === 'upload' && (
            <UploadPage
              onStartQuiz={handleStartQuiz}
              onSummaryComplete={handleSummaryComplete}
              onStartQA={handleStartQA}
              onBack={handleBackToHome}
            />
          )}
          {page === 'quiz' && questions.length > 0 && <Quiz questions={questions} onFinish={handleBackToUpload} />}
          {page === 'summary' && summary && <SummaryPage summary={summary} onBack={handleBackToUpload} />}
          {page === "qa" && (
            <QAPage
              docId={docInfo.id}
              fileName={docInfo.name}
              onBack={handleBackToUpload}
            />
          )}
        </div>
      </main>
      {/* ...existing code... footer ... */}
    </div>
  );
}

export default App;