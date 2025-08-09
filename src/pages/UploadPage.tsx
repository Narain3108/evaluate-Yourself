import React, { useState } from 'react';
import { uploadFile } from '../api/upload';
import type { Question } from '../App';

interface UploadPageProps {
  onStartQuiz: (questions: Question[]) => void;
  onBack: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onStartQuiz, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('pdf');
  const [numQuestions, setNumQuestions] = useState(5);
  const [level, setLevel] = useState('medium');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage('Please select a file first.');
      return;
    }
    setStatusMessage('');
    setIsLoading(true);
    
    try {
      const result = await uploadFile(file, docType, numQuestions, level);
      onStartQuiz(result.quiz.questions);
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message || 'Operation failed.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <button className="back-button" onClick={onBack}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        <h1 className="upload-title">
          <span className="gradient-text">Create Your Quiz</span>
        </h1>
        <p className="upload-subtitle">Upload your document and customize your learning experience</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-steps">
          <div className="form-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <label className="step-label">Upload Your Document</label>
              <div 
                className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="fileInput"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  hidden
                />
                <label htmlFor="fileInput" className="file-input-label">
                  {file ? (
                    <div className="file-selected">
                      <div className="file-icon">📄</div>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <div className="upload-icon">📤</div>
                      <span>Drag & drop your file here or click to browse</span>
                      <small>Supports PDF, DOCX, and image files</small>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="form-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <label className="step-label">Document Type</label>
              <div className="radio-group">
                {[
                  { value: 'pdf', label: 'PDF Document', icon: '📄' },
                  { value: 'docx', label: 'Word Document', icon: '📝' },
                  { value: 'photo', label: 'Image/Photo', icon: '🖼️' }
                ].map((option) => (
                  <label key={option.value} className={`radio-option ${docType === option.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="docType"
                      value={option.value}
                      checked={docType === option.value}
                      onChange={(e) => setDocType(e.target.value)}
                    />
                    <span className="radio-icon">{option.icon}</span>
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <label className="step-label">Quiz Settings</label>
              <div className="settings-grid">
                <div className="setting-item">
                  <label htmlFor="numQuestions">Number of Questions</label>
                  <div className="number-input-container">
                    <button 
                      type="button" 
                      className="number-btn"
                      onClick={() => setNumQuestions(Math.max(1, numQuestions - 1))}
                    >
                      -
                    </button>
                    <input
                      id="numQuestions"
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10)))}
                      min="1"
                      max="20"
                      className="number-input"
                    />
                    <button 
                      type="button" 
                      className="number-btn"
                      onClick={() => setNumQuestions(Math.min(20, numQuestions + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="setting-item">
                  <label htmlFor="level">Difficulty Level</label>
                  <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="level-select">
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading || !file} className="generate-button">
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Generating Quiz...
            </>
          ) : (
            <>
              <span>Generate My Quiz</span>
              <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </form>

      {statusMessage && (
        <div className="status-message error">
          <span>⚠️ {statusMessage}</span>
        </div>
      )}
    </div>
  );
};