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
      <input name="gpa" placeholder="GPA" onChange={handleChange} />
      <input name="ielts" placeholder="IELTS" onChange={handleChange} />
      <input name="budget" placeholder="Budget (€)" onChange={handleChange} />
      <input name="country" placeholder="Country" onChange={handleChange} />
      <input name="field" placeholder="Field of Study" onChange={handleChange} />

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
