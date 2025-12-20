import React, { useState } from "react";
import api from "../services/api";

function CostAnalytics() {
  const [tuitionFee, setTuitionFee] = useState("");
  const [country, setCountry] = useState("");
  const [years, setYears] = useState("2");
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const countries = ["France", "Germany", "Netherlands", "Belgium", "Italy", "Spain", "Finland", "Austria"];

  const calculateCost = async () => {
    if (!tuitionFee || !country) {
      setError("Please enter tuition fee and select a country");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/cost-analysis", {
        tuition_fee: parseFloat(tuitionFee),
        country: country,
        duration_years: parseInt(years)
      });

      if (res.data.status === "success") {
        setCostData(res.data.cost_analysis);
      } else {
        setError("Failed to calculate costs");
      }
    } catch (err) {
      setError("Error calculating costs");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTuitionFee("");
    setCountry("");
    setYears("2");
    setCostData(null);
    setError("");
  };

  return (
    <div>
      <h3>💰 Cost & Budget Analyzer</h3>

      {error && (
        <div style={{ 
          padding: "12px", 
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
          color: "#dc2626", 
          borderRadius: "10px", 
          marginBottom: "12px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          ⚠️ {error}
        </div>
      )}

      <input 
        type="number"
        placeholder="💵 Annual Tuition Fee (€)"
        value={tuitionFee}
        onChange={(e) => {
          setTuitionFee(e.target.value);
          setError("");
        }}
        min="0"
      />

      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          setError("");
        }}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          marginTop: "10px",
          borderRadius: "10px",
          border: "2px solid #e0e7ff",
          fontSize: "14px",
          background: "linear-gradient(135deg, #f5f7ff 0%, #f0f4ff 100%)",
          cursor: "pointer"
        }}
      >
        <option value="">Select Country...</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={years}
        onChange={(e) => setYears(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "2px solid #e0e7ff",
          fontSize: "14px",
          background: "linear-gradient(135deg, #f5f7ff 0%, #f0f4ff 100%)",
          cursor: "pointer"
        }}
      >
        <option value="1">1 Year</option>
        <option value="2">2 Years</option>
        <option value="3">3 Years</option>
        <option value="4">4 Years</option>
      </select>

      <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
        <button 
          onClick={calculateCost}
          disabled={loading}
          style={{ 
            flex: 1,
            background: loading ? "linear-gradient(135deg, #999, #777)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}
        >
          {loading ? "⏳ Calculating..." : "📊 Calculate"}
        </button>
        <button 
          onClick={clearForm}
          style={{ 
            flex: 1,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          }}
        >
          🔄 Clear
        </button>
      </div>

      {costData && (
        <div className="result-box" style={{ marginTop: "20px" }}>
          <h4 style={{ margin: "0 0 15px 0" }}>📈 Cost Breakdown</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Annual Tuition
              </div>
              <div style={{ fontWeight: "700", fontSize: "16px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                €{(costData.tuition_fee || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Monthly Living Cost
              </div>
              <div style={{ fontWeight: "700", fontSize: "16px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                €{(costData.monthly_living_cost || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Yearly Living Cost
              </div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "#333" }}>
                €{(costData.yearly_living_cost || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Cost Per Month
              </div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "#333" }}>
                €{(costData.total_cost_per_month || 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ 
            padding: "16px", 
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
            borderRadius: "10px",
            borderLeft: "4px solid #10b981",
            marginTop: "12px"
          }}>
            <strong style={{ color: "#047857", display: "block", marginBottom: "8px", fontSize: "15px" }}>
              💡 Total Cost for {years} Year(s)
            </strong>
            <div style={{ fontSize: "24px", fontWeight: "700", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              €{(costData.total_cost_2_years || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CostAnalytics;
