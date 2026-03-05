import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navigation.css";

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            🇪🇺 EuroPath <span className="logo-accent">AI</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation Links */}
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                Find Universities
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recommendations" className="nav-link" onClick={() => setMenuOpen(false)}>
                Recommendations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/analytics" className="nav-link" onClick={() => setMenuOpen(false)}>
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/scholarships" className="nav-link" onClick={() => setMenuOpen(false)}>
                Scholarships
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/relocation" className="nav-link" onClick={() => setMenuOpen(false)}>
                Relocation
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ask-ai" className="nav-link" onClick={() => setMenuOpen(false)}>
                Ask AI
              </Link>
            </li>
            <li className="nav-item resume-builder-item">
              <Link to="/resume-builder" className="nav-link resume-builder-link" onClick={() => setMenuOpen(false)}>
                📄 Resume Builder
              </Link>
            </li>

            {/* Auth Section */}
            {!user ? (
              <>
                <li className="nav-item auth-item">
                  <Link to="/login" className="nav-link login-btn" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item auth-item">
                  <Link to="/register" className="nav-link register-btn" onClick={() => setMenuOpen(false)}>
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item auth-item user-profile-item">
                <span className="user-name">Hi, {user.full_name || user.username}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
