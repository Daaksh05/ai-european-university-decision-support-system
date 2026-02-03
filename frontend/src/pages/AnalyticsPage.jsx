import React, { useState } from "react";
import ChartsDashboard from "../components/ChartsDashboard";
import CostAnalytics from "../components/CostAnalytics";
import CareerROIPredictor from "../components/CareerROIPredictor";
import "./AnalyticsPage.css";

function AnalyticsPage() {
  const [filters, setFilters] = useState({
    budget: sessionStorage.getItem("profileBudget") || 25000,
    country: sessionStorage.getItem("profileCountry") || "all",
    field: sessionStorage.getItem("profileField") || "Engineering",
    duration: 2,
    salary: 50000
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  return (
    <div className="analytics-page-wrapper">
      <aside className="analytics-sidebar">
        <h3>🎛️ Dashboard Controls</h3>

        <div className="filter-group">
          <label>Max Budget (€{Number(tempFilters.budget).toLocaleString()})</label>
          <input
            type="range"
            name="budget"
            min="0"
            max="50000"
            step="1000"
            value={tempFilters.budget}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Target Country</label>
          <select
            name="country"
            value={tempFilters.country}
            onChange={handleFilterChange}
            className="big-select"
          >
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
        </div>

        <div className="filter-group">
          <label>Field of Study</label>
          <select
            name="field"
            value={tempFilters.field}
            onChange={handleFilterChange}
            className="big-select"
          >
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

        <div className="filter-group">
          <label>Study Duration (Years)</label>
          <select
            name="duration"
            value={tempFilters.duration}
            onChange={handleFilterChange}
            className="big-select"
          >
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Expected Starting Salary (€{Number(tempFilters.salary).toLocaleString()})</label>
          <input
            type="range"
            name="salary"
            min="20000"
            max="120000"
            step="5000"
            value={tempFilters.salary}
            onChange={handleFilterChange}
          />
        </div>

        <button className="apply-filters-btn" onClick={applyFilters}>
          Update Dashboard 🚀
        </button>

        <div className="sync-note">
          <p>💡 Click update to refresh charts</p>
        </div>
      </aside>

      <main className="analytics-content">
        <div className="analytics-header">
          <h1>Interactive Analytics</h1>
          <p>Visualize ROI, admission chances, and costs across Europe</p>
        </div>

        <div className="analytics-grid">
          <section className="analytics-card">
            <ChartsDashboard filters={filters} />
          </section>

          <section className="analytics-card">
            <CostAnalytics filters={filters} />
          </section>

          <section className="analytics-card roi-predictor-section">
            <CareerROIPredictor
              field={filters.field}
              country={filters.country}
              expectedSalary={filters.salary}
              totalInvestment={(Number(filters.budget) * Number(filters.duration)) + (1000 * 12 * Number(filters.duration))}
            />
          </section>

        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;
