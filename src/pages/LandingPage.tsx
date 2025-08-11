"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  FileText,
  Brain,
  Target,
  ArrowRight,
  Code,
  Zap,
  Users,
  Star,
  CheckCircle,
  Play,
  Award,
  TrendingUp,
  Shield,
  Sparkles,
  Clock,
  BarChart3,
  Lightbulb,
  Globe,
  Rocket,
  Upload,
  Settings,
  Activity,
  Layers,
  Database,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms analyze your documents and generate contextually relevant questions with precision.",
      color: "from-blue-500 to-indigo-600",
      stats: "99.5% Accuracy",
      bgPattern: "brain",
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description:
        "Upload PDF, DOCX, images, and more. Our intelligent parser extracts content from any document format seamlessly.",
      color: "from-purple-500 to-pink-600",
      stats: "15+ Formats",
      bgPattern: "documents",
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description:
        "Personalized difficulty levels and question types that adapt to your learning style and knowledge level.",
      color: "from-emerald-500 to-teal-600",
      stats: "3 Difficulty Levels",
      bgPattern: "target",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Save 90% Time",
      description: "Automated quiz generation saves hours of manual work",
      metric: "90%",
    },
    {
      icon: BarChart3,
      title: "Boost Retention",
      description: "Interactive learning improves knowledge retention by 75%",
      metric: "75%",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption keeps your documents secure",
      metric: "100%",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for 25+ languages and counting",
      metric: "25+",
    },
  ]

  const techStack = [
    { name: "React", color: "from-cyan-400 to-blue-500", icon: Code },
    { name: "TypeScript", color: "from-blue-500 to-indigo-600", icon: FileText },
    { name: "Node.js", color: "from-green-400 to-emerald-500", icon: Settings },
    { name: "Python", color: "from-yellow-400 to-orange-500", icon: Activity },
    { name: "Gemini AI", color: "from-purple-500 to-pink-500", icon: Brain },
    { name: "ChromaDB", color: "from-red-400 to-rose-500", icon: Database },
  ]

  const developers = [
    {
      name: "Narain",
      role: "Lead Full Stack Developer",
      skills: ["React", "Node.js", "AI/ML", "System Architecture"],
      initials: "N",
      gradient: "from-blue-500 to-indigo-600",
      experience: "5+ Years",
      projects: "50+ Projects",
    },
    {
      name: "Nikitha",
      role: "Senior Frontend Developer",
      skills: ["React", "TypeScript", "UI/UX", "Design Systems"],
      initials: "N",
      gradient: "from-purple-500 to-pink-600",
      experience: "4+ Years",
      projects: "40+ Projects",
    },
    {
      name: "Karthikeyan",
      role: "Senior Backend Developer",
      skills: ["Python", "APIs", "Database", "Cloud Architecture"],
      initials: "K",
      gradient: "from-emerald-500 to-teal-600",
      experience: "6+ Years",
      projects: "60+ Projects",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Education Director",
      company: "TechEdu Inc.",
      content:
        "This platform has revolutionized how we create assessments. The AI-generated questions are incredibly accurate and save us countless hours.",
      rating: 5,
      initials: "SJ",
      color: "from-pink-500 to-rose-600",
    },
    {
      name: "Michael Chen",
      role: "Training Manager",
      company: "Global Corp",
      content:
        "The quality of questions generated from our training materials is outstanding. Our team's learning outcomes have improved significantly.",
      rating: 5,
      initials: "MC",
      color: "from-blue-500 to-cyan-600",
    },
  ]

  const processSteps = [
    {
      icon: Upload,
      title: "Upload Document",
      description: "Simply drag and drop your PDF, DOCX, or image files",
      step: "01",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI analyzes content and extracts key information",
      step: "02",
    },
    {
      icon: Target,
      title: "Generate Quiz",
      description: "Personalized questions are created based on your preferences",
      step: "03",
    },
    {
      icon: Award,
      title: "Take Quiz",
      description: "Interactive quiz with real-time feedback and scoring",
      step: "04",
    },
  ]

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <Brain className="w-8 h-8" />
            </div>
            <span className="brand-text">EvaluateAI</span>
          </div>

          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#process" className="nav-link">
              How it Works
            </a>
            <a href="#team" className="nav-link">
              Team
            </a>
            <button className="nav-cta" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
          <div className="floating-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
            <div className="shape shape-4" />
          </div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className={`hero-badge ${isVisible ? "animate-fade-in" : ""}`}>
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Technology</span>
              <div className="badge-shine" />
            </div>

            <h1 className={`hero-title ${isVisible ? "animate-slide-up" : ""}`}>
              Transform Documents into
              <span className="title-highlight"> Interactive Quizzes</span>
              <br />
              with AI Intelligence
            </h1>

            <p className={`hero-description ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.2s" }}>
              Revolutionize your learning experience with our cutting-edge AI platform that converts any document into
              personalized, engaging quizzes in seconds. Perfect for educators, trainers, and lifelong learners.
            </p>

            <div className={`hero-stats ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.4s" }}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Documents Processed</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Target className="w-6 h-6" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">99.5%</div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users className="w-6 h-6" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
              </div>
            </div>

            <div className={`hero-actions ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.6s" }}>
              <button className="cta-primary" onClick={onGetStarted}>
                <Rocket className="w-5 h-5" />
                <span>Start Creating Quizzes</span>
                <div className="button-shine" />
              </button>
              <button className="cta-secondary">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div
              className={`hero-social-proof ${isVisible ? "animate-fade-in" : ""}`}
              style={{ animationDelay: "0.8s" }}
            >
              <div className="social-proof-text">Trusted by leading organizations</div>
              <div className="social-proof-logos">
                <div className="logo-item">
                  <div className="logo-icon">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span>TechEdu</span>
                </div>
                <div className="logo-item">
                  <div className="logo-icon">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span>LearnCorp</span>
                </div>
                <div className="logo-item">
                  <div className="logo-icon">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span>EduTech</span>
                </div>
                <div className="logo-item">
                  <div className="logo-icon">
                    <Award className="w-5 h-5" />
                  </div>
                  <span>SmartLearn</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`hero-visual ${isVisible ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.4s" }}>
            <div className="visual-container">
              <div className="dashboard-mockup">
                <div className="mockup-header">
                  <div className="mockup-controls">
                    <div className="control red" />
                    <div className="control yellow" />
                    <div className="control green" />
                  </div>
                  <div className="mockup-title">AI Quiz Generator</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-section">
                    <div className="section-header">
                      <Brain className="w-5 h-5" />
                      <span>Document Analysis</span>
                    </div>
                    <div className="progress-bars">
                      <div className="progress-item">
                        <span>Content Extraction</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: "95%" }} />
                        </div>
                      </div>
                      <div className="progress-item">
                        <span>Question Generation</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: "87%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mockup-section">
                    <div className="section-header">
                      <Target className="w-5 h-5" />
                      <span>Quiz Preview</span>
                    </div>
                    <div className="quiz-preview">
                      <div className="question-item">
                        <div className="question-number">Q1</div>
                        <div className="question-text">What is the main concept discussed in the document?</div>
                      </div>
                      <div className="question-item">
                        <div className="question-number">Q2</div>
                        <div className="question-text">Which approach is recommended for implementation?</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-elements">
                <div className="floating-card card-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>95% Success Rate</span>
                </div>
                <div className="floating-card card-2">
                  <Award className="w-4 h-4" />
                  <span>AI Powered</span>
                </div>
                <div className="floating-card card-3">
                  <Zap className="w-4 h-4" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="process-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Settings className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <h2 className="section-title">Simple 4-step process to create amazing quizzes</h2>
            <p className="section-description">
              Our streamlined workflow makes it easy to transform any document into an engaging learning experience
            </p>
          </div>

          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`process-card ${isVisible ? "animate-slide-up" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="process-step-number">{step.step}</div>
                <div className="process-icon">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-description">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="process-arrow">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Lightbulb className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title">Everything you need for intelligent learning</h2>
            <p className="section-description">
              Our comprehensive suite of AI-powered tools transforms the way you create and consume educational content
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card premium ${isVisible ? "animate-slide-up" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="feature-background">
                  <div className={`feature-pattern pattern-${feature.bgPattern}`} />
                </div>
                <div className="feature-header">
                  <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="feature-stats">{feature.stats}</div>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
                <div className="feature-footer">
                  <button className="feature-link">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className={`feature-glow bg-gradient-to-br ${feature.color}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <div className="benefits-grid">
            <div className="benefits-content">
              <div className="section-badge">
                <CheckCircle className="w-4 h-4" />
                <span>Why Choose Us</span>
              </div>
              <h2 className="section-title">Accelerate learning with intelligent automation</h2>
              <p className="section-description">
                Our platform combines cutting-edge AI with intuitive design to deliver unparalleled learning experiences
                that adapt to your unique needs and goals.
              </p>

              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <div className="benefit-content">
                      <div className="benefit-header">
                        <h4 className="benefit-title">{benefit.title}</h4>
                        <div className="benefit-metric">{benefit.metric}</div>
                      </div>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="cta-primary" onClick={onGetStarted}>
                <span>Experience the Difference</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="benefits-visual">
              <div className="visual-dashboard">
                <div className="dashboard-card primary-card">
                  <div className="card-header">
                    <Brain className="w-6 h-6" />
                    <span>AI Analysis</span>
                  </div>
                  <div className="card-content">
                    <div className="metric-display">
                      <div className="metric-value">95%</div>
                      <div className="metric-label">Accuracy</div>
                    </div>
                    <div className="progress-indicator">
                      <div className="progress-ring">
                        <svg viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="2"
                            strokeDasharray="95, 100"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-card secondary-card">
                  <div className="card-header">
                    <Target className="w-6 h-6" />
                    <span>Questions Generated</span>
                  </div>
                  <div className="card-metrics">
                    <div className="metric">
                      <span className="metric-value">15</span>
                      <span className="metric-label">Questions</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">3</span>
                      <span className="metric-label">Levels</span>
                    </div>
                  </div>
                </div>
                <div className="dashboard-card tertiary-card">
                  <div className="card-header">
                    <Award className="w-6 h-6" />
                    <span>Performance</span>
                  </div>
                  <div className="performance-chart">
                    <div className="chart-bars">
                      <div className="bar" style={{ height: "60%" }} />
                      <div className="bar" style={{ height: "80%" }} />
                      <div className="bar" style={{ height: "95%" }} />
                      <div className="bar" style={{ height: "75%" }} />
                    </div>
                    <div className="chart-label">Learning Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Users className="w-4 h-4" />
              <span>Customer Success</span>
            </div>
            <h2 className="section-title">Loved by thousands of users worldwide</h2>
            <p className="section-description">
              See what our customers are saying about their experience with our platform
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className={`testimonial-avatar bg-gradient-to-br ${testimonial.color}`}>
                    <span>{testimonial.initials}</span>
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 star-filled" />
                    ))}
                  </div>
                </div>
                <blockquote className="testimonial-content">"{testimonial.content}"</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Code className="w-4 h-4" />
              <span>Technology Stack</span>
            </div>
            <h2 className="section-title">Built with cutting-edge technologies</h2>
            <p className="section-description">
              Powered by industry-leading tools and frameworks for optimal performance, scalability, and reliability
            </p>
          </div>

          <div className="tech-showcase">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={`tech-item ${isVisible ? "animate-fade-in" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`tech-icon bg-gradient-to-br ${tech.color}`}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <span className="tech-name">{tech.name}</span>
                <div className={`tech-glow bg-gradient-to-br ${tech.color}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Users className="w-4 h-4" />
              <span>Our Team</span>
            </div>
            <h2 className="section-title">Meet the brilliant minds behind the platform</h2>
            <p className="section-description">
              Our diverse team of experts combines deep technical knowledge with a passion for educational innovation
            </p>
          </div>

          <div className="team-grid">
            {developers.map((developer, index) => (
              <div
                key={index}
                className={`team-card ${isVisible ? "animate-slide-up" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="team-card-header">
                  <div className="team-avatar-wrapper">
                    <div className={`team-avatar bg-gradient-to-br ${developer.gradient}`}>
                      <span className="avatar-initial">{developer.initials}</span>
                    </div>
                    <div className={`avatar-ring bg-gradient-to-br ${developer.gradient}`} />
                  </div>
                  <div className="team-stats">
                    <div className="team-stat">
                      <span className="stat-value">{developer.experience}</span>
                      <span className="stat-label">Experience</span>
                    </div>
                    <div className="team-stat">
                      <span className="stat-value">{developer.projects}</span>
                      <span className="stat-label">Projects</span>
                    </div>
                  </div>
                </div>

                <div className="team-info">
                  <h3 className="team-name">{developer.name}</h3>
                  <p className="team-role">{developer.role}</p>

                  <div className="team-skills">
                    {developer.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`team-card-glow bg-gradient-to-br ${developer.gradient}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-background">
              <div className="cta-pattern" />
              <div className="cta-shapes">
                <div className="cta-shape shape-1" />
                <div className="cta-shape shape-2" />
                <div className="cta-shape shape-3" />
              </div>
            </div>
            <div className="cta-content">
              <div className="cta-badge">
                <Rocket className="w-4 h-4" />
                <span>Ready to Get Started?</span>
              </div>
              <h2 className="cta-title">Transform your learning experience today</h2>
              <p className="cta-description">
                Join thousands of educators and learners who have already discovered the power of AI-driven education.
                Start creating intelligent quizzes in minutes, not hours.
              </p>
              <div className="cta-actions">
                <button className="cta-primary large" onClick={onGetStarted}>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Free Trial</span>
                  <div className="button-shine" />
                </button>
                <button className="cta-secondary large">
                  <span>Schedule Demo</span>
                </button>
              </div>
              <div className="cta-guarantee">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required • 14-day free trial • Cancel anytime</span>
              </div>
            </div>
            <div className="cta-visual">
              <div className="success-metrics">
                <div className="metric-card">
                  <div className="metric-icon">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-number">300%</span>
                    <span className="metric-text">Faster Creation</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-number">95%</span>
                    <span className="metric-text">Satisfaction</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-number">100%</span>
                    <span className="metric-text">Secure</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cta-glow" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-icon">
              <Brain className="w-8 h-8" />
            </div>
            <span className="brand-text">EvaluateAI</span>
          </div>
          <div className="footer-content">
            <p>© 2024 EvaluateAI. All rights reserved. Built with ❤️ for better learning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
