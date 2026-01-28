import React, { useState } from 'react';
import '../../styles/ResumePreview.css';

/**
 * ResumePreview Component - Europass-style Resume Display
 * Shows a formatted preview of the resume as it will appear
 */
const ResumePreview = ({ resume = {}, onExportPDF = () => {} }) => {
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
        className="resume-preview europass-style"
        style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
      >
        {/* HEADER */}
        <header className="resume-header">
          <div className="header-main">
            {personalInfo.fullName && (
              <h1 className="candidate-name">{personalInfo.fullName}</h1>
            )}
            {personalInfo.headline && (
              <p className="professional-headline">{personalInfo.headline}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            {personalInfo.email && (
              <div className="contact-item">
                <span className="contact-label">✉</span>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </div>
            )}
            {personalInfo.phone && (
              <div className="contact-item">
                <span className="contact-label">📞</span>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.address && personalInfo.country && (
              <div className="contact-item">
                <span className="contact-label">📍</span>
                {personalInfo.address}, {personalInfo.country}
              </div>
            )}
            {personalInfo.linkedIn && (
              <div className="contact-item">
                <span className="contact-label">🔗</span>
                <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            )}
            {personalInfo.website && (
              <div className="contact-item">
                <span className="contact-label">🌐</span>
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </header>

        {/* PROFESSIONAL SUMMARY */}
        {personalInfo.summary && (
          <section className="resume-section summary-section">
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">{personalInfo.summary}</p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {workExperience.length > 0 && (
          <section className="resume-section work-experience-section">
            <h2 className="section-title">Work Experience</h2>
            <div className="experiences-list">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="experience-item">
                  <div className="experience-header">
                    <h3 className="job-title">{exp.position}</h3>
                    <span className="company-name">{exp.company}</span>
                    <p className="experience-dates">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="experience-description">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="achievements-list">
                      {exp.achievements.map((achievement, aidx) => (
                        <li key={aidx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="resume-section education-section">
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              {education.map((edu, idx) => (
                <div key={idx} className="education-item">
                  <div className="education-header">
                    <h3 className="degree">{edu.degree}</h3>
                    <span className="institution">{edu.institution}</span>
                    <p className="education-dates">
                      {edu.startDate} – {edu.currentlyStudying ? 'Present' : edu.endDate}
                    </p>
                  </div>
                  {edu.field && <p className="field-of-study">Field: {edu.field}</p>}
                  {edu.grade && <p className="grade">Grade: {edu.grade}</p>}
                  {edu.description && (
                    <p className="education-description">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {(skills.technical?.length > 0 ||
          skills.soft?.length > 0 ||
          skills.languages?.length > 0) && (
          <section className="resume-section skills-section">
            <h2 className="section-title">Skills</h2>

            {skills.technical && skills.technical.length > 0 && (
              <div className="skills-category">
                <h4 className="skill-category-title">Technical Skills</h4>
                <div className="skills-tags-preview">
                  {skills.technical.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills.soft && skills.soft.length > 0 && (
              <div className="skills-category">
                <h4 className="skill-category-title">Soft Skills</h4>
                <div className="skills-tags-preview">
                  {skills.soft.map((skill, idx) => (
                    <span key={idx} className="skill-tag soft-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <section className="resume-section languages-section">
            <h2 className="section-title">Languages</h2>
            <div className="languages-list">
              {languages.map((lang, idx) => (
                <div key={idx} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-level">
                    {lang.proficiency} ({cefrLevels[lang.proficiency]})
                  </span>
                  {lang.certificate && (
                    <span className="language-cert">{lang.certificate}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="resume-section certifications-section">
            <h2 className="section-title">Certifications</h2>
            <div className="certifications-list">
              {certifications.map((cert, idx) => (
                <div key={idx} className="certification-item">
                  <h4 className="cert-name">{cert.name}</h4>
                  <p className="cert-issuer">{cert.issuingOrganization}</p>
                  <p className="cert-date">
                    {cert.issueDate}
                    {!cert.noExpiry && cert.expirationDate
                      ? ` - ${cert.expirationDate}`
                      : cert.noExpiry
                      ? ' - No Expiry'
                      : ''}
                  </p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      View Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="resume-section projects-section">
            <h2 className="section-title">Projects</h2>
            <div className="projects-list">
              {projects.map((project, idx) => (
                <div key={idx} className="project-item">
                  <h4 className="project-name">{project.name}</h4>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-tech">
                      <strong>Technologies:</strong>
                      <div className="tech-tags">
                        {project.technologies.map((tech, tidx) => (
                          <span key={tidx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.url && (
                    <p className="project-link">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        View Project →
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="resume-footer">
          <p>Generated with AI European University Decision Support System</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
