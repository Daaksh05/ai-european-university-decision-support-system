import React, { useState } from "react";
import api from "../services/api";
import UniversityList from "./UniversityList";
import "../styles/StudentProfileForm.css";

const StudentProfileForm = () => {
  const [formData, setFormData] = useState({
    gpa: "",
    ielts: "",
    budget: "",
    country: "",
    field: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setPrediction(null);
    setRecommendations([]);
    setLoading(true);

    try {
      const predictRes = await api.post("/predict", {
        gpa: Number(formData.gpa),
        ielts: Number(formData.ielts),
        budget: Number(formData.budget),
        country: formData.country,
        field: formData.field,
      });

      setPrediction(predictRes.data);

      const recommendRes = await api.post("/recommend", {
        gpa: Number(formData.gpa),
        ielts: Number(formData.ielts),
        budget: Number(formData.budget),
        country: formData.country,
        field: formData.field,
      });

      console.log("Recommend API Response:", recommendRes.data);

      // Save to sessionStorage for syncing with Analytics page
      sessionStorage.setItem("profileGPA", formData.gpa);
      sessionStorage.setItem("profileIELTS", formData.ielts);
      sessionStorage.setItem("profileBudget", formData.budget);
      sessionStorage.setItem("profileCountry", formData.country);
      sessionStorage.setItem("profileField", formData.field);

      setRecommendations(recommendRes.data.recommendations || []);
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };


  const chanceClass =
    prediction?.chance === "HIGH"
      ? "high"
      : prediction?.chance === "MEDIUM"
        ? "medium"
        : "low";

  return (
    <div className="profile-container">
      <input name="gpa" type="number" step="0.1" min="0" max="4.0" placeholder="GPA (0.0 - 4.0)" onChange={handleChange} />
      <input name="ielts" type="number" step="0.5" min="0" max="9.0" placeholder="IELTS (0.0 - 9.0)" onChange={handleChange} />
      <input name="budget" type="number" min="0" placeholder="Budget (€)" onChange={handleChange} />

      <div className="profile-row">
        <select name="country" onChange={handleChange} value={formData.country}>
          <option value="">Select Country</option>
          <option value="all">All Europe</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Italy">Italy</option>
          <option value="Spain">Spain</option>
          <option value="Belgium">Belgium</option>
          <option value="Finland">Finland</option>
          <option value="Austria">Austria</option>
          <option value="Sweden">Sweden</option>
        </select>

        <select name="field" onChange={handleChange} value={formData.field}>
          <option value="">Select Field of Study</option>
          <option value="all">All Fields</option>
          <option value="Engineering">Engineering</option>
          <option value="Computer Science / AI">Computer Science / AI</option>
          <option value="Data Science">Data Science</option>
          <option value="Business / MBA">Business / MBA</option>
          <option value="Medicine / Healthcare">Medicine / Healthcare</option>
          <option value="Social Sciences">Social Sciences</option>
          <option value="Natural Sciences">Natural Sciences</option>
          <option value="Law & Legal Studies">Law & Legal Studies</option>
          <option value="Arts / Humanities">Arts / Humanities</option>
          <option value="Architecture & Design">Architecture & Design</option>
          <option value="Psychology">Psychology</option>
          <option value="Education">Education</option>
          <option value="Hospitality & Tourism">Hospitality & Tourism</option>
        </select>

      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "🔄 SEARCHING..." : "🚀 SUBMIT PROFILE"}
      </button>



      {error && <p style={{ color: "red" }}>{error}</p>}

      {prediction && (
        <div className={`admission-box ${chanceClass}`}>
          <h3>🎯 ADMISSION CHANCE</h3>
          <h2>{prediction.chance}</h2>
          <p>{prediction.message}</p>
          <p>
            <b>Probability:</b> {prediction.probability}%
          </p>
        </div>
      )}

      {prediction && (
        <UniversityList universities={recommendations} />
      )}

    </div>
  );
};

export default StudentProfileForm;
