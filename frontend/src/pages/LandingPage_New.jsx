import React from "react";
import { Link } from "react-router-dom";
import { WavyBackground } from "../components/ui/wavy-background";
import "./LandingPage_New.css";

function LandingPageNew() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <WavyBackground className="hero-content" containerClassName="hero-section">
        <h1 className="hero-title">
          Find Your Perfect University with AI
        </h1>
        <p className="hero-subtitle">
          Personalized guidance powered by artificial intelligence. Get recommendations tailored to your profile, budget, and dreams.
        </p>
        <div className="hero-cta">
          <Link to="/profile" className="cta-button primary">
            Start Your Journey
          </Link>
          <a href="#features" className="cta-button secondary">
            Learn More
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>500+</h3>
            <p>Universities</p>
          </div>
          <div className="stat">
            <h3>50+</h3>
            <p>Countries</p>
          </div>
          <div className="stat">
            <h3>10k+</h3>
            <p>Success Stories</p>
          </div>
        </div>
      </WavyBackground>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2>Why Choose UniDecide?</h2>
          <p className="section-subtitle">
            Everything you need to make the right university choice
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Matching</h3>
              <p>
                Our advanced algorithms analyze your profile and match you with the best universities based on your goals and preferences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Scholarship Finder</h3>
              <p>
                Discover thousands of scholarships and funding opportunities tailored to your profile and academic achievements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Cost Analysis</h3>
              <p>
                Get detailed cost breakdowns and ROI analysis for each university recommendation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI Assistant</h3>
              <p>
                Ask unlimited questions to our AI and get personalized answers about universities, applications, and more.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Real Analytics</h3>
              <p>
                View comprehensive dashboards with acceptance rates, cost comparisons, and ranking insights.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Filtering</h3>
              <p>
                Filter by country, budget, ranking, and more to find your ideal match in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="how-it-works-container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            4 simple steps to your dream university
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>
                Enter your academic credentials, IELTS score, budget, and preferences.
              </p>
              <Link to="/profile" className="step-link">
                Start Profile →
              </Link>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Get Recommendations</h3>
              <p>
                Our AI analyzes your profile and generates personalized university matches.
              </p>
              <Link to="/recommendations" className="step-link">
                View Recommendations →
              </Link>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Compare & Analyze</h3>
              <p>
                Use our dashboard to compare costs, rankings, and acceptance rates.
              </p>
              <Link to="/analytics" className="step-link">
                Open Analytics →
              </Link>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Find Scholarships</h3>
              <p>
                Discover financial aid and scholarship opportunities for your target universities.
              </p>
              <Link to="/scholarships" className="step-link">
                Find Scholarships →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Find Your Perfect University?</h2>
          <p>
            Join thousands of students who have successfully found their dream universities using UniDecide.
          </p>
          <Link to="/profile" className="cta-button large">
            Start Free Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPageNew;
