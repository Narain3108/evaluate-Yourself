import React, { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onFinish: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

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

  if (isFinished) {
    const score = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    return (
      <div className="card">
        <h2>Quiz Results</h2>
        <p className="read-the-docs">You scored {score} out of {questions.length}!</p>
        <div className="results-review">
          {questions.map((q, index) => (
            <div key={index} className="result-item">
              <p><strong>{index + 1}. {q.question}</strong></p>
              <p className={userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}>
                Your answer: {q.options[userAnswers[index]!]}
              </p>
              {userAnswers[index] !== q.correctAnswer && (
                <p className="correct">Correct answer: {q.options[q.correctAnswer]}</p>
              )}
            </div>
          ))}
        </div>
        <button onClick={onFinish}>Try Another Document</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="card">
      <h2>Quiz Time!</h2>
      <div className="question-container">
        <h3>Question {currentQuestionIndex + 1}/{questions.length}</h3>
        <p>{currentQuestion.question}</p>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button key={index} className={`option-button ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`} onClick={() => handleOptionSelect(index)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="navigation-buttons">
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext} disabled={userAnswers[currentQuestionIndex] === null}>Next</button>
        ) : (
          <button onClick={() => setIsFinished(true)} disabled={userAnswers.includes(null)}>Finish Quiz</button>
        )}
      </div>
    </div>
  );
};