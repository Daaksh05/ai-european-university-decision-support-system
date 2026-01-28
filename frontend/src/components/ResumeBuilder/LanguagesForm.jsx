import React, { useState } from 'react';
import '../../styles/FormComponents.css';

/**
 * LanguagesForm Component - Europass Languages Section
 * Manages language proficiency with CEFR levels (A1-C2)
 */
const LanguagesForm = ({ data = [], onUpdate = () => {} }) => {
  const [languages, setLanguages] = useState(data);
  const [expandedId, setExpandedId] = useState(null);
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'B2',
    certificate: '',
    certificationDate: ''
  });

  const cefrLevels = [
    { code: 'A1', label: 'Beginner' },
    { code: 'A2', label: 'Elementary' },
    { code: 'B1', label: 'Intermediate' },
    { code: 'B2', label: 'Upper Intermediate' },
    { code: 'C1', label: 'Advanced' },
    { code: 'C2', label: 'Proficiency' }
  ];

  const commonLanguages = [
    'English',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Portuguese',
    'Dutch',
    'Polish',
    'Russian',
    'Mandarin Chinese',
    'Japanese',
    'Arabic'
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
        List languages you speak with CEFR proficiency levels
      </p>

      {/* Existing Languages */}
      <div className="languages-entries">
        {languages.map((lang) => (
          <div key={lang.id} className="language-entry">
            <div
              className="language-entry-header"
              onClick={() =>
                setExpandedId(expandedId === lang.id ? null : lang.id)
              }
            >
              <div className="language-entry-summary">
                <h4>{lang.name}</h4>
                <p>
                  {cefrLevels.find(l => l.code === lang.proficiency)?.label} (
                  {lang.proficiency})
                </p>
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

            {expandedId === lang.id && (
              <div className="language-entry-details">
                <select
                  value={lang.name}
                  onChange={(e) =>
                    handleUpdateLanguage(lang.id, { name: e.target.value })
                  }
                >
                  <option value="">Select Language</option>
                  {commonLanguages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                <div className="cefr-level-selector">
                  <p>Proficiency Level (CEFR)</p>
                  <div className="cefr-options">
                    {cefrLevels.map((level) => (
                      <label key={level.code} className="cefr-option">
                        <input
                          type="radio"
                          name={`proficiency-${lang.id}`}
                          value={level.code}
                          checked={lang.proficiency === level.code}
                          onChange={(e) =>
                            handleUpdateLanguage(lang.id, {
                              proficiency: e.target.value
                            })
                          }
                        />
                        <span className="cefr-label">
                          {level.code}
                          <small>{level.label}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Certification (e.g., TOEFL, IELTS, DALF)"
                  value={lang.certificate}
                  onChange={(e) =>
                    handleUpdateLanguage(lang.id, { certificate: e.target.value })
                  }
                />
                <input
                  type="month"
                  placeholder="Certification Date"
                  value={lang.certificationDate}
                  onChange={(e) =>
                    handleUpdateLanguage(lang.id, {
                      certificationDate: e.target.value
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Language */}
      <div className="add-new-section">
        <h4>Add New Language</h4>

        <div className="form-row">
          <select
            name="name"
            value={newLanguage.name}
            onChange={handleNewLanguageChange}
          >
            <option value="">Select a Language</option>
            {commonLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or type a language"
            value={newLanguage.name}
            onChange={handleNewLanguageChange}
          />
        </div>

        <div className="cefr-level-selector">
          <p>Proficiency Level (CEFR)</p>
          <div className="cefr-options">
            {cefrLevels.map((level) => (
              <label key={level.code} className="cefr-option">
                <input
                  type="radio"
                  name="proficiency"
                  value={level.code}
                  checked={newLanguage.proficiency === level.code}
                  onChange={handleNewLanguageChange}
                />
                <span className="cefr-label">
                  {level.code}
                  <small>{level.label}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <input
          type="text"
          name="certificate"
          placeholder="Certification (optional, e.g., TOEFL, IELTS, DALF)"
          value={newLanguage.certificate}
          onChange={handleNewLanguageChange}
        />
        <input
          type="month"
          name="certificationDate"
          placeholder="Certification Date"
          value={newLanguage.certificationDate}
          onChange={handleNewLanguageChange}
        />

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
          spontaneously
        </p>
      </div>
    </div>
  );
};

export default LanguagesForm;
