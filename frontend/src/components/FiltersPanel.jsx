import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import "../styles/FiltersPanel.css";

const FiltersPanel = ({ onFiltered, isOpen, onClose }) => {
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

  const countries = ["Germany", "Netherlands", "UK", "Sweden", "France", "Switzerland"];
  const programTypes = ["Engineering", "Business", "Medicine", "Law", "Science", "Arts"];

  // ---------- APPLY FILTERS ----------
  const applyFilters = useCallback((universities, filterObj) => {
    const filtered = universities.filter((u) => {
      const ranking = u.ranking || 999;
      const tuition = u.average_fees_eur || 0;
      const country = u.country || "";
      const program = u.field || "";
      const hasScholarship = u.scholarships && u.scholarships.length > 0;
      const chancePercent = Math.round((u.match_score || 0) * 100);

      return (
        ranking >= filterObj.minRanking &&
        ranking <= filterObj.maxRanking &&
        tuition >= filterObj.minTuition &&
        tuition <= filterObj.maxTuition &&
        (!filterObj.country || country.toLowerCase() === filterObj.country.toLowerCase()) &&
        (!filterObj.programType || program.toLowerCase() === filterObj.programType.toLowerCase()) &&
        (!filterObj.scholarshipAvailable || hasScholarship) &&
        chancePercent >= filterObj.admissionChance
      );
    });

    if (onFiltered) onFiltered(filtered);
  }, [onFiltered]);

  // ---------- FETCH RECOMMENDATIONS ----------
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.post("/recommend", {
          gpa: sessionStorage.getItem("profileGPA")
            ? parseFloat(sessionStorage.getItem("profileGPA"))
            : 3.5,
          ielts: sessionStorage.getItem("profileIELTS")
            ? parseFloat(sessionStorage.getItem("profileIELTS"))
            : 6.5,
          budget: sessionStorage.getItem("profileBudget")
            ? parseFloat(sessionStorage.getItem("profileBudget"))
            : 20000,
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
      }
    };

    fetchRecommendations();
  }, [applyFilters, filters]);

  // ---------- HANDLE FILTER CHANGE ----------
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    applyFilters(allRecommendations, updatedFilters);
  };

  // ---------- RESET ----------
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
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="filters-content">

        {/* Ranking */}
        <div className="filter-group">
          <label>University Ranking</label>
          <input
            type="range"
            min="1"
            max="500"
            value={filters.maxRanking}
            onChange={(e) => handleFilterChange("maxRanking", parseInt(e.target.value))}
            className="slider"
          />
          <span>Up to Rank {filters.maxRanking}</span>
        </div>

        {/* Tuition */}
        <div className="filter-group">
          <label>Max Tuition (€)</label>
          <input
            type="range"
            min="0"
            max="100000"
            value={filters.maxTuition}
            onChange={(e) => handleFilterChange("maxTuition", parseInt(e.target.value))}
            className="slider"
          />
          <span>€{filters.maxTuition}</span>
        </div>

        {/* Country */}
        <div className="filter-group">
          <label>Country</label>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Program */}
        <div className="filter-group">
          <label>Program Type</label>
          <select
            value={filters.programType}
            onChange={(e) => handleFilterChange("programType", e.target.value)}
          >
            <option value="">All Programs</option>
            {programTypes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Admission Chance */}
        <div className="filter-group">
          <label>Minimum Admission Chance</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.admissionChance}
            onChange={(e) => handleFilterChange("admissionChance", parseInt(e.target.value))}
            className="slider"
          />
          <span>{filters.admissionChance}%</span>
        </div>

        {/* Scholarship */}
        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filters.scholarshipAvailable}
              onChange={(e) =>
                handleFilterChange("scholarshipAvailable", e.target.checked)
              }
            />
            Only universities with scholarships
          </label>
        </div>
      </div>

      <div className="filters-actions">
        <button className="btn btn-secondary btn-block" onClick={handleReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
