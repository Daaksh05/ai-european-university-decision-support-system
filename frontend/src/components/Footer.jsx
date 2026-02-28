import React from "react";
import "./Navigation.css";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#how-it-works">How It Works</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#docs">Documentation</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#linkedin">LinkedIn</a></li>
            <li><a href="#github">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 UniDecide. All rights reserved. | AI-Powered University Selection</p>
      </div>
    </footer>
  );
}
