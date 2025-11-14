import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    daily_calorie_goal: '',
    weight: '',
    height: '',
    age: '',
    gender: 'male'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        daily_calorie_goal: user.daily_calorie_goal || '',
        weight: user.weight || '',
        height: user.height || '',
        age: user.age || '',
        gender: user.gender || 'male'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('✅ Your profile has been updated successfully!');
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMR = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
      return '--';
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    if (formData.gender === 'male') {
      return (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)).toFixed(0);
    } else {
      return (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)).toFixed(0);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Settings 🧑‍💼</h1>
        <p>Enter your personal information to calculate your daily needs accurately</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                className="disabled-field"
              />
              <small>Username cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="disabled-field"
              />
              <small>Email cannot be changed</small>
            </div>
          </div>

          <div className="form-section">
            <h3>Personal Data</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="200"
                  placeholder="70"
                />
              </div>

              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="120"
                  max="220"
                  placeholder="170"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="10"
                  max="100"
                  placeholder="25"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Daily Goals</h3>
            
            <div className="form-group">
              <label>Daily Calorie Goal</label>
              <input
                type="number"
                name="daily_calorie_goal"
                value={formData.daily_calorie_goal}
                onChange={handleChange}
                min="1000"
                max="5000"
                placeholder="2000"
                required
              />
              <small>Number of calories you aim to consume daily</small>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>

        <div className="profile-sidebar">
          <div className="info-card">
            <h3>Health Summary</h3>
            
            <div className="health-item">
              <span>Body Mass Index (BMI):</span>
              <strong>
                {formData.weight && formData.height 
                  ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
                  : '--'
                }
              </strong>
            </div>

            <div className="health-item">
              <span>Basal Metabolic Rate (BMR):</span>
              <strong>{calculateBMR()} calories/day</strong>
            </div>

            <div className="health-item">
              <span>Weight Status:</span>
              <strong>
                {formData.weight && formData.height 
                  ? (() => {
                      const bmi = formData.weight / ((formData.height / 100) ** 2);
                      if (bmi < 18.5) return 'Underweight';
                      if (bmi < 25) return 'Normal';
                      if (bmi < 30) return 'Overweight';
                      return 'Obese';
                    })()
                  : '--'
                }
              </strong>
            </div>
          </div>

          <div className="tips-card">
            <h3>Health Tips 💡</h3>
            <ul>
              <li>Drink at least 8 glasses of water daily</li>
              <li>Exercise for 30 minutes every day</li>
              <li>Eat balanced meals with all nutrients</li>
              <li>Get 7-8 hours of sleep daily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
