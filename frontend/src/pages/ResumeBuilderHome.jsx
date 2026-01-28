import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import resumeService from '../services/resumeService';
import '../styles/ResumeBuilderHome.css';

/**
 * ResumeBuilderHome - Resume Builder Landing Page
 * Lists existing resumes and allows creating new ones
 */
const ResumeBuilderHome = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    try {
      const allResumes = resumeService.getAllResumes();
      setResumes(allResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newResume = resumeService.createNewResume('New Resume');
    loadResumes();
  };

  const handleDeleteResume = (resumeId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this resume?')) {
      try {
        resumeService.deleteResume(resumeId);
        loadResumes();
      } catch (error) {
        alert('Error deleting resume');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="resume-builder-home">
      {/* Header */}
      <section className="rbh-hero">
        <div className="rbh-hero-content">
          <h1 className="rbh-hero-title">📄 Resume Builder</h1>
          <p className="rbh-hero-subtitle">
            Create a professional Europass-format CV for European opportunities
          </p>
          <button className="rbh-cta-button" onClick={handleCreateNew}>
            ✨ Create New Resume
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="rbh-features">
        <h2>Why Use Our Resume Builder?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🇪🇺</span>
            <h3>Europass Format</h3>
            <p>Follow the European standard recognized across EU institutions</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👁️</span>
            <h3>Live Preview</h3>
            <p>See your resume update in real-time as you type</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📥</span>
            <h3>PDF Export</h3>
            <p>Download your resume as a professional PDF document</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💾</span>
            <h3>Auto-Save</h3>
            <p>Your work is automatically saved every 30 seconds</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Responsive Design</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Multiple Versions</h3>
            <p>Create and manage multiple resumes for different opportunities</p>
          </div>
        </div>
      </section>

      {/* Resumes List */}
      <section className="rbh-resumes">
        <div className="resumes-header">
          <h2>My Resumes</h2>
          <button className="rbh-btn-create" onClick={handleCreateNew}>
            ➕ New Resume
          </button>
        </div>

        {isLoading ? (
          <div className="rbh-loading">
            <p>Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="rbh-empty-state">
            <p className="empty-icon">📋</p>
            <p className="empty-message">No resumes yet</p>
            <p className="empty-help">Create your first resume to get started</p>
            <button className="rbh-btn-create-large" onClick={handleCreateNew}>
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="rbh-resumes-grid">
            {resumes.map((resume) => (
              <Link
                key={resume.id}
                to={`/resume-builder/${resume.id}`}
                className="rbh-resume-card"
              >
                <div className="resume-card-header">
                  <h3 className="resume-card-name">
                    {resume.personalInfo?.fullName || 'Unnamed Resume'}
                  </h3>
                  <button
                    className="resume-card-delete"
                    onClick={(e) => handleDeleteResume(resume.id, e)}
                    title="Delete resume"
                  >
                    🗑️
                  </button>
                </div>

                <div className="resume-card-body">
                  <div className="resume-card-stat">
                    <span className="stat-icon">🎓</span>
                    <span className="stat-label">Education</span>
                    <span className="stat-value">{resume.education?.length || 0}</span>
                  </div>
                  <div className="resume-card-stat">
                    <span className="stat-icon">💼</span>
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{resume.workExperience?.length || 0}</span>
                  </div>
                  <div className="resume-card-stat">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">Skills</span>
                    <span className="stat-value">
                      {(resume.skills?.technical?.length || 0) +
                        (resume.skills?.soft?.length || 0)}
                    </span>
                  </div>
                  <div className="resume-card-stat">
                    <span className="stat-icon">🌐</span>
                    <span className="stat-label">Languages</span>
                    <span className="stat-value">{resume.languages?.length || 0}</span>
                  </div>
                </div>

                <div className="resume-card-footer">
                  <span className="resume-last-updated">
                    Updated {formatDate(resume.updatedAt)}
                  </span>
                  <span className="resume-open-hint">Click to edit →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Getting Started Guide */}
      <section className="rbh-guide">
        <h2>Getting Started</h2>
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-number">1</div>
            <h4>Create or Select Resume</h4>
            <p>Click "New Resume" or open an existing one to edit</p>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <h4>Fill Each Section</h4>
            <p>Complete sections for personal info, education, experience, and skills</p>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <h4>Watch the Preview</h4>
            <p>See your professional resume take shape on the right side</p>
          </div>
          <div className="guide-step">
            <div className="step-number">4</div>
            <h4>Download as PDF</h4>
            <p>Export your completed resume as a professional PDF</p>
          </div>
        </div>
      </section>

      {/* Europass Info */}
      <section className="rbh-europass-info">
        <h3>About Europass Format</h3>
        <p>
          Europass is a European initiative providing tools and guidance to help people
          manage their education, work experience, and skills in Europe. Our resume builder
          follows Europass CV standards, making your resume recognized by employers and
          educational institutions across European Union member states.
        </p>
        <p className="europass-benefits">
          ✓ Standardized format | ✓ EU-recognized | ✓ Easy to scan | ✓ Professional layout
        </p>
      </section>
    </div>
  );
};

export default ResumeBuilderHome;
