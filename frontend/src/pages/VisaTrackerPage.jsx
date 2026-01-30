import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VisaTrackerPage.css';

const API_BASE_URL = 'http://localhost:8000';

const VisaTrackerPage = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [requirements, setRequirements] = useState(null);
    const [userProgress, setUserProgress] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch supported countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/visa/countries`);
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();

        // Load progress from localStorage
        const savedProgress = localStorage.getItem('visa_tracker_progress');
        if (savedProgress) {
            setUserProgress(JSON.parse(savedProgress));
        }
    }, []);

    // Fetch requirements when country changes
    const handleCountryChange = async (e) => {
        const countryCode = e.target.value;
        setSelectedCountry(countryCode);
        if (!countryCode) {
            setRequirements(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/visa/requirements/${countryCode}`);
            setRequirements(response.data);
        } catch (error) {
            console.error('Error fetching requirements:', error);
            alert('Could not load visa requirements for this country.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleItem = (itemId) => {
        const updated = {
            ...userProgress,
            [itemId]: !userProgress[itemId]
        };
        setUserProgress(updated);
        localStorage.setItem('visa_tracker_progress', JSON.stringify(updated));
    };

    const calculateProgress = () => {
        if (!requirements) return 0;
        const allItems = requirements.categories.flatMap(cat => cat.items);
        const completedCount = allItems.filter(item => userProgress[item.id]).length;
        return Math.round((completedCount / allItems.length) * 100);
    };

    return (
        <div className="visa-tracker-container">
            <div className="visa-header">
                <h1>🛂 Visa & Document Tracker</h1>
                <p>Interactive checklist to guide you through your European student visa process.</p>
            </div>

            <div className="country-selector-section">
                <label htmlFor="country-select">Select Your Target Country:</label>
                <select
                    id="country-select"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="country-dropdown"
                >
                    <option value="">-- Choose a Country --</option>
                    {countries.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
            </div>

            {isLoading && <div className="loading-spinner">Loading requirements...</div>}

            {requirements && (
                <div className="tracker-dashboard">
                    <div className="progress-overview">
                        <div className="progress-info">
                            <span>Overall Readiness for {requirements.country_name}</span>
                            <span>{calculateProgress()}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${calculateProgress()}%` }}
                            ></div>
                        </div>
                        <p className="visa-type-label">Target Visa: <strong>{requirements.visa_type}</strong></p>
                    </div>

                    <div className="requirements-grid">
                        {requirements.categories.map((category, catIdx) => (
                            <div key={catIdx} className="requirement-category">
                                <h3>{category.title}</h3>
                                <div className="items-list">
                                    {category.items.map(item => (
                                        <div
                                            key={item.id}
                                            className={`requirement-item ${userProgress[item.id] ? 'completed' : ''}`}
                                            onClick={() => handleToggleItem(item.id)}
                                        >
                                            <div className="item-checkbox">
                                                {userProgress[item.id] ? '✓' : ''}
                                            </div>
                                            <div className="item-details">
                                                <span className="item-label">{item.label}</span>
                                                <p className="item-desc">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pro-tip-box">
                        <h4>💡 Pro Tip:</h4>
                        <p>Always check the official embassy website of your home country for the most up-to-date document list, as specific requirements can vary locally.</p>
                    </div>
                </div>
            )}

            {!selectedCountry && !isLoading && (
                <div className="empty-state">
                    <div className="empty-icon">🇪🇺</div>
                    <h3>Plan Your Arrival</h3>
                    <p>Select a country above to see a detailed document checklist for your student visa application.</p>
                </div>
            )}
        </div>
    );
};

export default VisaTrackerPage;
