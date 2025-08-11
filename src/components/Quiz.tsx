"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Question } from "../App"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, Home, Trophy, Target, BookOpen, RotateCcw } from "lucide-react"

interface QuizProps {
  questions: Question[]
  onFinish: () => void
}

export const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  useEffect(() => {
    if (!isFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleFinish()
    }
  }, [timeLeft, isFinished])

  useEffect(() => {
    setSelectedOption(userAnswers[currentQuestionIndex])
  }, [currentQuestionIndex, userAnswers])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinish = () => {
    setIsFinished(true)
    setTimeout(() => setShowResult(true), 500)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  if (isFinished) {
    const score = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const percentage = Math.round((score / questions.length) * 100)
    const answeredQuestions = userAnswers.filter((answer) => answer !== null).length

    const getPerformanceData = () => {
      if (percentage >= 90)
        return {
          level: "Exceptional",
          color: "from-yellow-400 to-orange-500",
          icon: "🏆",
          message: "Outstanding performance! You have mastered this material.",
        }
      if (percentage >= 80)
        return {
          level: "Excellent",
          color: "from-green-400 to-green-600",
          icon: "🌟",
          message: "Great job! You have a strong understanding of the content.",
        }
      if (percentage >= 70)
        return {
          level: "Good",
          color: "from-blue-400 to-blue-600",
          icon: "👍",
          message: "Well done! You have a good grasp of the material.",
        }
      if (percentage >= 60)
        return {
          level: "Fair",
          color: "from-yellow-400 to-yellow-600",
          icon: "📚",
          message: "Not bad! Consider reviewing some topics for better understanding.",
        }
      return {
        level: "Needs Improvement",
        color: "from-red-400 to-red-600",
        icon: "💪",
        message: "Keep learning! Review the material and try again.",
      }
    }

    const performance = getPerformanceData()

    return (
      <div className="quiz-results">
        <div className={`results-container ${showResult ? "show" : ""}`}>
          {/* Results Header */}
          <div className="results-header">
            <div className="score-visualization">
              <div className="score-circle">
                <svg className="score-ring" viewBox="0 0 120 120">
                  <circle className="score-ring-bg" cx="60" cy="60" r="54" />
                  <circle
                    className="score-ring-fill"
                    cx="60"
                    cy="60"
                    r="54"
                    style={{
                      strokeDasharray: `${(percentage / 100) * 339.292} 339.292`,
                      strokeDashoffset: 0,
                    }}
                  />
                </svg>
                <div className="score-content">
                  <div className="score-number">{score}</div>
                  <div className="score-divider">/</div>
                  <div className="score-total">{questions.length}</div>
                </div>
              </div>

              <div className="score-details">
                <h2 className="results-title">Quiz Complete!</h2>
                <div className="score-percentage">{percentage}%</div>
                <div className={`performance-badge bg-gradient-to-r ${performance.color}`}>
                  <span className="performance-icon">{performance.icon}</span>
                  <span className="performance-text">{performance.level}</span>
                </div>
                <p className="performance-message">{performance.message}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <Target className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{score}</div>
                  <div className="stat-label">Correct</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{answeredQuestions}</div>
                  <div className="stat-label">Answered</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{formatTime(600 - timeLeft)}</div>
                  <div className="stat-label">Time Used</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Review */}
          <div className="results-review">
            <div className="review-header">
              <h3 className="review-title">
                <CheckCircle className="w-6 h-6" />
                Detailed Review
              </h3>
              <p className="review-subtitle">Review your answers and learn from mistakes</p>
            </div>

            <div className="review-list">
              {questions.map((question, index) => {
                const isCorrect = userAnswers[index] === question.correctAnswer
                const wasAnswered = userAnswers[index] !== null

                return (
                  <div
                    key={index}
                    className={`review-item ${isCorrect ? "correct" : wasAnswered ? "incorrect" : "unanswered"}`}
                  >
                    <div className="review-header-item">
                      <div className="question-number">
                        <span>Q{index + 1}</span>
                      </div>
                      <div
                        className={`result-indicator ${isCorrect ? "correct" : wasAnswered ? "incorrect" : "unanswered"}`}
                      >
                        {isCorrect ? "✓" : wasAnswered ? "✗" : "—"}
                      </div>
                    </div>

                    <div className="review-content">
                      <h4 className="review-question">{question.question}</h4>

                      <div className="answer-analysis">
                        {wasAnswered && (
                          <div className={`user-answer ${isCorrect ? "correct" : "incorrect"}`}>
                            <div className="answer-label">Your Answer:</div>
                            <div className="answer-text">{question.options[userAnswers[index]!]}</div>
                          </div>
                        )}

                        {!isCorrect && (
                          <div className="correct-answer">
                            <div className="answer-label">Correct Answer:</div>
                            <div className="answer-text">{question.options[question.correctAnswer]}</div>
                          </div>
                        )}

                        {!wasAnswered && (
                          <div className="unanswered-notice">
                            <div className="answer-label">Not Answered</div>
                            <div className="answer-text">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="results-actions">
            <button className="action-button secondary" onClick={onFinish}>
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <button className="action-button primary" onClick={() => window.location.reload()}>
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = userAnswers.filter((answer) => answer !== null).length

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-progress-section">
          <div className="progress-info">
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="answered-count">{answeredCount} answered</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="quiz-timer">
          <div className="timer-icon">
            <Clock className="w-5 h-5" />
          </div>
          <div className="timer-content">
            <span className={`timer-text ${timeLeft < 60 ? "warning" : ""}`}>{formatTime(timeLeft)}</span>
            <span className="timer-label">remaining</span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="quiz-content">
        <div className="question-container">
          <div className="question-header">
            <div className="question-badge">
              <span>Question {currentQuestionIndex + 1}</span>
            </div>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === index ? "selected" : ""}`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="option-marker">
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  {selectedOption === index && (
                    <div className="option-check">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="option-content">
                  <span className="option-text">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="nav-button secondary">
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="question-indicators">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentQuestionIndex ? "current" : ""} ${userAnswers[index] !== null ? "answered" : ""}`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext} disabled={selectedOption === null} className="nav-button primary">
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={handleFinish} disabled={userAnswers.includes(null)} className="nav-button finish">
            <Trophy className="w-5 h-5" />
            <span>Finish Quiz</span>
          </button>
        )}
      </div>
    </div>
  )
}
