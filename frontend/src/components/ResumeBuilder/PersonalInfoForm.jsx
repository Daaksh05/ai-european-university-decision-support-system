import React, { useState } from 'react';
import { generateAISummary } from '../../services/resumeService';

/**
 * PersonalInfo Component - Europass Personal Information Form
 * Collects name, contact details, location, and professional links
 */
const PersonalInfoForm = ({ data = {}, resume = {}, onUpdate = () => { } }) => {
  const [formData, setFormData] = useState(data);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAISummary(resume);
      if (result && result.summary) {
        const updated = { ...formData, summary: result.summary };
        setFormData(updated);
        onUpdate(updated);
      }
    } catch (error) {
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="form-section personal-info-form">
      {/* ... previous content ... */}
      <h3 className="form-section-title">Personal Information</h3>
      <p className="form-section-subtitle">Start with your basic information</p>

      {/* ... keeping previous fields ... */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Your Full Name"
            value={formData.fullName || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row form-row-two">
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+33 1 23 45 67 89"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row form-row-two">
        <div className="form-group">
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="Street address"
            value={formData.address || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row form-row-two">
        <div className="form-group">
          <label htmlFor="website">Website / Portfolio</label>
          <input
            id="website"
            type="url"
            name="website"
            placeholder="https://yourwebsite.com"
            value={formData.website || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedIn">LinkedIn Profile</label>
          <input
            id="linkedIn"
            type="url"
            name="linkedIn"
            placeholder="https://linkedin.com/in/yourprofile"
            value={formData.linkedIn || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="headline">Professional Headline</label>
          <input
            id="headline"
            type="text"
            name="headline"
            placeholder="e.g., Software Engineer | AI Enthusiast | European Tech Professional"
            value={formData.headline || ''}
            onChange={handleChange}
          />
          <small>Brief summary of your professional identity</small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="summary">Professional Summary</label>
            <button
              type="button"
              className="ai-gen-btn"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? '⌛ Generating...' : '✨ Generate with AI'}
            </button>
          </div>
          <textarea
            id="summary"
            name="summary"
            placeholder="Write a brief professional summary highlighting your key strengths and career objectives..."
            rows="4"
            value={formData.summary || ''}
            onChange={handleChange}
          />
          <small>2-3 sentences about your professional background</small>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
