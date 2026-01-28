import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * CertificationsAndProjectsForm Component
 * Manages certifications and portfolio projects
 */
const CertificationsAndProjectsForm = ({ data = { certifications: [], projects: [] }, onUpdate = () => {} }) => {
  const [certificationsProjects, setCertificationsProjects] = useState(data);
  const [expandedCertId, setExpandedCertId] = useState(null);
  const [expandedProjId, setExpandedProjId] = useState(null);

  const [newCert, setNewCert] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    noExpiry: true,
    credentialId: '',
    credentialUrl: ''
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: [],
    url: '',
    date: ''
  });

  const [techInput, setTechInput] = useState('');

  // ============ CERTIFICATIONS ============

  const handleAddCertification = () => {
    if (!newCert.name || !newCert.issuingOrganization) {
      alert('Please fill in Certification Name and Organization');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      ...newCert
    };

    const updated = {
      ...certificationsProjects,
      certifications: [...(certificationsProjects.certifications || []), entry]
    };

    setCertificationsProjects(updated);
    onUpdate(updated);
    setNewCert({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      noExpiry: true,
      credentialId: '',
      credentialUrl: ''
    });
  };

  const handleUpdateCertification = (id, updatedData) => {
    const updated = {
      ...certificationsProjects,
      certifications: certificationsProjects.certifications.map(c =>
        c.id === id ? { ...c, ...updatedData } : c
      )
    };
    setCertificationsProjects(updated);
    onUpdate(updated);
  };

  const handleDeleteCertification = (id) => {
    const updated = {
      ...certificationsProjects,
      certifications: certificationsProjects.certifications.filter(c => c.id !== id)
    };
    setCertificationsProjects(updated);
    onUpdate(updated);
  };

  const handleNewCertChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCert({
      ...newCert,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // ============ PROJECTS ============

  const handleAddProject = () => {
    if (!newProject.name) {
      alert('Please enter project name');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      ...newProject
    };

    const updated = {
      ...certificationsProjects,
      projects: [...(certificationsProjects.projects || []), entry]
    };

    setCertificationsProjects(updated);
    onUpdate(updated);
    setNewProject({
      name: '',
      description: '',
      technologies: [],
      url: '',
      date: ''
    });
    setTechInput('');
  };

  const handleUpdateProject = (id, updatedData) => {
    const updated = {
      ...certificationsProjects,
      projects: certificationsProjects.projects.map(p =>
        p.id === id ? { ...p, ...updatedData } : p
      )
    };
    setCertificationsProjects(updated);
    onUpdate(updated);
  };

  const handleDeleteProject = (id) => {
    const updated = {
      ...certificationsProjects,
      projects: certificationsProjects.projects.filter(p => p.id !== id)
    };
    setCertificationsProjects(updated);
    onUpdate(updated);
  };

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput]
      });
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (index) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="form-section certifications-projects-form">
      <h3 className="form-section-title">Certifications & Projects</h3>
      <p className="form-section-subtitle">
        Showcase your professional credentials and portfolio work
      </p>

      {/* ============ CERTIFICATIONS SECTION ============ */}
      <div className="subsection certifications-subsection">
        <h4>Certifications</h4>

        {/* Existing Certifications */}
        <div className="certifications-entries">
          {certificationsProjects.certifications &&
            certificationsProjects.certifications.map((cert) => (
              <div key={cert.id} className="cert-entry">
                <div
                  className="cert-entry-header"
                  onClick={() =>
                    setExpandedCertId(expandedCertId === cert.id ? null : cert.id)
                  }
                >
                  <div className="cert-entry-summary">
                    <h5>{cert.name}</h5>
                    <p>{cert.issuingOrganization}</p>
                    {cert.issueDate && (
                      <span className="cert-date">
                        {cert.issueDate}
                        {!cert.noExpiry && cert.expirationDate
                          ? ` - ${cert.expirationDate}`
                          : cert.noExpiry
                          ? ' - No Expiry'
                          : ''}
                      </span>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCertification(cert.id);
                    }}
                  >
                    ✕
                  </button>
                </div>

                {expandedCertId === cert.id && (
                  <div className="cert-entry-details">
                    <input
                      type="text"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, { name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization"
                      value={cert.issuingOrganization}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          issuingOrganization: e.target.value
                        })
                      }
                    />
                    <input
                      type="month"
                      placeholder="Issue Date"
                      value={cert.issueDate}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, { issueDate: e.target.value })
                      }
                    />
                    {!cert.noExpiry && (
                      <input
                        type="month"
                        placeholder="Expiration Date"
                        value={cert.expirationDate}
                        onChange={(e) =>
                          handleUpdateCertification(cert.id, {
                            expirationDate: e.target.value
                          })
                        }
                      />
                    )}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={cert.noExpiry}
                        onChange={(e) =>
                          handleUpdateCertification(cert.id, {
                            noExpiry: e.target.checked
                          })
                        }
                      />
                      No Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="Credential ID"
                      value={cert.credentialId}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          credentialId: e.target.value
                        })
                      }
                    />
                    <input
                      type="url"
                      placeholder="Credential URL"
                      value={cert.credentialUrl}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          credentialUrl: e.target.value
                        })
                      }
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Add New Certification */}
        <div className="add-new-section">
          <h5>Add New Certification</h5>
          <input
            type="text"
            name="name"
            placeholder="Certification Name *"
            value={newCert.name}
            onChange={handleNewCertChange}
          />
          <input
            type="text"
            name="issuingOrganization"
            placeholder="Issuing Organization *"
            value={newCert.issuingOrganization}
            onChange={handleNewCertChange}
          />
          <input
            type="month"
            name="issueDate"
            value={newCert.issueDate}
            onChange={handleNewCertChange}
          />
          {!newCert.noExpiry && (
            <input
              type="month"
              name="expirationDate"
              value={newCert.expirationDate}
              onChange={handleNewCertChange}
            />
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="noExpiry"
              checked={newCert.noExpiry}
              onChange={handleNewCertChange}
            />
            No Expiry
          </label>
          <input
            type="text"
            name="credentialId"
            placeholder="Credential ID (optional)"
            value={newCert.credentialId}
            onChange={handleNewCertChange}
          />
          <input
            type="url"
            name="credentialUrl"
            placeholder="Credential URL (optional)"
            value={newCert.credentialUrl}
            onChange={handleNewCertChange}
          />
          <button className="add-btn" onClick={handleAddCertification}>
            + Add Certification
          </button>
        </div>
      </div>

      {/* ============ PROJECTS SECTION ============ */}
      <div className="subsection projects-subsection">
        <h4>Projects</h4>

        {/* Existing Projects */}
        <div className="projects-entries">
          {certificationsProjects.projects &&
            certificationsProjects.projects.map((project) => (
              <div key={project.id} className="project-entry">
                <div
                  className="project-entry-header"
                  onClick={() =>
                    setExpandedProjId(expandedProjId === project.id ? null : project.id)
                  }
                >
                  <div className="project-entry-summary">
                    <h5>{project.name}</h5>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-tech-tags">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="tech-tag">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                  >
                    ✕
                  </button>
                </div>

                {expandedProjId === project.id && (
                  <div className="project-entry-details">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) =>
                        handleUpdateProject(project.id, { name: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Project Description"
                      rows="3"
                      value={project.description}
                      onChange={(e) =>
                        handleUpdateProject(project.id, { description: e.target.value })
                      }
                    />
                    <input
                      type="url"
                      placeholder="Project URL / GitHub Link"
                      value={project.url}
                      onChange={(e) =>
                        handleUpdateProject(project.id, { url: e.target.value })
                      }
                    />
                    <input
                      type="month"
                      placeholder="Date"
                      value={project.date}
                      onChange={(e) =>
                        handleUpdateProject(project.id, { date: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Add New Project */}
        <div className="add-new-section">
          <h5>Add New Project</h5>
          <input
            type="text"
            placeholder="Project Name *"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
          <textarea
            placeholder="Project Description"
            rows="3"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <input
            type="url"
            placeholder="Project URL / GitHub Link"
            value={newProject.url}
            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
          />
          <input
            type="month"
            placeholder="Date"
            value={newProject.date}
            onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
          />

          <div className="technologies-input">
            <h5>Technologies Used</h5>
            <div className="tech-input-group">
              <input
                type="text"
                placeholder="Add a technology (e.g., React, Python)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTechnology();
                  }
                }}
              />
              <button className="add-tech-btn" onClick={handleAddTechnology}>
                + Add
              </button>
            </div>
            {newProject.technologies.length > 0 && (
              <div className="technologies-list">
                {newProject.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                    <button
                      className="badge-remove-btn"
                      onClick={() => handleRemoveTechnology(idx)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button className="add-btn" onClick={handleAddProject}>
            + Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificationsAndProjectsForm;
