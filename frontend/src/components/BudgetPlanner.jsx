import React, { useState, useEffect } from "react";
import api from "../services/api";

const BudgetPlanner = ({ university, onClose }) => {
    const [costData, setCostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState(2);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                setLoading(true);
                const res = await api.post("/cost-analysis", {
                    tuition_fee: university.average_fees_eur,
                    country: university.country,
                    duration_years: years
                });
                setCostData(res.data.cost_analysis);
            } catch (err) {
                console.error("Budget fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBudget();
    }, [university, years]);

    if (loading) return <div style={{ padding: "20px", textAlign: "center", color: "#667eea" }}>Calculating your budget...</div>;
    if (!costData) return <div style={{ color: "red" }}>Could not load budget data.</div>;

    return (
        <div style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid #eee",
            marginTop: "15px",
            animation: "fadeIn 0.3s ease"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h4 style={{ margin: 0, color: "#333", fontSize: "1.2rem" }}>💰 Budget Plan: {university.university}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#666" }}>Duration (Years):</label>
                    <select
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                        <option value={1}>1 Year</option>
                        <option value={2}>2 Years</option>
                        <option value={3}>3 Years</option>
                        <option value={4}>4 Years</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Living Cost Breakdown */}
                <div style={{ padding: "15px", background: "#f8faff", borderRadius: "10px" }}>
                    <h5 style={{ margin: "0 0 10px 0", color: "#667eea" }}>Monthly Living Costs</h5>
                    {Object.entries(costData.breakdown).map(([key, val]) => (
                        <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "5px 0", borderBottom: "1px solid #edf2f7" }}>
                            <span style={{ textTransform: "capitalize" }}>{key}</span>
                            <span style={{ fontWeight: "bold" }}>€{val}</span>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "10px", color: "#333", fontWeight: "700" }}>
                        <span>Total Monthly</span>
                        <span>€{costData.monthly_living_cost}</span>
                    </div>
                </div>

                {/* Total Summary */}
                <div style={{ padding: "15px", background: "#fff5f5", borderRadius: "10px" }}>
                    <h5 style={{ margin: "0 0 10px 0", color: "#e53e3e" }}>Total Project Budget</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "5px 0" }}>
                        <span>Total Tuition ({years}y)</span>
                        <span>€{costData.total_tuition.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "5px 0" }}>
                        <span>Total Living ({years}y)</span>
                        <span>€{costData.total_living_cost.toLocaleString()}</span>
                    </div>
                    <hr style={{ border: "0", borderTop: "1px solid #feb2b2", margin: "10px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", color: "#c53030", fontWeight: "800" }}>
                        <span>Grand Total</span>
                        <span>€{costData.total_combined_cost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "10px",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                }}
            >
                Close Budget Review
            </button>
        </div>
    );
};

export default BudgetPlanner;
