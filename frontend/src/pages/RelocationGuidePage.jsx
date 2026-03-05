import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./RelocationGuidePage.css";

const RelocationGuidePage = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [guideData, setGuideData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using direct URL as per existing pattern, but adding error handling
            const response = await api.get("/api/relocation/supported-countries");
            setCountries(response.data);
            if (response.data && response.data.length > 0) {
                handleCountrySelect(response.data[0].code);
            } else {
                setError("No supported countries found.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
            setError("Unable to load relocation data. Please ensure the backend is running.");
            setLoading(false);
        }
    };

    const handleCountrySelect = async (code) => {
        setSelectedCountry(code);
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/relocation/${code}`);
            setGuideData(response.data);
        } catch (error) {
            console.error("Error fetching guide data:", error);
            setError("Failed to load guide for " + code);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relocation-guide-page">
            <div className="relocation-header">
                <h1>🇪🇺 EuroPath AI: Relocation Guide</h1>
                <p>Your intelligent roadmap for moving to Europe after admission.</p>
            </div>

            <div className="country-selector">
                {countries.map((country) => (
                    <button
                        key={country.code}
                        className={`country-tab ${selectedCountry === country.code ? "active" : ""}`}
                        onClick={() => handleCountrySelect(country.code)}
                    >
                        {country.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loader">Loading your roadmap...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                guideData && (
                    <div className="guide-content">
                        <div className="steps-container">
                            {guideData.steps.map((step, index) => (
                                <div key={step.id} className="step-card">
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-info">
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                        <div className="step-links">
                                            {step.links.map((link) => (
                                                <a
                                                    key={link.url}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="external-link"
                                                >
                                                    🔗 {link.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default RelocationGuidePage;
