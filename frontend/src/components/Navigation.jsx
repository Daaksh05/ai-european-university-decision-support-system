import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            🎓 UniDecide
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
              <Link to="/ask-ai" className="nav-link" onClick={() => setMenuOpen(false)}>
                Ask AI
              </Link>
            </li>
            <li className="nav-item resume-builder-item">
              <Link to="/resume-builder" className="nav-link resume-builder-link" onClick={() => setMenuOpen(false)}>
                📄 Resume Builder
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
