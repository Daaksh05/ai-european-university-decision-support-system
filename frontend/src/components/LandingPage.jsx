import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🎓",
      title: "Smart Matching",
      description: "AI-powered university recommendations based on your profile",
    },
    {
      icon: "💰",
      title: "Cost Analysis",
      description: "Transparent tuition, scholarship, and ROI calculations",
    },
    {
      icon: "📊",
      title: "Admission Prediction",
      description: "Real-time eligibility assessment with success probabilities",
    },
    {
      icon: "🌍",
      title: "Global Universities",
      description: "Access to 500+ European universities and programs",
    },
  ];

  const testimonials = [
    {
      name: "Priya Kumar",
      role: "Engineering Student",
      text: "Found my perfect fit in 10 minutes. Saved me weeks of research!",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Business Major",
      text: "The scholarship matching feature saved me €15,000!",
      rating: 5,
    },
    {
      name: "Sofia Mendez",
      role: "Pre-law Student",
      text: "Transparent cost analysis helped me make confident decisions.",
      rating: 5,
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-content">
          <h1 className="hero-title">EuroPath AI: Your Path to Global Education</h1>
          <p className="hero-subtitle">
            The intelligent guide to Study, SOP, and Visa recommendations
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/home")}
            >
              Get Started Now
            </button>
            <button className="btn btn-secondary btn-large">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="animated-gradient"></div>
        </div>
      </section >

      {/* Features Section */}
      < section className="features-section" >
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card fade-in">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section >

      {/* Stats Section */}
      < section className="stats-section" >
        <div className="stat-box">
          <h3>500+</h3>
          <p>Universities</p>
        </div>
        <div className="stat-box">
          <h3>50K+</h3>
          <p>Students Helped</p>
        </div>
        <div className="stat-box">
          <h3>95%</h3>
          <p>Satisfaction Rate</p>
        </div>
        <div className="stat-box">
          <h3>40</h3>
          <p>Countries</p>
        </div>
      </section >

      {/* How It Works */}
      < section className="how-it-works" >
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Create Profile</h4>
            <p>Enter your academics, test scores, and preferences</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Get Analysis</h4>
            <p>Our AI analyzes your eligibility and preferences</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>See Matches</h4>
            <p>Discover universities perfectly matched to you</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Make Decision</h4>
            <p>Compare costs, scholarships, and ROI analysis</p>
          </div>
        </div>
      </section >

      {/* Testimonials */}
      < section className="testimonials-section" >
        <h2>What Students Say</h2>
        <div className="testimonials-tabs">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`testimonial-card ${activeTab === idx ? "active" : ""}`}
              onClick={() => setActiveTab(idx)}
            >
              <div className="stars">{"⭐".repeat(testimonial.rating)}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">{testimonial.name}</p>
              <p className="testimonial-role">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section >

      {/* CTA Section */}
      < section className="cta-section" >
        <h2>Ready to Find Your University?</h2>
        <p>Join thousands of students making informed decisions</p>
        <button
          className="btn btn-primary btn-large"
          onClick={() => navigate("/home")}
        >
          Start Your Journey Today
        </button>
      </section >

      {/* Footer */}
      < footer className="landing-footer" >
        <div className="footer-content">
          <div className="footer-section">
            <p>EuroPath AI: Intelligent Guide</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Recommendations</li>
              <li>Admission Prediction</li>
              <li>Cost Analysis</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className="footer-bottom">© 2025 EuroPath AI. All rights reserved.</p>
      </footer >
    </div >
  );
};

export default LandingPage;
