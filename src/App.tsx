import { useState } from 'react';
import './App.css';
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

  if (currentPage === 'quiz' && quizData) {
    return <Quiz questions={quizData} onFinish={navigateToLanding} />;
  }

  if (currentPage === 'upload') {
    return <UploadPage onStartQuiz={startQuiz} onBack={navigateToLanding} />;
  }

  return <LandingPage onGetStarted={navigateToUpload} />;
}

export default App;