import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/FiltersPanel.css";

const FiltersPanel = ({ onFilterChange, onFiltered, isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    minRanking: 1,
    maxRanking: 500,
    minTuition: 0,
    maxTuition: 50000,
    country: "",
    scholarshipAvailable: false,
    programType: "",
    admissionChance: 0,
  });

  const [allRecommendations, setAllRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recommendations when component mounts
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.post("/recommend", {
          gpa: sessionStorage.getItem("profileGPA") ? parseFloat(sessionStorage.getItem("profileGPA")) : 3.5,
          ielts: sessionStorage.getItem("profileIELTS") ? parseFloat(sessionStorage.getItem("profileIELTS")) : 6.5,
          budget: sessionStorage.getItem("profileBudget") ? parseFloat(sessionStorage.getItem("profileBudget")) : 20000,
          country: sessionStorage.getItem("profileCountry") || "",
          field: sessionStorage.getItem("profileField") || "",
        });
        if (response.data.status === "success") {
          setAllRecommendations(response.data.recommendations || []);
          applyFilters(response.data.recommendations || [], filters);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setAllRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const countries = ["Germany", "Netherlands", "UK", "Sweden", "France", "Switzerland"];
  const programTypes = ["Engineering", "Business", "Medicine", "Law", "Science", "Arts"];

  const applyFilters = (universities, filterObj) => {
    const filtered = universities.filter(u => {
      const ranking = u.ranking || 999;
      const tuition = u.average_fees_eur || 0;
      const country = u.country || "";
      const program = u.field || "";
      const hasScholarship = u.scholarships && u.scholarships.length > 0;

      return (
        ranking >= filterObj.minRanking &&
        ranking <= filterObj.maxRanking &&
        tuition >= filterObj.minTuition &&
        tuition <= filterObj.maxTuition &&
        (!filterObj.country || country.toLowerCase() === filterObj.country.toLowerCase()) &&
        (!filterObj.programType || program.toLowerCase() === filterObj.programType.toLowerCase()) &&
        (!filterObj.scholarshipAvailable || hasScholarship)
      );
    });
    if (onFiltered) onFiltered(filtered);
  };

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    applyFilters(allRecommendations, updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minRanking: 1,
      maxRanking: 500,
      minTuition: 0,
      maxTuition: 50000,
      country: "",
      scholarshipAvailable: false,
      programType: "",
      admissionChance: 0,
    };
    setFilters(resetFilters);
    applyFilters(allRecommendations, resetFilters);
  };

  return (
    <div className={`filters-panel ${isOpen ? "open" : ""}`}>
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="filters-content">
        {/* University Ranking Filter */}
        <div className="filter-group">
          <label>University Ranking</label>
          <div className="range-inputs">
            <input
              type="number"
              min="1"
              max="500"
              value={filters.minRanking}
              onChange={(e) => handleFilterChange("minRanking", parseInt(e.target.value))}
              placeholder="Min"
              className="range-input"
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              min="1"
              max="500"
              value={filters.maxRanking}
              onChange={(e) => handleFilterChange("maxRanking", parseInt(e.target.value))}
              placeholder="Max"
              className="range-input"
            />
          </div>
          <input
            type="range"
            min="1"
            max="500"
            value={filters.maxRanking}
            onChange={(e) => handleFilterChange("maxRanking", parseInt(e.target.value))}
            className="slider"
          />
        </div>

        {/* Tuition Fee Filter */}
        <div className="filter-group">
          <label>Annual Tuition Fee (€)</label>
          <div className="range-inputs">
            <input
              type="number"
              min="0"
              value={filters.minTuition}
              onChange={(e) => handleFilterChange("minTuition", parseInt(e.target.value))}
              placeholder="Min"
              className="range-input"
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              value={filters.maxTuition}
              onChange={(e) => handleFilterChange("maxTuition", parseInt(e.target.value))}
              placeholder="Max"
              className="range-input"
            />
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            value={filters.maxTuition}
            onChange={(e) => handleFilterChange("maxTuition", parseInt(e.target.value))}
            className="slider"
          />
        </div>

        {/* Country Filter */}
        <div className="filter-group">
          <label>Country</label>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="filter-select"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Program Type Filter */}
        <div className="filter-group">
          <label>Program Type</label>
          <select
            value={filters.programType}
            onChange={(e) => handleFilterChange("programType", e.target.value)}
            className="filter-select"
          >
            <option value="">All Programs</option>
            {programTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Chance Filter */}
        <div className="filter-group">
          <label>Minimum Admission Chance</label>
          <div className="slider-value-display">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.admissionChance}
              onChange={(e) => handleFilterChange("admissionChance", parseInt(e.target.value))}
              className="slider"
            />
            <span className="value-display">{filters.admissionChance}%</span>
          </div>
        </div>

        {/* Scholarship Filter */}
        <div className="filter-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.scholarshipAvailable}
              onChange={(e) => handleFilterChange("scholarshipAvailable", e.target.checked)}
            />
            <span>Show only with scholarships</span>
          </label>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="filters-actions">
        <button className="btn btn-secondary btn-block" onClick={handleReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
