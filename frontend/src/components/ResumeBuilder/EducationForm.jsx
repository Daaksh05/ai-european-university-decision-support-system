import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * EducationForm Component - Europass Education Section
 * Allows adding, editing, and deleting education entries
 */
const EducationForm = ({ data = [], onUpdate = () => {} }) => {
  const [education, setEducation] = useState(data);
  const [expandedId, setExpandedId] = useState(null);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false,
    description: '',
    grade: ''
  });

  const handleAddEducation = () => {
    if (!newEducation.institution || !newEducation.degree) {
      alert('Please fill in Institution and Degree');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      ...newEducation
    };

    const updated = [...education, entry];
    setEducation(updated);
    onUpdate(updated);
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      description: '',
      grade: ''
    });
  };

  const handleUpdateEducation = (id, updatedData) => {
    const updated = education.map(e => (e.id === id ? { ...e, ...updatedData } : e));
    setEducation(updated);
    onUpdate(updated);
  };

  const handleDeleteEducation = (id) => {
    const updated = education.filter(e => e.id !== id);
    setEducation(updated);
    onUpdate(updated);
  };

  const handleNewEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="form-section education-form">
      <h3 className="form-section-title">Education</h3>
      <p className="form-section-subtitle">Add your educational background</p>

      {/* Existing Education Entries */}
      <div className="education-entries">
        {education.map((entry) => (
          <div key={entry.id} className="education-entry">
            <div
              className="education-entry-header"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
            >
              <div className="education-entry-summary">
                <h4>{entry.degree}</h4>
                <p>{entry.institution}</p>
                {entry.startDate && (
                  <span className="education-dates">
                    {entry.startDate} - {entry.currentlyStudying ? 'Present' : entry.endDate}
                  </span>
                )}
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEducation(entry.id);
                }}
              >
                ✕
              </button>
            </div>

            {expandedId === entry.id && (
              <div className="education-entry-details">
                <input
                  type="text"
                  placeholder="Institution Name"
                  value={entry.institution}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { institution: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Degree (e.g., Bachelor of Science)"
                  value={entry.degree}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { degree: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={entry.field}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { field: e.target.value })
                  }
                />
                <input
                  type="month"
                  value={entry.startDate}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { startDate: e.target.value })
                  }
                />
                {!entry.currentlyStudying && (
                  <input
                    type="month"
                    value={entry.endDate}
                    onChange={(e) =>
                      handleUpdateEducation(entry.id, { endDate: e.target.value })
                    }
                  />
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.currentlyStudying}
                    onChange={(e) =>
                      handleUpdateEducation(entry.id, {
                        currentlyStudying: e.target.checked
                      })
                    }
                  />
                  Currently Studying Here
                </label>
                <input
                  type="text"
                  placeholder="Grade / GPA (optional)"
                  value={entry.grade}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { grade: e.target.value })
                  }
                />
                <textarea
                  placeholder="Additional information about your studies..."
                  rows="3"
                  value={entry.description}
                  onChange={(e) =>
                    handleUpdateEducation(entry.id, { description: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Education */}
      <div className="add-new-section">
        <h4>Add New Education Entry</h4>
        <div className="form-row form-row-two">
          <input
            type="text"
            name="institution"
            placeholder="Institution Name *"
            value={newEducation.institution}
            onChange={handleNewEducationChange}
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree (e.g., Bachelor of Science) *"
            value={newEducation.degree}
            onChange={handleNewEducationChange}
          />
        </div>
        <div className="form-row form-row-two">
          <input
            type="text"
            name="field"
            placeholder="Field of Study"
            value={newEducation.field}
            onChange={handleNewEducationChange}
          />
          <input
            type="text"
            name="grade"
            placeholder="Grade / GPA (optional)"
            value={newEducation.grade}
            onChange={handleNewEducationChange}
          />
        </div>
        <div className="form-row form-row-two">
          <input
            type="month"
            name="startDate"
            value={newEducation.startDate}
            onChange={handleNewEducationChange}
          />
          {!newEducation.currentlyStudying && (
            <input
              type="month"
              name="endDate"
              value={newEducation.endDate}
              onChange={handleNewEducationChange}
            />
          )}
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="currentlyStudying"
            checked={newEducation.currentlyStudying}
            onChange={handleNewEducationChange}
          />
          Currently Studying Here
        </label>
        <textarea
          name="description"
          placeholder="Additional information (honors, coursework, achievements)..."
          rows="3"
          value={newEducation.description}
          onChange={handleNewEducationChange}
        />
        <button className="add-btn" onClick={handleAddEducation}>
          + Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
