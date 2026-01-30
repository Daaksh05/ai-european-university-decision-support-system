import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartsDashboard = ({ filters }) => {
  const [allUniversities, setAllUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [focusedUni, setFocusedUni] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/universities");
        setAllUniversities(res.data.universities || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allUniversities;

    // Apply Budget Filter
    if (filters?.budget) {
      filtered = filtered.filter(u => u.average_fees_eur <= Number(filters.budget));
    }

    // Apply Country Filter
    if (filters?.country && filters.country !== "all") {
      filtered = filtered.filter(u => u.country.toLowerCase() === filters.country.toLowerCase());
    }

    setFilteredUniversities(filtered.slice(0, 8)); // Limit to top 8 for readability
  }, [allUniversities, filters]);

  // ---------------- COST vs RANKING ----------------
  const costVsRankingData = {
    labels: filteredUniversities.map((u) => u.university),
    datasets: [
      {
        label: "Tuition Fee (€)",
        data: filteredUniversities.map((u) => u.average_fees_eur),
        backgroundColor: filteredUniversities.map(u =>
          u.university === focusedUni ? "#f43f5e" : "#6366f1"
        ),
        borderRadius: 8,
      },
    ],
  };

  // ---------------- ADMISSION PROBABILITY ----------------
  const admissionData = {
    labels: ["High Chance", "Medium Chance", "Low Chance"],
    datasets: [
      {
        data: [
          filteredUniversities.filter((u) => u.min_gpa <= 3.0).length,
          filteredUniversities.filter((u) => u.min_gpa > 3.0 && u.min_gpa <= 3.5).length,
          filteredUniversities.filter((u) => u.min_gpa > 3.5).length,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        hoverOffset: 20
      },
    ],
  };

  // ---------------- ROI (DYNAMIC SALARY) ----------------
  const roiData = {
    labels: filteredUniversities.map((u) => u.university),
    datasets: [
      {
        label: "Projected 5yr ROI %",
        data: filteredUniversities.map(
          (u) => {
            const fiveYrSalary = Number(filters?.salary || 50000) * 5;
            const totalCost = (u.average_fees_eur * filters?.duration) + (1000 * 12 * filters?.duration);
            return ((fiveYrSalary - totalCost) / totalCost) * 100;
          }
        ),
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    onClick: (evt, element) => {
      if (element.length > 0) {
        const index = element[0].index;
        setFocusedUni(filteredUniversities[index].university);
      } else {
        setFocusedUni(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        callbacks: {
          label: (context) => `Value: ${context.parsed.y.toLocaleString()}${context.dataset.label.includes("%") ? "%" : "€"}`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  if (filteredUniversities.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>🚫 No universities match these filters. Try increasing your budget!</div>;
  }

  return (
    <div className="charts-dashboard-container">
      <div className="chart-item">
        <div className="chart-header">
          <h3>💰 Cost vs University</h3>
          <p>Highlight: {focusedUni || "None"}</p>
        </div>
        <div style={{ height: "300px" }}>
          <Bar data={costVsRankingData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-item half">
          <h3>📈 Projected ROI Analysis</h3>
          <div style={{ height: "300px" }}>
            <Bar data={roiData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-item half">
          <h3>🎯 Admission Overview</h3>
          <div style={{ height: "300px" }}>
            <Pie data={admissionData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: true, position: "bottom" } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsDashboard;
