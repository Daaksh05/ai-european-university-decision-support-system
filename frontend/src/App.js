import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LandingPageNew from "./pages/LandingPage_New";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import AskAIPage from "./pages/AskAIPage";
import ResumeBuilderHome from "./pages/ResumeBuilderHome";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import SOPAssistantPage from "./pages/SOPAssistantPage";
import VisaTrackerPage from "./pages/VisaTrackerPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPageNew />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/ask-ai" element={<AskAIPage />} />
            {/* Resume Builder Routes - Independent Module */}
            <Route path="/resume-builder" element={<ResumeBuilderHome />} />
            <Route path="/resume-builder/:resumeId" element={<ResumeBuilderPage />} />
            <Route path="/sop-assistant" element={<SOPAssistantPage />} />
            <Route path="/visa-tracker" element={<VisaTrackerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
