import React, { useState, useEffect } from 'react';
import type{ Question } from '../App';

interface QuizProps {
  questions: Question[];
  onFinish: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    setTimeout(() => setShowResult(true), 500);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (isFinished) {
    const score = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="quiz-results">
        <div className={`results-card ${showResult ? 'show' : ''}`}>
          <div className="results-header">
            <div className="score-circle">
              <div className="score-text">
                <span className="score-number">{score}</span>
                <span className="score-total">/{questions.length}</span>
              </div>
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle className="score-ring-bg" cx="60" cy="60" r="54" />
                <circle 
                  className="score-ring-fill" 
                  cx="60" 
                  cy="60" 
                  r="54"
                  style={{
                    strokeDasharray: `${(percentage / 100) * 339.292} 339.292`
                  }}
                />
              </svg>
            </div>
            <h2>Quiz Complete!</h2>
            <p className="score-percentage">{percentage}% Correct</p>
            <div className={`performance-badge ${percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-improvement'}`}>
              {percentage >= 80 ? '🏆 Excellent' : percentage >= 60 ? '👍 Good Job' : '📚 Keep Learning'}
            </div>
          </div>

          <div className="results-review">
            <h3>Review Your Answers</h3>
            {questions.map((q, index) => (
              <div key={index} className={`review-item ${userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}`}>
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <div className={`result-icon ${userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}`}>
                    {userAnswers[index] === q.correctAnswer ? '✓' : '✗'}
                  </div>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="answer-comparison">
                  <div className="your-answer">
                    <strong>Your answer:</strong>
                    <span className={userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}>
                      {userAnswers[index] !== null ? q.options[userAnswers[index]] : 'Not answered'}
                    </span>
                  </div>
                  {userAnswers[index] !== q.correctAnswer && (
                    <div className="correct-answer">
                      <strong>Correct answer:</strong>
                      <span className="correct">{q.options[q.correctAnswer]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button onClick={onFinish} className="home-button">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="quiz-timer">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className={timeLeft < 60 ? 'time-warning' : ''}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-card ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                <span className="option-text">{option}</span>
                <div className="option-check">
                  {userAnswers[currentQuestionIndex] === index && '✓'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            className="nav-button secondary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          
          <div className="question-indicators">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentQuestionIndex ? 'current' : ''} ${userAnswers[index] !== null ? 'answered' : ''}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              onClick={handleNext} 
              disabled={userAnswers[currentQuestionIndex] === null}
              className="nav-button primary"
            >
              Next
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={handleFinish} 
              disabled={userAnswers.includes(null)}
              className="nav-button finish"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Finish Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};