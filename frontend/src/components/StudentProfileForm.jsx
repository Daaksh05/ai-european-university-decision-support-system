import React, { useState } from "react";
import api from "../services/api";
import EligibilityResult from "./EligibilityResult";
import UniversityList from "./UniversityList";

function StudentProfileForm() {
  const [profile, setProfile] = useState({
    gpa: "",
    ielts: "",
    budget: "",
    country: "",
    field: "",
  });

  const [result, setResult] = useState("");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setError("");
  };

  const validateForm = () => {
    if (!profile.gpa || !profile.ielts || !profile.budget) {
      setError("Please fill in GPA, IELTS, and Budget fields");
      return false;
    }
    if (isNaN(profile.gpa) || isNaN(profile.ielts) || isNaN(profile.budget)) {
      setError("GPA, IELTS, and Budget must be numbers");
      return false;
    }
    if (profile.gpa < 0 || profile.gpa > 4 || profile.ielts < 0 || profile.ielts > 9 || profile.budget < 0) {
      setError("Invalid values: GPA (0-4), IELTS (0-9), Budget (positive)");
      return false;
    }
    return true;
  };

  const submitProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const predictRes = await api.post("/predict", {
        gpa: parseFloat(profile.gpa),
        ielts: parseFloat(profile.ielts),
        budget: parseFloat(profile.budget),
        country: profile.country,
        field: profile.field,
      });

      if (predictRes.data.status === "success") {
        setResult(predictRes.data.admission_chance);
        setSuccess("✨ Prediction completed!");
      }

      const recommendRes = await api.post("/recommend", {
        gpa: parseFloat(profile.gpa),
        ielts: parseFloat(profile.ielts),
        budget: parseFloat(profile.budget),
        country: profile.country,
        field: profile.field,
      });

      if (recommendRes.data.status === "success") {
        setUniversities(recommendRes.data.recommendations || []);
        // SAVE PROFILE TO SESSION STORAGE FOR RECOMMENDATIONS PAGE
        sessionStorage.setItem("profileGPA", profile.gpa);
        sessionStorage.setItem("profileIELTS", profile.ielts);
        sessionStorage.setItem("profileBudget", profile.budget);
        sessionStorage.setItem("profileCountry", profile.country);
        sessionStorage.setItem("profileField", profile.field);
        if (!recommendRes.data.recommendations || recommendRes.data.recommendations.length === 0) {
          setError("🤔 No universities match your criteria. Try adjusting your budget or IELTS score.");
        }
      }
    } catch (err) {
      setError("⚠️ Failed to submit profile. Please ensure the backend is running.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitProfile();
    }
  };

  return (
    <div>
      <h3>👤 Student Profile</h3>

      {error && (
        <div style={{ 
          padding: "12px", 
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
          color: "#dc2626", 
          borderRadius: "10px", 
          marginBottom: "15px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ 
          padding: "12px", 
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
          color: "#059669", 
          borderRadius: "10px", 
          marginBottom: "15px",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {success}
        </div>
      )}

      <input 
        name="gpa" 
        placeholder="🎓 GPA (0-4)" 
        value={profile.gpa}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        type="number"
        step="0.01"
        min="0"
        max="4"
      />
      <input 
        name="ielts" 
        placeholder="📝 IELTS (0-9)" 
        value={profile.ielts}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        type="number"
        step="0.5"
        min="0"
        max="9"
      />
      <input 
        name="budget" 
        placeholder="💰 Budget (€)" 
        value={profile.budget}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        type="number"
        min="0"
      />
      <input 
        name="country" 
        placeholder="🌍 Preferred Country (optional)" 
        value={profile.country}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <input 
        name="field" 
        placeholder="📚 Field of Study (optional)" 
        value={profile.field}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      <button 
        onClick={submitProfile} 
        disabled={loading} 
        style={{ 
          opacity: loading ? 0.7 : 1, 
          cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "linear-gradient(135deg, #999, #777)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        {loading ? "⏳ Processing..." : "🚀 Submit"}
      </button>

      {result && <EligibilityResult result={result} />}
      {universities.length > 0 && <UniversityList universities={universities} />}
    </div>
  );
}

export default StudentProfileForm;
