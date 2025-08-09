import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Evaluate Yourself</span>
          </h1>
          <p className="hero-subtitle">
            Transform your documents into interactive quizzes with AI-powered intelligence
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Upload Documents</h3>
              <p>Support for PDF, DOCX, and image files</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>Powered by Google Gemini for intelligent question generation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Customizable</h3>
              <p>Choose difficulty levels and number of questions</p>
            </div>
          </div>
          <button className="cta-button" onClick={onGetStarted}>
            <span>Start Evaluating Yourself</span>
            <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="about-section">
        <div className="about-content">
          <h2 className="section-title">About the Project</h2>
          <p className="about-description">
            Evaluate Yourself is an innovative AI-powered quiz generation platform that transforms your documents 
            into personalized learning experiences. Using advanced natural language processing and machine learning 
            technologies, our platform analyzes your uploaded content and creates engaging multiple-choice questions 
            tailored to your preferred difficulty level.
          </p>
          
          <div className="tech-stack">
            <h3>Built with Modern Technologies</h3>
            <div className="tech-tags">
              <span className="tech-tag react">React</span>
              <span className="tech-tag typescript">TypeScript</span>
              <span className="tech-tag nodejs">Node.js</span>
              <span className="tech-tag python">Python</span>
              <span className="tech-tag gemini">Gemini AI</span>
              <span className="tech-tag chromadb">ChromaDB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="developers-section">
        <div className="developers-content">
          <h2 className="section-title">Meet the Developers</h2>
          <div className="developers-grid">
            <div className="developer-card">
              <div className="developer-avatar">
                <span>N</span>
              </div>
              <h3>Narain</h3>
              <p>Full Stack Developer</p>
              <div className="developer-skills">
                <span>React</span>
                <span>Node.js</span>
                <span>AI/ML</span>
              </div>
            </div>
            <div className="developer-card">
              <div className="developer-avatar">
                <span>N</span>
              </div>
              <h3>Nikitha</h3>
              <p>Frontend Developer</p>
              <div className="developer-skills">
                <span>React</span>
                <span>TypeScript</span>
                <span>UI/UX</span>
              </div>
            </div>
            <div className="developer-card">
              <div className="developer-avatar">
                <span>K</span>
              </div>
              <h3>Karthikeyan</h3>
              <p>Backend Developer</p>
              <div className="developer-skills">
                <span>Python</span>
                <span>APIs</span>
                <span>Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};