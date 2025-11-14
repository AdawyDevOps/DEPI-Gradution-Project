import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="home-hero">
        <div className="container">
          <h1>Track Your Nutrition Journey</h1>
          <p>Monitor your daily calorie intake, set goals, and achieve your health objectives with Calorie Chronicle.</p>
          {!isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#2c3e50' }}>
            Why Choose Calorie Chronicle?
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📊 Easy Tracking</h3>
              <p>Log your meals and snacks with our simple interface. Track calories and macronutrients effortlessly.</p>
            </div>
            <div className="feature-card">
              <h3>🎯 Goal Setting</h3>
              <p>Set daily calorie goals and monitor your progress. Stay motivated with visual progress tracking.</p>
            </div>
            <div className="feature-card">
              <h3>📈 Progress Insights</h3>
              <p>Get detailed insights into your eating habits and nutritional patterns over time.</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Privacy First</h3>
              <p>Your data is secure and private. We never share your personal information with third parties.</p>
            </div>
            <div className="feature-card">
              <h3>📱 Always Accessible</h3>
              <p>Access your food diary from any device. Your data syncs automatically across all platforms.</p>
            </div>
            <div className="feature-card">
              <h3>🎨 Simple & Clean</h3>
              <p>Enjoy a clutter-free interface that focuses on what matters - your health journey.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;