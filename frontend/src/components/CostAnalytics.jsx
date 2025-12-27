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

const CostAnalytics = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const gpa = parseFloat(sessionStorage.getItem("profileGPA")) || 3.0;
        const ielts = parseFloat(sessionStorage.getItem("profileIELTS")) || 6.5;
        const budget = parseFloat(sessionStorage.getItem("profileBudget")) || 20000;
        const country = sessionStorage.getItem("profileCountry") || "";
        const field = sessionStorage.getItem("profileField") || "";

        const res = await api.post("/recommend", {
          gpa,
          ielts,
          budget,
          country,
          field,
        });

        if (res.data?.recommendations) {
          setUniversities(res.data.recommendations.slice(0, 6));
        }
      } catch (err) {
        console.error("Cost analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <p style={{ color: "#fff" }}>Loading cost analytics…</p>;
  }

  if (!universities.length) {
    return <p style={{ color: "#fff" }}>No data available</p>;
  }

  // ---------------- BAR CHART (TUITION FEE) ----------------
  const barData = {
    labels: universities.map((u) => u.university),
    datasets: [
      {
        label: "Annual Tuition Fee (€)",
        data: universities.map((u) => u.average_fees_eur),
        backgroundColor: "rgba(99,102,241,0.7)",
      },
    ],
  };

  // ---------------- PIE CHART (COST SHARE) ----------------
  const pieData = {
    labels: universities.map((u) => u.university),
    datasets: [
      {
        data: universities.map((u) => u.average_fees_eur),
        backgroundColor: [
          "#6366f1",
          "#ec4899",
          "#22c55e",
          "#f59e0b",
          "#0ea5e9",
          "#a855f7",
        ],
      },
    ],
  };

  return (
    <div className="cost-analytics">
      <h3>💰 Cost Analytics</h3>

      <div className="chart-box">
        <h4>Annual Tuition Fee Comparison</h4>
        <Bar data={barData} />
      </div>

      <div className="chart-box">
        <h4>Cost Distribution (Pie Chart)</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default CostAnalytics;