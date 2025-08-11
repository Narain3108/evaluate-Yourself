"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Summary } from "../App"
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  Clock,
  Sparkles,
  Brain,
  Target,
  RotateCcw,
  Home,
} from "lucide-react"

interface SummaryPageProps {
  summary: Summary
  onBack: () => void
}

export const SummaryPage: React.FC<SummaryPageProps> = ({ summary, onBack }) => {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    if (summary?.content) {
      const words = summary.content.trim().split(/\s+/).length
      setWordCount(words)
      setReadingTime(Math.ceil(words / 200)) // Average reading speed: 200 words per minute
    }
  }, [summary])

  const handleCopy = async () => {
    if (summary?.content) {
      try {
        await navigator.clipboard.writeText(summary.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    }
  }

  const handleDownload = () => {
    if (summary?.content) {
      const element = document.createElement("a")
      const file = new Blob([summary.content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${summary.fileName || "document"}-summary.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const handleShare = async () => {
    if (navigator.share && summary?.content) {
      try {
        await navigator.share({
          title: `Summary of ${summary.fileName || "Document"}`,
          text: summary.content,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <div className="summary-page">
      {/* Header */}
      <div className="summary-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Upload</span>
        </button>

        <div className={`header-content ${isVisible ? "animate-fade-in" : ""}`}>
          <div className="header-badge">
            <BookOpen className="w-4 h-4" />
            <span>AI-Generated Summary</span>
          </div>
          <h1 className="summary-title">
            Summary of <span className="gradient-text">{summary.fileName || "Your Document"}</span>
          </h1>
          <p className="summary-subtitle">Intelligent content extraction powered by advanced AI technology</p>
        </div>

        {/* Summary Stats */}
        <div className={`summary-stats ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          <div className="stat-card">
            <div className="stat-icon">
              <FileText className="w-5 h-5" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{wordCount}</div>
              <div className="stat-label">Words</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock className="w-5 h-5" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{readingTime}</div>
              <div className="stat-label">Min Read</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Brain className="w-5 h-5" />
            </div>
            <div className="stat-content">
              <div className="stat-value">AI</div>
              <div className="stat-label">Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="summary-content-wrapper">
        <div className={`summary-container ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.4s" }}>
          {/* Toolbar */}
          <div className="summary-toolbar">
            <div className="toolbar-section">
              <div className="toolbar-title">
                <Sparkles className="w-5 h-5" />
                <span>Smart Summary</span>
              </div>
              <div className="toolbar-info">
                <span>Extracted key insights from your document</span>
              </div>
            </div>

            <div className="toolbar-actions">
              <button onClick={handleCopy} className={`action-btn copy-btn ${copied ? "copied" : ""}`}>
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button onClick={handleDownload} className="action-btn download-btn">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>

              {typeof navigator.share === "function" && (
                <button onClick={handleShare} className="action-btn share-btn">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="summary-content">
            <div className="content-background">
              <div className="content-pattern" />
            </div>
            <div className="content-text">
              <p>{summary.content}</p>
            </div>
          </div>

          {/* Summary Features */}
          <div className="summary-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Target className="w-4 h-4" />
              </div>
              <span>Key Points Extracted</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Brain className="w-4 h-4" />
              </div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Intelligent Summarization</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`summary-actions ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.6s" }}>
          <button className="action-button secondary" onClick={onBack}>
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button className="action-button primary" onClick={() => window.location.reload()}>
            <RotateCcw className="w-5 h-5" />
            <span>Create Another</span>
          </button>
        </div>
      </div>
    </div>
  )
}
