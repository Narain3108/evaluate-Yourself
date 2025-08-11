"use client"

import type React from "react"
import { useState, useRef } from "react"
import { uploadFile, generateSummary } from "../api/upload"
import type { Question, Summary } from "../App"
import {
  ArrowLeft,
  Upload,
  FileText,

  Plus,
  Minus,
  Sparkles,
  Clock,
  Target,
  Zap,
  BookText,
  CheckCircle,
} from "lucide-react"

interface UploadPageProps {
  onStartQuiz: (questions: Question[]) => void
  onSummaryComplete: (summary: Summary) => void
  onBack: () => void
}

export const UploadPage: React.FC<UploadPageProps> = ({ onStartQuiz, onSummaryComplete, onBack }) => {
  const [mode, setMode] = useState<"quiz" | "summarize">("quiz")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [file, setFile] = useState<File | null>(null)
  const [docType] = useState("pdf")
  const [numQuestions, setNumQuestions] = useState(5)
  const [level, setLevel] = useState("medium")
  const [statusMessage, setStatusMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setCurrentStep(3)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setCurrentStep(3)
    }
  }

  const handleModeChange = (newMode: "quiz" | "summarize") => {
    setMode(newMode)
    setCurrentStep(2)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      setStatusMessage("Please select a file first.")
      return
    }

    setStatusMessage("")
    setIsLoading(true)

    try {
      if (mode === "quiz") {
        const result = await uploadFile(file, docType, numQuestions, level)
        onStartQuiz(result.quiz.questions)
      } else {
        const result = await generateSummary(file, summaryLength)
        onSummaryComplete(result)
      }
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message || "Operation failed."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }


  const difficultyLevels = [
    {
      value: "easy",
      label: "Easy",
      emoji: "🟢",
      description: "Basic concepts and straightforward questions",
      color: "from-green-400 to-green-500",
    },
    {
      value: "medium",
      label: "Medium",
      emoji: "🟡",
      description: "Moderate complexity with some analysis",
      color: "from-yellow-400 to-orange-500",
    },
    {
      value: "hard",
      label: "Hard",
      emoji: "🔴",
      description: "Advanced concepts requiring deep thinking",
      color: "from-red-400 to-red-500",
    },
  ]

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="upload-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="header-content">
          <div className="header-badge">
            <Sparkles className="w-4 h-4" />
            <span>AI Content Tools</span>
          </div>
          <h1 className="upload-title">
            Generate a <span className="gradient-text">{mode === "quiz" ? "Personalized Quiz" : "Smart Summary"}</span>
          </h1>
          <p className="upload-subtitle">
            Upload your document and let our AI create{" "}
            {mode === "quiz" ? "engaging questions" : "intelligent summaries"} tailored to your learning goals
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-steps">
            {[1, 2, 3].map((step) => (
              <div key={step} className="progress-step-wrapper">
                <div
                  className={`progress-step ${currentStep >= step ? "active" : ""} ${currentStep > step ? "completed" : ""}`}
                >
                  {currentStep > step ? <div className="step-check">✓</div> : <span>{step}</span>}
                </div>
                {step < 3 && <div className={`progress-line ${currentStep > step ? "completed" : ""}`} />}
              </div>
            ))}
          </div>
          <div className="progress-labels">
            <span className={currentStep >= 1 ? "active" : ""}>Choose Mode</span>
            <span className={currentStep >= 2 ? "active" : ""}>Upload</span>
            <span className={currentStep >= 3 ? "active" : ""}>Configure</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Step 1: Mode Selection */}
        <div className={`form-section ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}>
          <div className="section-header">
            <div className="section-number">01</div>
            <div className="section-info">
              <h3 className="section-title">Choose Your Goal</h3>
              <p className="section-description">Select what you want to create from your document</p>
            </div>
          </div>

          <div className="mode-selector">
            <button
              type="button"
              onClick={() => handleModeChange("quiz")}
              className={`mode-card ${mode === "quiz" ? "selected" : ""}`}
            >
              <div className="mode-icon quiz-mode">
                <Target className="w-8 h-8" />
              </div>
              <div className="mode-content">
                <h4 className="mode-title">Generate Quiz</h4>
                <p className="mode-description">Create interactive questions to test knowledge and understanding</p>
                <div className="mode-features">
                  <span className="feature-tag">Multiple Choice</span>
                  <span className="feature-tag">Adaptive Difficulty</span>
                  <span className="feature-tag">Instant Feedback</span>
                </div>
              </div>
              <div className="mode-check">{mode === "quiz" && <CheckCircle className="w-6 h-6" />}</div>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("summarize")}
              className={`mode-card ${mode === "summarize" ? "selected" : ""}`}
            >
              <div className="mode-icon summary-mode">
                <BookText className="w-8 h-8" />
              </div>
              <div className="mode-content">
                <h4 className="mode-title">Generate Summary</h4>
                <p className="mode-description">Extract key insights and create concise summaries of your content</p>
                <div className="mode-features">
                  <span className="feature-tag">Key Points</span>
                  <span className="feature-tag">Smart Length</span>
                  <span className="feature-tag">Easy Copy</span>
                </div>
              </div>
              <div className="mode-check">{mode === "summarize" && <CheckCircle className="w-6 h-6" />}</div>
            </button>
          </div>
        </div>

        {/* Step 2: File Upload */}
        <div className={`form-section ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}>
          <div className="section-header">
            <div className="section-number">02</div>
            <div className="section-info">
              <h3 className="section-title">Upload Your Document</h3>
              <p className="section-description">
                Choose a file to transform into {mode === "quiz" ? "an interactive quiz" : "a smart summary"}
              </p>
            </div>
          </div>

          <div
            className={`file-drop-zone ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              hidden
            />

            {file ? (
              <div className="file-selected">
                <div className="file-preview">
                  <div className="file-icon-wrapper">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      <span className="file-type">{file.type || "Unknown type"}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="change-file-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setCurrentStep(2)
                  }}
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="file-placeholder">
                <div className="upload-icon-wrapper">
                  <Upload className="w-12 h-12" />
                  <div className="upload-animation" />
                </div>
                <div className="upload-text">
                  <h4>Drop your file here or click to browse</h4>
                  <p>Supports PDF, DOCX, JPG, PNG files up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Configuration */}
        <div className={`form-section ${currentStep === 3 ? "active" : ""}`}>
          <div className="section-header">
            <div className="section-number">03</div>
            <div className="section-info">
              <h3 className="section-title">{mode === "quiz" ? "Quiz Configuration" : "Summary Settings"}</h3>
              <p className="section-description">
                Customize your {mode === "quiz" ? "quiz parameters" : "summary preferences"} for optimal results
              </p>
            </div>
          </div>

          <div className="configuration-settings">
            {mode === "quiz" ? (
              <div className="quiz-settings">
                {/* Number of Questions */}
                <div className="setting-card">
                  <div className="setting-header">
                    <div className="setting-icon">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="setting-info">
                      <h4 className="setting-title">Number of Questions</h4>
                      <p className="setting-description">Choose how many questions to generate</p>
                    </div>
                  </div>

                  <div className="number-selector">
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => setNumQuestions(Math.max(1, numQuestions - 1))}
                      disabled={numQuestions <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="number-display">
                      <span className="number-value">{numQuestions}</span>
                      <span className="number-label">questions</span>
                    </div>
                    <button
                      type="button"
                      className="number-btn"
                      onClick={() => setNumQuestions(Math.min(20, numQuestions + 1))}
                      disabled={numQuestions >= 20}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="setting-card">
                  <div className="setting-header">
                    <div className="setting-icon">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="setting-info">
                      <h4 className="setting-title">Difficulty Level</h4>
                      <p className="setting-description">Select the complexity of generated questions</p>
                    </div>
                  </div>

                  <div className="difficulty-selector">
                    {difficultyLevels.map((difficulty) => (
                      <label
                        key={difficulty.value}
                        className={`difficulty-option ${level === difficulty.value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="level"
                          value={difficulty.value}
                          checked={level === difficulty.value}
                          onChange={(e) => setLevel(e.target.value)}
                        />
                        <div className={`difficulty-indicator bg-gradient-to-r ${difficulty.color}`}>
                          <span className="difficulty-emoji">{difficulty.emoji}</span>
                        </div>
                        <div className="difficulty-content">
                          <h5 className="difficulty-label">{difficulty.label}</h5>
                          <p className="difficulty-description">{difficulty.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="time-estimate">
                  <Clock className="w-5 h-5" />
                  <span>Estimated completion time: {Math.ceil(numQuestions * 1.5)} minutes</span>
                </div>
              </div>
            ) : (
              <div className="summary-settings">
                {/* Summary Length */}
                <div className="setting-card">
                  <h4>Summary Length</h4>
                  <div className="summary-length-selector">
                    {/* FIX: Changed options to be more concise */}
                    {["short", "medium", "long"].map((len) => (
                      <button
                        type="button"
                        key={len}
                        className={summaryLength === len ? "selected" : ""}
                        onClick={() => setSummaryLength(len)}
                      >
                        {/* Capitalize first letter for display */}
                        {len.charAt(0).toUpperCase() + len.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="form-actions">
          <button type="submit" disabled={isLoading || !file || currentStep < 3} className="generate-button">
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>Generating Your {mode === "quiz" ? "Quiz" : "Summary"}...</span>
                <div className="loading-progress" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate My {mode === "quiz" ? "Quiz" : "Summary"}</span>
                <div className="button-shine" />
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="status-message error">
            <div className="status-icon">⚠️</div>
            <span>{statusMessage}</span>
          </div>
        )}
      </form>
    </div>
  )
}
