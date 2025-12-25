import React, { useState } from "react";
import api from "../services/api";
import "../styles/StudentProfileForm.css";

const StudentProfileForm = () => {
  const [profile, setProfile] = useState({
    gpa: "",
    ielts: "",
    budget: "",
    country: "",
    field: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const res = await api.post("/predict", {
        gpa: Number(profile.gpa),
        ielts: Number(profile.ielts),
        budget: Number(profile.budget),
        country: profile.country,
        field: profile.field,
      });

      if (res.data.status === "success") {
        setPrediction(res.data);
      } else {
        setError("Prediction failed");
      }
    } catch (err) {
      setError("Backend not running or API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>🎓 Student Profile</h2>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.1"
          name="gpa"
          placeholder="GPA (out of 4)"
          value={profile.gpa}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.5"
          name="ielts"
          placeholder="IELTS (out of 9)"
          value={profile.ielts}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget (€)"
          value={profile.budget}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Preferred Country"
          value={profile.country}
          onChange={handleChange}
        />

        <input
          type="text"
          name="field"
          placeholder="Field of Study (optional)"
          value={profile.field}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "🚀 SUBMIT"}
        </button>
      </form>

      {/* ================= ADMISSION CHANCE ================= */}
      {prediction && (
        <div
          className={`admission-card ${
            prediction.chance === "HIGH"
              ? "green"
              : prediction.chance === "MEDIUM"
              ? "yellow"
              : "red"
          }`}
        >
          <h3>🎯 ADMISSION CHANCE</h3>
          <h2>{prediction.chance}</h2>
          <p>{prediction.message}</p>
          <p>
            <b>Probability:</b> {prediction.probability}%
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentProfileForm;
