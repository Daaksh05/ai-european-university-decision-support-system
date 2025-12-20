import React from "react";
import StudentProfileForm from "../components/StudentProfileForm";
import QueryBox from "../components/QueryBox";
import ScholarshipsMatcher from "../components/ScholarshipsMatcher";
import CostAnalytics from "../components/CostAnalytics";

function Home() {
  return (
    <div className="container">
      <h2>🎓 AI University Decision Support System</h2>
      <p style={{ textAlign: "center", color: "#666", fontSize: "15px", marginBottom: "30px", fontWeight: "500" }}>
        ✨ Personalized guidance for international university selection
      </p>

      <StudentProfileForm />

      <hr style={{ margin: "35px 0" }} />

      <CostAnalytics />

      <hr style={{ margin: "35px 0" }} />

      <ScholarshipsMatcher />

      <hr style={{ margin: "35px 0" }} />

      <QueryBox />
    </div>
  );
}

export default Home;
