import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/ChartsDashboard.css";

const ChartsDashboard = () => {
  const [activeChart, setActiveChart] = useState("cost-vs-ranking");
  const [recommendations, setRecommendations] = useState([]);
  const [roiData, setRoiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Fetch recommendations on load
  // ===============================
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const gpa = sessionStorage.getItem("profileGPA")
          ? parseFloat(sessionStorage.getItem("profileGPA"))
          : 3.5;
        const ielts = sessionStorage.getItem("profileIELTS")
          ? parseFloat(sessionStorage.getItem("profileIELTS"))
          : 6.5;
        const budget = sessionStorage.getItem("profileBudget")
          ? parseFloat(sessionStorage.getItem("profileBudget"))
          : 20000;
        const country = sessionStorage.getItem("profileCountry") || "";
        const field = sessionStorage.getItem("profileField") || "";

        const response = await api.post("/recommend", {
          gpa,
          ielts,
          budget,
          country,
          field,
        });

        if (response.data && response.data.status === "success") {
          const recs = response.data.recommendations || [];
          setRecommendations(recs);
          calculateROI(recs);
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // ===============================
  // ROI calculation
  // ===============================
  const calculateROI = (universities) => {
    const data = universities.slice(0, 8).map((uni) => {
      const tuition = uni.average_fees_eur || 0;
      const expectedSalary = 50000;

      return {
        name: (uni.university || uni.name || "Unknown").substring(0, 15),
        tuitionFee: tuition,
        expectedSalary,
        roi:
          tuition > 0
            ? ((expectedSalary - tuition) / tuition) * 100
            : 0,
        timeToBreakeven: tuition > 0 ? Math.ceil(tuition / 2500) : 0,
      };
    });

    setRoiData(data);
  };

  // ===============================
  // Chart data generators
  // ===============================
  const generateCostVsRankingData = () => {
    if (!recommendations.length) return [];
    return recommendations.slice(0, 10).map((uni) => ({
      name: (uni.university || uni.name || "Unknown").substring(0, 15),
      cost: uni.average_fees_eur || 0,
      ranking: uni.ranking || 500,
      matchPercentage: (uni.match_score || 0) * 100,
    }));
  };

  const generateAcceptanceProbabilityData = () => {
    if (!recommendations.length) return [];

    const gpa = sessionStorage.getItem("profileGPA")
      ? parseFloat(sessionStorage.getItem("profileGPA"))
      : 3.5;

    return recommendations.slice(0, 8).map((uni) => {
      const probability = Math.min(95, Math.max(20, (gpa / 4) * 100));
      return {
        name: (uni.university || uni.name || "Unknown").substring(0, 15),
        probability,
        chance:
          probability > 70 ? "High" : probability > 40 ? "Medium" : "Low",
      };
    });
  };

  const generateRoiData = () => roiData;

  // ===============================
  // UI
  // ===============================
  return (
    <div className="charts-dashboard">
      <h2>Analytics Dashboard</h2>

      {loading && <p>Loading analytics...</p>}

      {!loading && recommendations.length === 0 && (
        <p>No recommendations available for analytics.</p>
      )}

      {!loading && recommendations.length > 0 && (
        <>
          <div className="chart-tabs">
            <button onClick={() => setActiveChart("cost-vs-ranking")}>
              Cost vs Ranking
            </button>
            <button onClick={() => setActiveChart("acceptance")}>
              Admission Probability
            </button>
            <button onClick={() => setActiveChart("roi")}>ROI Analysis</button>
          </div>

          <div className="chart-content">
            {activeChart === "cost-vs-ranking" &&
              generateCostVsRankingData().map((item, idx) => (
                <div key={idx}>
                  {item.name} — €{item.cost} — Rank {item.ranking}
                </div>
              ))}

            {activeChart === "acceptance" &&
              generateAcceptanceProbabilityData().map((item, idx) => (
                <div key={idx}>
                  {item.name} — {item.probability}% ({item.chance})
                </div>
              ))}

            {activeChart === "roi" &&
              generateRoiData().map((item, idx) => (
                <div key={idx}>
                  {item.name} — ROI {item.roi.toFixed(2)}% — Breakeven{" "}
                  {item.timeToBreakeven} yrs
                </div>
              ))}
          </div>

          <div className="dashboard-actions">
            <button
              className="btn btn-secondary"
              onClick={() =>
                alert(
                  "📋 PDF generation not yet available.\n\nBackend support required.\nAdd /generate-pdf endpoint."
                )
              }
            >
              📥 Download Full Report (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartsDashboard;
