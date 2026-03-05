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
import RelocationGuidePage from "./pages/RelocationGuidePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LandingPageNew />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
              <Route path="/ask-ai" element={<AskAIPage />} />
              {/* Resume Builder Routes - Independent Module */}
              <Route path="/resume-builder" element={<ResumeBuilderHome />} />
              <Route path="/resume-builder/:resumeId" element={<ResumeBuilderPage />} />
              <Route path="/sop-assistant" element={<SOPAssistantPage />} />
              <Route path="/visa-tracker" element={<VisaTrackerPage />} />
              <Route path="/relocation" element={<RelocationGuidePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
