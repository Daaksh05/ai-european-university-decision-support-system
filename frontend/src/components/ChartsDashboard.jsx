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

const ChartsDashboard = () => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profile = {
        gpa: parseFloat(sessionStorage.getItem("profileGPA")),
        ielts: parseFloat(sessionStorage.getItem("profileIELTS")),
        budget: parseFloat(sessionStorage.getItem("profileBudget")),
        country: sessionStorage.getItem("profileCountry"),
        field: sessionStorage.getItem("profileField"),
      };

      const res = await api.post("/recommend", profile);
      setUniversities(res.data.recommendations || []);
    };

    fetchData();
  }, []);

  // ---------------- COST vs RANKING ----------------
  const costVsRankingData = {
    labels: universities.map((u) => u.university),
    datasets: [
      {
        label: "Tuition Fee (€)",
        data: universities.map((u) => u.average_fees_eur),
        backgroundColor: "#7c3aed",
      },
    ],
  };

  // ---------------- ADMISSION PROBABILITY ----------------
  const admissionData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          universities.filter((u) => u.match_score >= 0.7).length,
          universities.filter((u) => u.match_score >= 0.4 && u.match_score < 0.7).length,
          universities.filter((u) => u.match_score < 0.4).length,
        ],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      },
    ],
  };

  // ---------------- ROI ----------------
  const roiData = {
    labels: universities.map((u) => u.university),
    datasets: [
      {
        label: "ROI %",
        data: universities.map(
          (u) => ((50000 - u.average_fees_eur) / u.average_fees_eur) * 100
        ),
        backgroundColor: "#38bdf8",
      },
    ],
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Analytics Dashboard</h2>

      <div style={{ marginBottom: "50px" }}>
        <h3>💸 Cost vs Ranking</h3>
        <Bar data={costVsRankingData} />
      </div>

      <div style={{ marginBottom: "50px", maxWidth: "400px" }}>
        <h3>🎯 Admission Probability</h3>
        <Pie data={admissionData} />
      </div>

      <div>
        <h3>📈 ROI Analysis</h3>
        <Bar data={roiData} />
      </div>
    </div>
  );
};

export default ChartsDashboard;
