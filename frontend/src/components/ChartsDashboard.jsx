import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/ChartsDashboard.css";

const ChartsDashboard = ({ universities, studentProfile }) => {
  const [activeChart, setActiveChart] = useState("cost-vs-ranking");
  const [recommendations, setRecommendations] = useState([]);
  const [roiData, setRoiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const gpa = sessionStorage.getItem("profileGPA") ? parseFloat(sessionStorage.getItem("profileGPA")) : 3.5;
        const ielts = sessionStorage.getItem("profileIELTS") ? parseFloat(sessionStorage.getItem("profileIELTS")) : 6.5;
        const budget = sessionStorage.getItem("profileBudget") ? parseFloat(sessionStorage.getItem("profileBudget")) : 20000;
        const country = sessionStorage.getItem("profileCountry") || "";
        const field = sessionStorage.getItem("profileField") || "";

        const response = await api.post("/recommend", { gpa, ielts, budget, country, field });
        if (response.data.status === "success" && response.data.recommendations) {
          setRecommendations(response.data.recommendations);
          calculateROI(response.data.recommendations);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Calculate ROI for each university
  const calculateROI = (universities) => {
    const roiCalculations = universities.slice(0, 8).map((uni) => ({
      name: (uni.university || uni.name || "Unknown").substring(0, 15),
      tuitionFee: uni.average_fees_eur || 0,
      expectedSalary: 50000,
      roi: ((50000 - (uni.average_fees_eur || 0)) / (uni.average_fees_eur || 1)) * 100,
      timeToBreakeven: Math.ceil((uni.average_fees_eur || 20000) / (50000 / 40)),
    }));
    setRoiData(roiCalculations);
  };

  // Real chart data from recommendations
  const generateCostVsRankingData = () => {
    if (!recommendations || !Array.isArray(recommendations)) return [];
    return recommendations.slice(0, 10).map((uni) => ({
      name: (uni.university || uni.name || "Unknown").substring(0, 15),
      cost: uni.average_fees_eur || 0,
      ranking: uni.ranking || 500,
      matchPercentage: (uni.match_score || 0) * 100,
    }));
  };

  const generateAcceptanceProbabilityData = () => {
    if (!recommendations || !Array.isArray(recommendations)) return [];
    const gpa = sessionStorage.getItem("profileGPA") ? parseFloat(sessionStorage.getItem("profileGPA")) : 3.5;
    return recommendations.slice(0, 8).map((uni) => {
      const acceptanceProbability = Math.min(95, Math.max(20, (gpa / 4) * 100));
      return {
        name: (uni.university || uni.name || "Unknown").substring(0, 15),
        probability: acceptanceProbability,
        chance: acceptanceProbability > 70 ? "High" : acceptanceProbability > 40 ? "Medium" : "Low",
      };
    });
  };

  const generateRoiData = () => {
    return roiData;
  };

  const costVsRankingData = generateCostVsRankingData();
  const acceptanceProbabilityData = generateAcceptanceProbabilityData();
  const roiData = generateRoiData();

  // Simple bar chart component
  const BarChart = ({ data, valueKey, maxValue = 100 }) => (
    <div className="bar-chart">
      {data.map((item, idx) => (
        <div key={idx} className="bar-item">
          <div className="bar-label">{item.name}</div>
          <div className="bar-container">
            <div
              className="bar-fill"
              style={{
                width: `${(item[valueKey] / maxValue) * 100}%`,
              }}
            >
              <span className="bar-value">{Math.round(item[valueKey])}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Simple scatter-like chart for cost vs ranking
  const ScatterChart = ({ data }) => (
    <div className="scatter-chart">
      <div className="chart-axes">
        <div className="y-axis-label">Cost (€)</div>
        <div className="x-axis-label">Ranking</div>
      </div>
      <div className="scatter-points">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="scatter-point"
            style={{
              left: `${(item.ranking / 500) * 90}%`,
              bottom: `${(item.cost / 50000) * 90}%`,
              backgroundColor: `hsl(${item.matchPercentage * 3.6}, 70%, 50%)`,
            }}
            title={`${item.name}: Rank ${item.ranking}, Cost €${item.cost.toFixed(0)}, Match ${item.matchPercentage.toFixed(0)}%`}
          >
            <div className="point-label">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="charts-dashboard">
      <div className="dashboard-header">
        <h2>Analytics & Insights</h2>
        <p>Data-driven visualization of your university options</p>
      </div>

      {/* Metric Cards Row */}
      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-title">Avg Tuition</div>
          <div className="metric-value">€{(costVsRankingData.length ? Math.round(costVsRankingData.reduce((s,d)=>s+d.cost,0)/costVsRankingData.length) : '—')}</div>
        </div>

        <div className="metric-card" style={{background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(196,181,253,0.04))'}}>
          <div className="metric-title">Avg Ranking</div>
          <div className="metric-value">{(costVsRankingData.length ? Math.round(costVsRankingData.reduce((s,d)=>s+d.ranking,0)/costVsRankingData.length) : '—')}</div>
        </div>

        <div className="metric-card" style={{background: 'linear-gradient(135deg, rgba(34,211,238,0.06), rgba(232,121,249,0.04))'}}>
          <div className="metric-title">Top Match</div>
          <div className="metric-value">{costVsRankingData[0]?.name ?? '—'}</div>
        </div>
      </div>

      {/* Chart Selector Tabs */}
      <div className="chart-tabs">
        <button
          className={`tab ${activeChart === "cost-vs-ranking" ? "active" : ""}`}
          onClick={() => setActiveChart("cost-vs-ranking")}
        >
          💰 Cost vs Ranking
        </button>
        <button
          className={`tab ${activeChart === "acceptance" ? "active" : ""}`}
          onClick={() => setActiveChart("acceptance")}
        >
          📊 Acceptance Probability
        </button>
        <button
          className={`tab ${activeChart === "roi" ? "active" : ""}`}
          onClick={() => setActiveChart("roi")}
        >
          📈 ROI Analysis
        </button>
      </div>

      {/* Chart Content */}
      <div className="chart-container">
        {activeChart === "cost-vs-ranking" && (
          <div className="chart-view">
            <h3>Cost vs University Ranking</h3>
            <p className="chart-description">
              Compare tuition costs against university rankings. Each point represents a university.
              Hover to see details.
            </p>
            <ScatterChart data={costVsRankingData} />
          </div>
        )}

        {activeChart === "acceptance" && (
          <div className="chart-view">
            <h3>Your Acceptance Probability</h3>
            <p className="chart-description">
              Estimated likelihood of admission to each university based on your profile.
            </p>
            <BarChart
              data={acceptanceProbabilityData}
              valueKey="probability"
              maxValue={100}
            />
          </div>
        )}

        {activeChart === "roi" && (
          <div className="chart-view">
            <h3>Return on Investment (ROI)</h3>
            <p className="chart-description">
              Projected ROI percentage based on average graduate salaries and program costs.
            </p>
            <BarChart data={roiData} valueKey="roi" maxValue={300} />
            <div className="roi-legend">
              <p>💡 ROI = (Avg Salary - Total Cost) / Total Cost × 100</p>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="insights-section">
        <h4>📌 Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">🎯</span>
            <p>Most Affordable: {costVsRankingData[0]?.name} (€{Math.min(...costVsRankingData.map(d => d.cost)).toFixed(0)})</p>
          </div>
          <div className="insight-card">
            <span className="insight-icon">🏆</span>
            <p>Highest Ranked: University #{Math.min(...costVsRankingData.map(d => d.ranking))}</p>
          </div>
          <div className="insight-card">
            <span className="insight-icon">💹</span>
            <p>Best ROI: {roiData[0]?.name} ({roiData[0]?.roi.toFixed(0)}%)</p>
          </div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="dashboard-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => {
            alert("📋 PDF generation not yet available. Backend support needed.\n\nTo enable: Add a /generate-pdf endpoint to backend that combines recommendations, cost analysis, and ROI data.");
          }}
        >
          📥 Download Full Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default ChartsDashboard;
