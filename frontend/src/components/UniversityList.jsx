import React, { useState } from "react";
import BudgetPlanner from "./BudgetPlanner";

function UniversityList({ universities }) {
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  if (!universities || universities.length === 0) {
    return (
      <div className="result-box" style={{ marginTop: "25px", textAlign: "center" }}>
        <h4 style={{ fontSize: "18px", margin: "0 0 10px 0" }}>📚 Recommended Universities</h4>
        <p style={{ color: "#999" }}>No universities match your criteria. Try adjusting your filters.</p>
      </div>
    );
  }

  const selectedUni = selectedUniversity !== null ? universities[selectedUniversity] : null;

  return (
    <div className="result-box" style={{ marginTop: "25px" }}>
      <h4 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>📚 Recommended Universities</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: "15px 0" }}>
        {universities.map((u, index) => (
          <li
            key={index}
            style={{
              padding: "16px",
              marginBottom: "12px",
              background: selectedUniversity === index
                ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%)"
                : "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(79, 172, 254, 0.05) 100%)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: `2px solid ${selectedUniversity === index ? "rgba(102, 126, 234, 0.5)" : "rgba(102, 126, 234, 0.15)"}`,
              boxShadow: selectedUniversity === index ? "0 8px 20px rgba(102, 126, 234, 0.2)" : "none"
            }}
            onClick={() => setSelectedUniversity(selectedUniversity === index ? null : index)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#667eea", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  #{index + 1} University
                </div>
                <strong style={{
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "block",
                  marginBottom: "6px"
                }}>
                  {u.university || "Unknown University"}
                </strong>
              </div>
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                whiteSpace: "nowrap",
                textAlign: "center"
              }}>
                €{(u.average_fees_eur || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>📍</span>
              <span style={{ fontWeight: "500" }}>{u.country || "Unknown Country"}</span>
              {u.city && <span style={{ fontSize: "12px", color: "#999" }}>• {u.city}</span>}
            </div>
          </li>
        ))}
      </ul>

      {selectedUni && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(240, 147, 251, 0.08) 100%)",
          borderRadius: "12px",
          border: "2px solid rgba(102, 126, 234, 0.3)",
          animation: "slideIn 0.4s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h5 style={{
              margin: 0,
              fontSize: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              📖 University Details
            </h5>
            <button
              onClick={() => setSelectedUniversity(null)}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              ✕ Close
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px" }}>
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                University
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                {selectedUni.university}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Location
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                {selectedUni.city}, {selectedUni.country}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Program
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                {selectedUni.field || "N/A"}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                IELTS Requirement
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                Min: {selectedUni.min_ielts || "N/A"}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                GPA Requirement
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                Min: {selectedUni.min_gpa || "N/A"}
              </div>
            </div>


            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                Tuition Fee
              </div>
              <div style={{ fontWeight: "700", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                €{(selectedUni.average_fees_eur || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: "12px", background: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#999", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>
                World Ranking
              </div>
              <div style={{ fontWeight: "600", color: "#333" }}>
                #{selectedUni.ranking || "N/A"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "16px", padding: "12px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)", borderRadius: "8px", borderLeft: "3px solid #10b981", fontSize: "13px", color: "#047857" }}>
            ✅ This university matches your profile! Consider visiting their official website for admission details.
          </div>

          <div style={{ marginTop: "20px" }}>
            <h5 style={{ color: "#333", marginBottom: "10px" }}>📊 Financial Planning</h5>
            <BudgetPlanner university={selectedUni} onClose={() => setSelectedUniversity(null)} />
          </div>

          {selectedUni.course_url && (
            <a
              href={selectedUni.course_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "16px",
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)";
              }}
            >
              🔗 View Course Details & Apply Now
            </a>
          )}
        </div>
      )}

      <div style={{
        marginTop: "15px",
        padding: "12px",
        background: "linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%)",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#667eea",
        fontWeight: "500",
        textAlign: "center"
      }}>
        💡 Click on a university to view detailed information
      </div>
    </div>
  );
}

export default UniversityList;
