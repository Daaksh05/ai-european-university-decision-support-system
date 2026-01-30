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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setPrediction(null);
    setRecommendations([]);

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

      // Save to sessionStorage for syncing with Analytics page
      sessionStorage.setItem("profileGPA", formData.gpa);
      sessionStorage.setItem("profileIELTS", formData.ielts);
      sessionStorage.setItem("profileBudget", formData.budget);
      sessionStorage.setItem("profileCountry", formData.country);
      sessionStorage.setItem("profileField", formData.field);

      setRecommendations(recommendRes.data.recommendations || []);
    } catch (err) {
      setError("Backend not running or error occurred");
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

      <select name="country" onChange={handleChange} value={formData.country}>
        <option value="">Select Country (or All Europe)</option>
        <option value="all">All Europe</option>
        <option value="france">France</option>
        <option value="germany">Germany</option>
        <option value="netherlands">Netherlands</option>
        <option value="italy">Italy</option>
        <option value="spain">Spain</option>
        <option value="belgium">Belgium</option>
        <option value="finland">Finland</option>
        <option value="austria">Austria</option>
        <option value="sweden">Sweden</option>
      </select>

      <input name="field" placeholder="Field of Study (e.g., Computer Science)" onChange={handleChange} />

      <button onClick={handleSubmit}>🚀 SUBMIT</button>

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

      {recommendations.length > 0 && (
        <UniversityList universities={recommendations} />
      )}
    </div>
  );
};

export default StudentProfileForm;
