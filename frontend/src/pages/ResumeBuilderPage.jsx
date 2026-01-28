import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PersonalInfoForm from '../components/ResumeBuilder/PersonalInfoForm';
import EducationForm from '../components/ResumeBuilder/EducationForm';
import WorkExperienceForm from '../components/ResumeBuilder/WorkExperienceForm';
import SkillsForm from '../components/ResumeBuilder/SkillsForm';
import LanguagesForm from '../components/ResumeBuilder/LanguagesForm';
import CertificationsAndProjectsForm from '../components/ResumeBuilder/CertificationsAndProjectsForm';
import ResumePreview from '../components/ResumeBuilder/ResumePreview';
import resumeService from '../services/resumeService';
import '../styles/ResumeBuilder.css';

/**
 * ResumeBuilderPage - Main Resume Builder Interface
 * Multi-step resume form with live preview
 * Europass-inspired European CV format
 */
const ResumeBuilderPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [currentStep, setCurrentStep] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showSidebar, setShowSidebar] = useState(true);

  // Auto-save interval
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (resume && resume.id) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [resume]);

  // Load resume on mount
  useEffect(() => {
    if (resumeId) {
      const loadedResume = resumeService.getResumeById(resumeId);
      if (loadedResume) {
        setResume(loadedResume);
      } else {
        alert('Resume not found');
        navigate('/resume-builder');
      }
    } else {
      // Create new resume
      const newResume = resumeService.createNewResume('New Resume');
      setResume(newResume);
    }
  }, [resumeId, navigate]);

  // Handle auto-save
  const handleAutoSave = () => {
    if (resume && resume.id) {
      try {
        resumeService.saveResume(resume.id, resume);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
      }
    }
  };

  // Handle manual save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const updated = await resumeService.saveResume(resume.id, resume);
      setResume(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('saved'), 3000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Update resume data
  const handleUpdateResume = (section, data) => {
    const updated = { ...resume, [section]: data };
    setResume(updated);
    setSaveStatus('unsaved');
  };

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      await resumeService.exportResumePDF(resume.id, resume.personalInfo?.fullName || 'Resume');
    } catch (error) {
      alert('Failed to export PDF. Using client-side export...');
      resumeService.exportResumePDFClient(resume.id, resume.personalInfo?.fullName || 'Resume');
    }
  };

  // Delete resume
  const handleDeleteResume = () => {
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      try {
        resumeService.deleteResume(resume.id);
        navigate('/resume-builder');
      } catch (error) {
        alert('Error deleting resume');
      }
    }
  };

  // Step indicator
  const steps = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⭐' },
    { id: 'languages', label: 'Languages', icon: '🌐' },
    { id: 'certifications', label: 'Certs & Projects', icon: '📜' }
  ];

  if (!resume) {
    return (
      <div className="resume-builder-page loading">
        <div className="loading-spinner">Loading resume...</div>
      </div>
    );
  }

  return (
    <div className="resume-builder-page">
      {/* Header */}
      <header className="resume-builder-header">
        <div className="header-left">
          <h1 className="page-title">
            📄 Resume Builder
            <span className="europass-badge">Europass Format</span>
          </h1>
          <p className="page-subtitle">Create a professional European CV</p>
        </div>

        <div className="header-right">
          <div className="save-status">
            {saveStatus === 'saving' && (
              <span className="status saving">⏳ Saving...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="status saved">✓ Saved</span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="status unsaved">● Unsaved changes</span>
            )}
            {saveStatus === 'error' && (
              <span className="status error">✕ Save failed</span>
            )}
          </div>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving || saveStatus === 'saved'}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="export-btn secondary"
            onClick={handleExportPDF}
          >
            📥 Download PDF
          </button>
          <button
            className="menu-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
        </div>
      </header>

      <div className="resume-builder-container">
        {/* Left Sidebar - Navigation & Form */}
        <aside className={`resume-builder-sidebar ${showSidebar ? 'visible' : 'hidden'}`}>
          {/* Step Navigation */}
          <nav className="steps-nav">
            <h3 className="nav-title">Build Your Resume</h3>
            <div className="steps-list">
              {steps.map((step) => (
                <button
                  key={step.id}
                  className={`step-button ${currentStep === step.id ? 'active' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-label">{step.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <hr className="nav-divider" />

          {/* Resume Management */}
          <div className="resume-management">
            <h4>Resume Actions</h4>
            <button
              className="action-btn"
              onClick={() => {
                const newResume = resumeService.createNewResume('New Resume');
                navigate(`/resume-builder/${newResume.id}`);
              }}
            >
              ➕ New Resume
            </button>
            <button
              className="action-btn delete-btn"
              onClick={handleDeleteResume}
            >
              🗑️ Delete Resume
            </button>
          </div>

          <hr className="nav-divider" />

          {/* Forms Container */}
          <div className="forms-container">
            {/* Personal Information */}
            {currentStep === 'personal' && (
              <div className="form-wrapper">
                <PersonalInfoForm
                  data={resume.personalInfo}
                  onUpdate={(data) => handleUpdateResume('personalInfo', data)}
                />
              </div>
            )}

            {/* Education */}
            {currentStep === 'education' && (
              <div className="form-wrapper">
                <EducationForm
                  data={resume.education}
                  onUpdate={(data) => handleUpdateResume('education', data)}
                />
              </div>
            )}

            {/* Work Experience */}
            {currentStep === 'experience' && (
              <div className="form-wrapper">
                <WorkExperienceForm
                  data={resume.workExperience}
                  onUpdate={(data) => handleUpdateResume('workExperience', data)}
                />
              </div>
            )}

            {/* Skills */}
            {currentStep === 'skills' && (
              <div className="form-wrapper">
                <SkillsForm
                  data={resume.skills}
                  onUpdate={(data) => handleUpdateResume('skills', data)}
                />
              </div>
            )}

            {/* Languages */}
            {currentStep === 'languages' && (
              <div className="form-wrapper">
                <LanguagesForm
                  data={resume.languages}
                  onUpdate={(data) => handleUpdateResume('languages', data)}
                />
              </div>
            )}

            {/* Certifications & Projects */}
            {currentStep === 'certifications' && (
              <div className="form-wrapper">
                <CertificationsAndProjectsForm
                  data={{
                    certifications: resume.certifications,
                    projects: resume.projects
                  }}
                  onUpdate={(data) => {
                    handleUpdateResume('certifications', data.certifications);
                    handleUpdateResume('projects', data.projects);
                  }}
                />
              </div>
            )}
          </div>

          {/* Step Navigation Buttons */}
          <div className="step-navigation">
            <button
              className="nav-btn prev"
              onClick={() => {
                const currentIdx = steps.findIndex(s => s.id === currentStep);
                if (currentIdx > 0) setCurrentStep(steps[currentIdx - 1].id);
              }}
              disabled={currentStep === 'personal'}
            >
              ← Previous
            </button>
            <button
              className="nav-btn next"
              onClick={() => {
                const currentIdx = steps.findIndex(s => s.id === currentStep);
                if (currentIdx < steps.length - 1) setCurrentStep(steps[currentIdx + 1].id);
              }}
              disabled={currentStep === 'certifications'}
            >
              Next →
            </button>
          </div>
        </aside>

        {/* Right Side - Live Preview */}
        <main className="resume-builder-main">
          <ResumePreview
            resume={resume}
            onExportPDF={handleExportPDF}
          />
        </main>
      </div>

      {/* Floating Help Button */}
      <div className="help-section">
        <details className="help-details">
          <summary className="help-summary">❓ Help & Tips</summary>
          <div className="help-content">
            <h4>Getting Started</h4>
            <ul>
              <li>Fill in your information step by step</li>
              <li>Use the live preview to see changes instantly</li>
              <li>Your resume is automatically saved every 30 seconds</li>
              <li>Download your resume as PDF when ready</li>
            </ul>
            <h4>Europass Format</h4>
            <p>
              This resume follows the European Europass CV format, recognized by employers
              and educational institutions across Europe. The format emphasizes clarity,
              chronological organization, and relevant skills.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
