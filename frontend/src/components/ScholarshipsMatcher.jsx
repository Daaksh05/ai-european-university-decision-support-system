import React, { useState } from "react";
import api from "../services/api";

function ScholarshipsMatcher() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const countries = ["France", "Germany", "Netherlands", "Belgium", "Italy", "Spain", "Finland", "Austria"];

  const findScholarships = async () => {
    if (!selectedCountry.trim()) {
      setError("Please select a country");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/scholarships", { country: selectedCountry });
      if (res.data.status === "success") {
        setScholarships(res.data.scholarships || []);
        if (!res.data.scholarships || res.data.scholarships.length === 0) {
          setError(`No scholarships found for ${selectedCountry}. Check the main database.`);
        }
      } else {
        setError("Failed to fetch scholarships");
      }
    } catch (err) {
      setError("Error fetching scholarships");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>🎓 Scholarships Matcher</h3>

      {error && (
        <div style={{
          padding: "12px",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
          color: "#dc2626",
          borderRadius: "10px",
          marginBottom: "12px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          ⚠️ {error}
        </div>
      )}

      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setError("");
        }}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "2px solid #e0e7ff",
          fontSize: "14px",
          background: "linear-gradient(135deg, #f5f7ff 0%, #f0f4ff 100%)",
          cursor: "pointer"
        }}
      >
        <option value="">Select a Country...</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <button
        onClick={findScholarships}
        disabled={loading}
        style={{
          background: loading ? "linear-gradient(135deg, #999, #777)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        {loading ? "🔍 Searching..." : "🔍 Find Scholarships"}
      </button>

      {scholarships.length > 0 && (
        <div className="result-box" style={{ marginTop: "20px" }}>
          <h4 style={{ margin: "0 0 15px 0" }}>💰 Available Scholarships</h4>
          {scholarships.map((scholarship, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                marginBottom: "12px",
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(79, 172, 254, 0.05) 100%)",
                borderRadius: "10px",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <strong style={{
                  fontSize: "15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  {scholarship.name}
                </strong>
                <span style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700"
                }}>
                  €{(scholarship.amount_eur || 0).toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                <p style={{ margin: "4px 0" }}>📋 <strong>Coverage:</strong> {scholarship.coverage}</p>
                <p style={{ margin: "4px 0" }}>✅ <strong>Eligibility:</strong> {scholarship.eligibility}</p>
                {scholarship.website_url && scholarship.website_url !== "#" && (
                  <p style={{ margin: "12px 0 0 0" }}>
                    <a
                      href={scholarship.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#667eea",
                        fontWeight: "700",
                        textDecoration: "none",
                        fontSize: "13px",
                        padding: "4px 0",
                        borderBottom: "2px solid rgba(102, 126, 234, 0.3)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => e.target.style.borderBottomColor = "#667eea"}
                      onMouseOut={(e) => e.target.style.borderBottomColor = "rgba(102, 126, 234, 0.3)"}
                    >
                      🔗 Official Website
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScholarshipsMatcher;
