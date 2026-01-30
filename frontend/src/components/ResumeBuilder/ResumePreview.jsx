import React, { useState } from 'react';
import '../../styles/ResumePreview.css';

/**
 * ResumePreview Component - Europass-style Resume Display
 * Shows a formatted preview of the resume as it will appear
 */
const ResumePreview = ({ resume = {}, onExportPDF = () => { }, template = 'classic' }) => {
  const [scale, setScale] = useState(100);

  const cefrLevels = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficiency'
  };

  const personalInfo = resume.personalInfo || {};
  const education = resume.education || [];
  const workExperience = resume.workExperience || [];
  const skills = resume.skills || {};
  const certifications = resume.certifications || [];
  const projects = resume.projects || [];
  const languages = resume.languages || [];

  const hasContent = () => {
    return (
      personalInfo.fullName ||
      education.length > 0 ||
      workExperience.length > 0 ||
      Object.values(skills).some(s => s && s.length > 0) ||
      certifications.length > 0 ||
      projects.length > 0 ||
      languages.length > 0
    );
  };

  if (!hasContent()) {
    return (
      <div className="resume-preview empty-state">
        <div className="empty-message">
          <p>📄 Your resume preview will appear here as you build it</p>
          <p className="small-text">Add content in the form on the left to see it reflected here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview-container">
      {/* Preview Controls */}
      <div className="preview-controls">
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => setScale(Math.max(70, scale - 10))}
          >
            −
          </button>
          <span className="zoom-display">{scale}%</span>
          <button
            className="zoom-btn"
            onClick={() => setScale(Math.min(150, scale + 10))}
          >
            +
          </button>
        </div>
        <button className="export-btn" onClick={onExportPDF}>
          📥 Download PDF
        </button>
      </div>

      {/* Resume Preview Content */}
      <div
        id="resume-preview-content"
        className={`resume-preview ${template === 'modern' ? 'modern-style' : 'europass-style'}`}
        style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
      >
        <div className="europass-grid">
          {/* LEFT SIDEBAR - Personal Info & Contact */}
          <aside className="europass-sidebar">
            <div className="profile-photo-placeholder">
              <span>{personalInfo.fullName ? personalInfo.fullName.charAt(0) : '👤'}</span>
            </div>

            <section className="sidebar-section">
              <h3 className="sidebar-title">Contact</h3>
              <ul className="sidebar-contact-list">
                {personalInfo.email && (
                  <li>
                    <span className="icon">✉</span>
                    <div className="contact-text">
                      <span className="label">Email</span>
                      <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                    </div>
                  </li>
                )}
                {personalInfo.phone && (
                  <li>
                    <span className="icon">📞</span>
                    <div className="contact-text">
                      <span className="label">Phone</span>
                      <span>{personalInfo.phone}</span>
                    </div>
                  </li>
                )}
                {personalInfo.address && (
                  <li>
                    <span className="icon">📍</span>
                    <div className="contact-text">
                      <span className="label">Address</span>
                      <span>{personalInfo.address}{personalInfo.country ? `, ${personalInfo.country}` : ''}</span>
                    </div>
                  </li>
                )}
                {personalInfo.linkedIn && (
                  <li>
                    <span className="icon">🔗</span>
                    <div className="contact-text">
                      <span className="label">LinkedIn</span>
                      <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">Profile</a>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            {languages.length > 0 && (
              <section className="sidebar-section">
                <h3 className="sidebar-title">Languages</h3>
                <div className="sidebar-languages">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="sidebar-lang-item">
                      <span className="lang-name">{lang.name}</span>
                      <span className="lang-level">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
              <section className="sidebar-section">
                <h3 className="sidebar-title">Skills</h3>
                {skills.technical?.length > 0 && (
                  <div className="sidebar-skills-group">
                    <span className="skill-group-label">Technical</span>
                    <div className="sidebar-skill-tags">
                      {skills.technical.map((s, i) => <span key={i} className="mini-tag">{s}</span>)}
                    </div>
                  </div>
                )}
                {skills.soft?.length > 0 && (
                  <div className="sidebar-skills-group">
                    <span className="skill-group-label">Soft Skills</span>
                    <div className="sidebar-skill-tags">
                      {skills.soft.map((s, i) => <span key={i} className="mini-tag soft">{s}</span>)}
                    </div>
                  </div>
                )}
              </section>
            )}
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="europass-main">
            <header className="main-header">
              {personalInfo.fullName && (
                <h1 className="main-name">{personalInfo.fullName}</h1>
              )}
              {personalInfo.headline && (
                <p className="main-headline">{personalInfo.headline}</p>
              )}
            </header>

            {personalInfo.summary && (
              <section className="main-section">
                <h2 className="main-section-title">About Me</h2>
                <p className="main-summary-text">{personalInfo.summary}</p>
              </section>
            )}

            {workExperience.length > 0 && (
              <section className="main-section">
                <h2 className="main-section-title">Work Experience</h2>
                <div className="main-list">
                  {workExperience.map((exp, idx) => (
                    <div key={idx} className="main-item">
                      <div className="item-header">
                        <span className="item-date">
                          {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                        <div className="item-info">
                          <h3 className="item-title">{exp.position}</h3>
                          <span className="item-org">{exp.company}</span>
                        </div>
                      </div>
                      {exp.description && <p className="item-desc">{exp.description}</p>}
                      {exp.achievements?.length > 0 && (
                        <ul className="item-bullets">
                          {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className="main-section">
                <h2 className="main-section-title">Education</h2>
                <div className="main-list">
                  {education.map((edu, idx) => (
                    <div key={idx} className="main-item">
                      <div className="item-header">
                        <span className="item-date">
                          {edu.startDate} – {edu.currentlyStudying ? 'Present' : edu.endDate}
                        </span>
                        <div className="item-info">
                          <h3 className="item-title">{edu.degree}</h3>
                          <span className="item-org">{edu.institution}</span>
                        </div>
                      </div>
                      {edu.field && <p className="item-meta">Field: {edu.field}</p>}
                      {edu.grade && <p className="item-meta">Grade: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section className="main-section">
                <h2 className="main-section-title">Certifications</h2>
                <div className="main-list horizontal">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="cert-card">
                      <h4 className="cert-name">{cert.name}</h4>
                      <p className="cert-org">{cert.issuingOrganization}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section className="main-section">
                <h2 className="main-section-title">Projects</h2>
                <div className="main-list">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="main-item">
                      <h3 className="item-title small">{proj.name}</h3>
                      {proj.description && <p className="item-desc">{proj.description}</p>}
                      {proj.url && <a href={proj.url} className="item-link" target="_blank" rel="noopener noreferrer">View Project →</a>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>

        <footer className="europass-footer">
          <div className="footer-line"></div>
          <p>Official Europass CV Format • Generated via AI University Decision Support System</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
