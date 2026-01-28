import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * SkillsForm Component - Europass Skills Section
 * Manages technical skills, soft skills, and languages
 */
const SkillsForm = ({ data = { technical: [], languages: [], soft: [] }, onUpdate = () => {} }) => {
  const [skills, setSkills] = useState(data);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');

  const handleAddTechnicalSkill = () => {
    if (newTechnicalSkill.trim()) {
      const updated = {
        ...skills,
        technical: [...(skills.technical || []), newTechnicalSkill]
      };
      setSkills(updated);
      onUpdate(updated);
      setNewTechnicalSkill('');
    }
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim()) {
      const updated = {
        ...skills,
        soft: [...(skills.soft || []), newSoftSkill]
      };
      setSkills(updated);
      onUpdate(updated);
      setNewSoftSkill('');
    }
  };

  const handleRemoveSkill = (type, index) => {
    const updated = {
      ...skills,
      [type]: skills[type].filter((_, i) => i !== index)
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const technicalSkillSuggestions = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'SQL',
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'Django',
    'Flask',
    'Machine Learning',
    'AI/NLP',
    'Data Analysis',
    'Cloud Computing',
    'AWS',
    'Docker',
    'Git',
    'Linux',
    'Windows'
  ];

  const softSkillSuggestions = [
    'Communication',
    'Leadership',
    'Problem Solving',
    'Teamwork',
    'Project Management',
    'Critical Thinking',
    'Time Management',
    'Adaptability',
    'Creativity',
    'Negotiation',
    'Public Speaking',
    'Emotional Intelligence'
  ];

  return (
    <div className="form-section skills-form">
      <h3 className="form-section-title">Skills</h3>
      <p className="form-section-subtitle">Highlight your professional competencies</p>

      {/* Technical Skills */}
      <div className="skills-subsection">
        <h4>Technical Skills</h4>
        <div className="skills-display">
          {skills.technical && skills.technical.length > 0 ? (
            <div className="skills-tags">
              {skills.technical.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                  <button
                    className="tag-remove-btn"
                    onClick={() => handleRemoveSkill('technical', idx)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-message">No technical skills added yet</p>
          )}
        </div>

        <div className="skill-input-group">
          <input
            type="text"
            placeholder="Add a technical skill (e.g., Python, React, AWS)"
            value={newTechnicalSkill}
            onChange={(e) => setNewTechnicalSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTechnicalSkill();
              }
            }}
          />
          <button className="add-skill-btn" onClick={handleAddTechnicalSkill}>
            + Add
          </button>
        </div>

        <div className="skill-suggestions">
          <p>Popular technical skills:</p>
          <div className="suggestions-grid">
            {technicalSkillSuggestions.slice(0, 8).map((skill) => (
              <button
                key={skill}
                className="suggestion-btn"
                onClick={() => {
                  if (!skills.technical || !skills.technical.includes(skill)) {
                    const updated = {
                      ...skills,
                      technical: [...(skills.technical || []), skill]
                    };
                    setSkills(updated);
                    onUpdate(updated);
                  }
                }}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Soft Skills */}
      <div className="skills-subsection">
        <h4>Soft Skills</h4>
        <div className="skills-display">
          {skills.soft && skills.soft.length > 0 ? (
            <div className="skills-tags">
              {skills.soft.map((skill, idx) => (
                <span key={idx} className="skill-tag soft-skill-tag">
                  {skill}
                  <button
                    className="tag-remove-btn"
                    onClick={() => handleRemoveSkill('soft', idx)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-message">No soft skills added yet</p>
          )}
        </div>

        <div className="skill-input-group">
          <input
            type="text"
            placeholder="Add a soft skill (e.g., Leadership, Communication)"
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSoftSkill();
              }
            }}
          />
          <button className="add-skill-btn" onClick={handleAddSoftSkill}>
            + Add
          </button>
        </div>

        <div className="skill-suggestions">
          <p>Popular soft skills:</p>
          <div className="suggestions-grid">
            {softSkillSuggestions.slice(0, 8).map((skill) => (
              <button
                key={skill}
                className="suggestion-btn"
                onClick={() => {
                  if (!skills.soft || !skills.soft.includes(skill)) {
                    const updated = {
                      ...skills,
                      soft: [...(skills.soft || []), skill]
                    };
                    setSkills(updated);
                    onUpdate(updated);
                  }
                }}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="info-box">
        <p>
          💡 <strong>Tip:</strong> Tailor your skills to match the job descriptions
          you're applying for. Use keywords from job postings.
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
