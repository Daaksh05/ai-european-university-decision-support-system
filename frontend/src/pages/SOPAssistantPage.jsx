import React, { useState } from 'react';
import axios from 'axios';
import './SOPAssistantPage.css';

const API_BASE_URL = 'http://localhost:8000';

const SOPAssistantPage = () => {
    const [formData, setFormData] = useState({
        universityName: '',
        courseName: '',
        studentBackground: '',
        careerGoals: '',
        tone: 'Professional'
    });

    const [generatedSOP, setGeneratedSOP] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/ai/sop/generate`, formData);
            setGeneratedSOP(response.data.sop_text);
        } catch (error) {
            console.error('Error generating SOP:', error);
            alert('Failed to generate Statement of Purpose. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedSOP);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedSOP], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Motivation_Letter_${formData.universityName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="sop-assistant-container">
            <div className="sop-header">
                <h1>✨ AI Motivation Letter Assistant</h1>
                <p>Craft a perfectly tailored Statement of Purpose for your European dream university.</p>
            </div>

            <div className="sop-content-grid">
                {/* Left Side: Input Form */}
                <div className="sop-form-card">
                    <form onSubmit={handleGenerate}>
                        <div className="sop-form-group">
                            <label>Target University</label>
                            <input
                                type="text"
                                name="universityName"
                                placeholder="e.g. Technical University of Munich"
                                value={formData.universityName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sop-form-group">
                            <label>Specific Course</label>
                            <input
                                type="text"
                                name="courseName"
                                placeholder="e.g. M.Sc. in Data Engineering"
                                value={formData.courseName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sop-form-group">
                            <label>Your Background (Briefly)</label>
                            <textarea
                                name="studentBackground"
                                placeholder="Mention your degree, key projects, or work experience..."
                                value={formData.studentBackground}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="sop-form-group">
                            <label>Primary Career Goals</label>
                            <textarea
                                name="careerGoals"
                                placeholder="Where do you see yourself after this course?"
                                value={formData.careerGoals}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="sop-form-group">
                            <label>Letter Tone</label>
                            <div className="tone-selector">
                                {['Professional', 'Academic', 'Enthusiastic'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`tone-btn ${formData.tone === t ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, tone: t })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="sop-generate-btn" disabled={isLoading}>
                            {isLoading ? '🪄 Crafting your letter...' : 'Generate Motivation Letter'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Preview */}
                <div className="sop-preview-card">
                    <div className="preview-header">
                        <h3>Letter Preview</h3>
                        {generatedSOP && (
                            <div className="preview-actions">
                                <button onClick={handleCopy} className="action-link">{copyStatus}</button>
                                <button onClick={handleDownload} className="action-link">Download .txt</button>
                            </div>
                        )}
                    </div>

                    <div className="preview-body">
                        {generatedSOP ? (
                            <div className="generated-text">
                                {generatedSOP.split('\n\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-preview">
                                <div className="magic-icon">🖋️</div>
                                <p>Fill out the form and click generate to see your custom motivation letter here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SOPAssistantPage;
