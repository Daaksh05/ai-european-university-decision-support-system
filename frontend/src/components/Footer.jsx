import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              🇪🇺 EuroPath <span className="logo-highlight">AI</span>
            </Link>
            <p className="brand-tagline">
              Your intelligent roadmap to European education and beyond.
              Empowering students with AI-driven insights.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">GitHub</a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-links-group">
            <h4>Product</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/recommendations">Recommendations</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
              <li><Link to="/scholarships">Scholarships</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-links-group">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/relocation">Relocation Guide</Link></li>
              <li><Link to="/visa-tracker">Visa Tracker</Link></li>
              <li><Link to="/sop-assistant">SOP Assistant</Link></li>
              <li><Link to="/ask-ai">Ask sidekick</Link></li>
              <li><a href="https://euro-uni-interview-prep.vercel.app" target="_blank" rel="noopener noreferrer">Interview Prep</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EuroPath AI. All rights reserved. | Built for Modern Students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
