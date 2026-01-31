import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "./CostAnalytics.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../services/api";
import "./CostAnalytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const CostAnalytics = ({ filters }) => {
  const [allUniversities, setAllUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    gpa: null,
    ielts: null,
    budget: null
  });

  // Fetch user profile from sessionStorage
  useEffect(() => {
    const gpa = sessionStorage.getItem("profileGPA");
    const ielts = sessionStorage.getItem("profileIELTS");
    const budget = sessionStorage.getItem("profileBudget");

    setUserProfile({
      gpa: gpa ? parseFloat(gpa) : null,
      ielts: ielts ? parseFloat(ielts) : null,
      budget: budget ? parseFloat(budget) : null
    });
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.get("/universities");
        setAllUniversities(res.data.universities || []);
      } catch (err) {
        console.error("Cost analytics error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    let filtered = allUniversities;

    // Apply Profile-Based Eligibility Filters (GPA, IELTS)
    if (userProfile.gpa !== null) {
      filtered = filtered.filter(u => userProfile.gpa >= u.min_gpa);
    }
    if (userProfile.ielts !== null) {
      filtered = filtered.filter(u => userProfile.ielts >= u.min_ielts);
    }

    // Apply Budget Filter (use user profile budget if available, otherwise use filter budget)
    const budgetToUse = userProfile.budget || filters?.budget;
    if (budgetToUse) {
      filtered = filtered.filter(u => u.average_fees_eur <= Number(budgetToUse));
    }

    if (filters?.country && filters.country !== "all") {
      filtered = filtered.filter(u => u.country.toLowerCase() === filters.country.toLowerCase());
    }
    setFilteredUniversities(filtered.slice(0, 5));
  }, [allUniversities, filters, userProfile]);

  if (loading) return <p>Calculating interactive costs...</p>;
  if (!filteredUniversities.length) return null;

  // ---------------- BAR CHART (TOTAL PROJECT COST) ----------------
  const barData = {
    labels: filteredUniversities.map((u) => u.university),
    datasets: [
      {
        label: `Total Cost (${filters?.duration}y)`,
        data: filteredUniversities.map((u) => {
          const living = 1000 * 12 * filters.duration;
          return (u.average_fees_eur * filters.duration) + living;
        }),
        backgroundColor: "rgba(168, 85, 247, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `Total: €${context.parsed.y.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="cost-analytics-container">
      <div className="analytics-card-header">
        <h3>💰 Cost Simulation ({filters?.duration} Years)</h3>
        <p>Simulation includes estimated living costs (€1,000/mo)</p>
      </div>

      <div style={{ height: "400px", marginTop: "20px" }}>
        <Bar key={`cost-analytics-${JSON.stringify(filters)}`} data={barData} options={chartOptions} />
      </div>

      <div className="cost-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px" }}>
        {filteredUniversities.slice(0, 3).map((u, i) => {
          const living = 1000 * 12 * filters.duration;
          const total = (u.average_fees_eur * filters.duration) + living;
          return (
            <div key={i} style={{ padding: "20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>{u.university}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: "5px 0" }}>€{total.toLocaleString()}</div>
              <div style={{ fontSize: "0.75rem", color: "#10b981" }}>Est. Total Budget</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostAnalytics;