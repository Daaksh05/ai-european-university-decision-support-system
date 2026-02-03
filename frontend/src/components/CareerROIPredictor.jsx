import React, { useState, useEffect } from "react";
import api from "../services/api";

const CareerROIPredictor = ({ field, country, totalInvestment, expectedSalary }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrediction = async () => {
            if (!field || !country || !totalInvestment) return;

            setLoading(true);
            try {
                const res = await api.post("/predict-roi", {
                    field,
                    country,
                    total_investment: Number(totalInvestment),
                    expected_salary: Number(expectedSalary)
                });
                if (res.data.status === "success") {
                    setPrediction(res.data.roi_prediction);
                }
            } catch (err) {
                console.error("Error fetching ROI prediction:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [field, country, totalInvestment, expectedSalary]);

    if (loading) return <div className="roi-loading">Calculating Career ROI...</div>;
    if (!prediction) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return "#10b981"; // Excellent
        if (score >= 60) return "#f59e0b"; // Good
        return "#ef4444"; // Low
    };

    return (
        <div className="roi-predictor-card">
            <div className="roi-header">
                <span className="roi-icon">💼</span>
                <h3>Career ROI Predictor</h3>
            </div>

            <div className="roi-stats-grid">
                <div className="roi-stat">
                    <label>Starting Salary</label>
                    <div className="roi-value">€{prediction.estimated_starting_salary.toLocaleString()}</div>
                    <span className="roi-unit">per year</span>
                </div>

                <div className="roi-stat">
                    <label>Break-even Time</label>
                    <div className="roi-value">{prediction.break_even_years} years</div>
                    <span className="roi-unit">to recover costs</span>
                </div>
            </div>

            <div className="roi-meter-container">
                <div className="roi-meter-label">
                    <span>Investment Recovery Score</span>
                    <span style={{ color: getScoreColor(prediction.roi_score) }}>{prediction.roi_score}%</span>
                </div>
                <div className="roi-meter-bg">
                    <div
                        className="roi-meter-fill"
                        style={{
                            width: `${prediction.roi_score}%`,
                            backgroundColor: getScoreColor(prediction.roi_score)
                        }}
                    ></div>
                </div>
            </div>

            <p className="roi-explanation">{prediction.explanation}</p>

            <div className="roi-disclaimer">
                *Projections based on industry averages and standard tax rates.
            </div>
        </div>
    );
};

export default CareerROIPredictor;
