import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * WorkExperienceForm Component - Europass Work Experience Section
 * Allows adding, editing, and deleting work experience entries
 */
const WorkExperienceForm = ({ data = [], onUpdate = () => {} }) => {
  const [experiences, setExperiences] = useState(data);
  const [expandedId, setExpandedId] = useState(null);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    achievements: []
  });
  const [achievementInput, setAchievementInput] = useState('');

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      alert('Please fill in Company and Position');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      ...newExperience
    };

    const updated = [...experiences, entry];
    setExperiences(updated);
    onUpdate(updated);
    setNewExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      achievements: []
    });
  };

  const handleUpdateExperience = (id, updatedData) => {
    const updated = experiences.map(e =>
      e.id === id ? { ...e, ...updatedData } : e
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const handleDeleteExperience = (id) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    onUpdate(updated);
  };

  const handleNewExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience({
      ...newExperience,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setNewExperience({
        ...newExperience,
        achievements: [...newExperience.achievements, achievementInput]
      });
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index) => {
    setNewExperience({
      ...newExperience,
      achievements: newExperience.achievements.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="form-section work-experience-form">
      <h3 className="form-section-title">Work Experience</h3>
      <p className="form-section-subtitle">Share your professional background</p>

      {/* Existing Work Experience Entries */}
      <div className="experience-entries">
        {experiences.map((entry) => (
          <div key={entry.id} className="experience-entry">
            <div
              className="experience-entry-header"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
            >
              <div className="experience-entry-summary">
                <h4>{entry.position}</h4>
                <p>{entry.company}</p>
                {entry.startDate && (
                  <span className="experience-dates">
                    {entry.startDate} - {entry.currentlyWorking ? 'Present' : entry.endDate}
                  </span>
                )}
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteExperience(entry.id);
                }}
              >
                ✕
              </button>
            </div>

            {expandedId === entry.id && (
              <div className="experience-entry-details">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={entry.company}
                  onChange={(e) =>
                    handleUpdateExperience(entry.id, { company: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Job Title/Position"
                  value={entry.position}
                  onChange={(e) =>
                    handleUpdateExperience(entry.id, { position: e.target.value })
                  }
                />
                <input
                  type="month"
                  value={entry.startDate}
                  onChange={(e) =>
                    handleUpdateExperience(entry.id, { startDate: e.target.value })
                  }
                />
                {!entry.currentlyWorking && (
                  <input
                    type="month"
                    value={entry.endDate}
                    onChange={(e) =>
                      handleUpdateExperience(entry.id, { endDate: e.target.value })
                    }
                  />
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.currentlyWorking}
                    onChange={(e) =>
                      handleUpdateExperience(entry.id, {
                        currentlyWorking: e.target.checked
                      })
                    }
                  />
                  Currently Working Here
                </label>
                <textarea
                  placeholder="Job description and responsibilities..."
                  rows="3"
                  value={entry.description}
                  onChange={(e) =>
                    handleUpdateExperience(entry.id, { description: e.target.value })
                  }
                />
                <div className="achievements-section">
                  <h5>Key Achievements</h5>
                  {entry.achievements && entry.achievements.length > 0 && (
                    <ul className="achievements-list">
                      {entry.achievements.map((achievement, idx) => (
                        <li key={idx}>
                          {achievement}
                          <button
                            className="small-delete-btn"
                            onClick={() => {
                              const updated = entry.achievements.filter(
                                (_, i) => i !== idx
                              );
                              handleUpdateExperience(entry.id, {
                                achievements: updated
                              });
                            }}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Work Experience */}
      <div className="add-new-section">
        <h4>Add New Work Experience</h4>
        <div className="form-row form-row-two">
          <input
            type="text"
            name="company"
            placeholder="Company Name *"
            value={newExperience.company}
            onChange={handleNewExperienceChange}
          />
          <input
            type="text"
            name="position"
            placeholder="Job Title/Position *"
            value={newExperience.position}
            onChange={handleNewExperienceChange}
          />
        </div>
        <div className="form-row form-row-two">
          <input
            type="month"
            name="startDate"
            value={newExperience.startDate}
            onChange={handleNewExperienceChange}
          />
          {!newExperience.currentlyWorking && (
            <input
              type="month"
              name="endDate"
              value={newExperience.endDate}
              onChange={handleNewExperienceChange}
            />
          )}
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="currentlyWorking"
            checked={newExperience.currentlyWorking}
            onChange={handleNewExperienceChange}
          />
          Currently Working Here
        </label>
        <textarea
          name="description"
          placeholder="Job description and main responsibilities..."
          rows="3"
          value={newExperience.description}
          onChange={handleNewExperienceChange}
        />

        <div className="achievements-input">
          <h5>Key Achievements & Metrics</h5>
          <div className="achievement-input-group">
            <input
              type="text"
              placeholder="Add an achievement (e.g., 'Increased sales by 25%')"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddAchievement();
                }
              }}
            />
            <button className="add-achievement-btn" onClick={handleAddAchievement}>
              + Add
            </button>
          </div>
          {newExperience.achievements.length > 0 && (
            <ul className="achievements-list">
              {newExperience.achievements.map((achievement, idx) => (
                <li key={idx}>
                  {achievement}
                  <button
                    className="small-delete-btn"
                    onClick={() => handleRemoveAchievement(idx)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="add-btn" onClick={handleAddExperience}>
          + Add Work Experience
        </button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
