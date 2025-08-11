import { useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import './App .css';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { Quiz } from './components/Quiz';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'upload' | 'quiz'>('landing');
  const [quizData, setQuizData] = useState<Question[] | null>(null);

  const navigateToUpload = () => setCurrentPage('upload');
  const navigateToLanding = () => {
    setCurrentPage('landing');
    setQuizData(null);
  };
  const startQuiz = (questions: Question[]) => {
    setQuizData(questions);
    setCurrentPage('quiz');
  };

  const page = ((): React.ReactElement => {
    if (currentPage === 'quiz' && quizData) {
      return <Quiz questions={quizData} onFinish={navigateToLanding} />;
    }
    if (currentPage === 'upload') {
      return <UploadPage onStartQuiz={startQuiz} onBack={navigateToLanding} />;
    }
    return <LandingPage onGetStarted={navigateToUpload} />;
  })();

  // Route transition on page change
  useLayoutEffect(() => {
    gsap.from('.route-page', { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' });
  }, [currentPage]);

  return (
    <div className="app-shell">
      {/* ...existing code... header/nav if you have it ... */}
      <main className="app-main" aria-live="polite">
        <div key={currentPage} className="route-page">
          {/* ...existing code... */}
          {page}
        </div>
      </main>
      {/* ...existing code... footer ... */}
    </div>
  );
}

export default App;