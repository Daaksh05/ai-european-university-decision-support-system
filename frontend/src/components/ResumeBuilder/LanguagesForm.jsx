import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * LanguagesForm Component - Europass Languages Section
 * Manages language proficiency with CEFR levels (A1-C2)
 */
const LanguagesForm = ({ data = [], onUpdate = () => { } }) => {
  const [languages, setLanguages] = useState(data);
  const [expandedId, setExpandedId] = useState(null);
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'B2',
    listening: 'B2',
    reading: 'B2',
    spokenInteraction: 'B2',
    spokenProduction: 'B2',
    writing: 'B2',
    certificate: '',
    certificationDate: ''
  });

  const categories = [
    { id: 'listening', label: 'Listening' },
    { id: 'reading', label: 'Reading' },
    { id: 'spokenInteraction', label: 'Spoken Interaction' },
    { id: 'spokenProduction', label: 'Spoken Production' },
    { id: 'writing', label: 'Writing' }
  ];

  const cefrLevels = [
    { code: 'A1', label: 'Beginner' },
    { code: 'A2', label: 'Elementary' },
    { code: 'B1', label: 'Intermediate' },
    { code: 'B2', label: 'Upper Intermediate' },
    { code: 'C1', label: 'Advanced' },
    { code: 'C2', label: 'Proficiency' }
  ];

  const handleAddLanguage = () => {
    if (!newLanguage.name) {
      alert('Please select or enter a language');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      ...newLanguage
    };

    const updated = [...languages, entry];
    setLanguages(updated);
    onUpdate(updated);
    setNewLanguage({
      name: '',
      proficiency: 'B2',
      listening: 'B2',
      reading: 'B2',
      spokenInteraction: 'B2',
      spokenProduction: 'B2',
      writing: 'B2',
      certificate: '',
      certificationDate: ''
    });
  };

  const handleUpdateLanguage = (id, updatedData) => {
    const updated = languages.map(l => (l.id === id ? { ...l, ...updatedData } : l));
    setLanguages(updated);
    onUpdate(updated);
  };

  const handleDeleteLanguage = (id) => {
    const updated = languages.filter(l => l.id !== id);
    setLanguages(updated);
    onUpdate(updated);
  };

  const handleNewLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage({
      ...newLanguage,
      [name]: value
    });
  };

  return (
    <div className="form-section languages-form">
      <h3 className="form-section-title">Languages</h3>
      <p className="form-section-subtitle">
        Self-assess your language skills using the Europass CEFR grid
      </p>

      {/* Existing Languages */}
      <div className="languages-entries">
        {languages.map((lang) => (
          <div key={lang.id} className="language-entry expanded">
            <div
              className="language-entry-header"
              onClick={() => setExpandedId(expandedId === lang.id ? null : lang.id)}
            >
              <div className="language-entry-summary">
                <h4>{lang.name}</h4>
                <p>Overall: {lang.proficiency}</p>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLanguage(lang.id);
                }}
              >
                ✕
              </button>
            </div>

            <div className="language-entry-details">
              <div className="cefr-grid-container">
                {categories.map(cat => (
                  <div key={cat.id} className="cefr-category-row">
                    <span className="category-label">{cat.label}</span>
                    <div className="cefr-mini-options">
                      {cefrLevels.map(level => (
                        <button
                          key={level.code}
                          className={`cefr-mini-btn ${lang[cat.id] === level.code ? 'active' : ''}`}
                          onClick={() => handleUpdateLanguage(lang.id, { [cat.id]: level.code })}
                        >
                          {level.code}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-row mt-3">
                <input
                  type="text"
                  placeholder="Certification (e.g., TOEFL, IELTS)"
                  value={lang.certificate || ''}
                  onChange={(e) => handleUpdateLanguage(lang.id, { certificate: e.target.value })}
                />
                <input
                  type="month"
                  value={lang.certificationDate || ''}
                  onChange={(e) => handleUpdateLanguage(lang.id, { certificationDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Language */}
      <div className="add-new-section">
        <h4>Add Language</h4>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Language Name (e.g. English)"
            value={newLanguage.name}
            onChange={handleNewLanguageChange}
          />
          <select
            name="proficiency"
            value={newLanguage.proficiency}
            onChange={handleNewLanguageChange}
          >
            {cefrLevels.map(l => <option key={l.code} value={l.code}>{l.code} - {l.label}</option>)}
          </select>
        </div>
        <button className="add-btn" onClick={handleAddLanguage}>
          + Add Language
        </button>
      </div>

      <div className="cefr-info-box">
        <h5>CEFR Proficiency Levels</h5>
        <p>
          <strong>A1-A2:</strong> Basic user - Can understand basic phrases and
          communicate in simple situations
        </p>
        <p>
          <strong>B1-B2:</strong> Independent user - Can express yourself in clear,
          detailed text on various topics
        </p>
        <p>
          <strong>C1-C2:</strong> Proficient user - Can use language flexibly and
          spontaneous
        </p>
      </div>
    </div>
  );
};

export default LanguagesForm;
