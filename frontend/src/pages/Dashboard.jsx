import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { mealService } from '../services/meals';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0
  });
  const [showMealForm, setShowMealForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  // حالة نموذج إضافة الوجبة
  const [mealForm, setMealForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal_type: 'lunch'
  });

  useEffect(() => {
    if (user) {
      loadTodayMeals();
    }
  }, [user]);

  const loadTodayMeals = async () => {
    try {
      const response = await mealService.getTodayMeals();
      if (response.data.success) {
        setMeals(response.data.meals);
        setTotals(response.data.totals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const response = await mealService.addMeal(mealForm);
      if (response.data.success) {
        setShowMealForm(false);
        setMealForm({
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          meal_type: 'lunch'
        });
        loadTodayMeals(); // إعادة تحميل الوجبات
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Failed to add meal. Please try again.');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        const response = await mealService.deleteMeal(mealId);
        if (response.data.success) {
          loadTodayMeals(); // إعادة تحميل الوجبات
        }
      } catch (error) {
        console.error('Error deleting meal:', error);
        alert('Failed to delete meal. Please try again.');
      }
    }
  };

  const remainingCalories = user ? (user.daily_calorie_goal - totals.total_calories) : 0;
  const progress = user ? (totals.total_calories / user.daily_calorie_goal) * 100 : 0;

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome back, {user.username}! 👋</h1>
        <p>Here's your daily summary</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="stats-grid">
        <div className="stat-card goal">
          <h3>Daily Goal</h3>
          <div className="stat-value">{user.daily_calorie_goal}</div>
          <div className="stat-label">calories</div>
        </div>

        <div className="stat-card consumed">
          <h3>Consumed Today</h3>
          <div className="stat-value">{totals.total_calories}</div>
          <div className="stat-label">calories</div>
        </div>

        <div className="stat-card remaining">
          <h3>Remaining</h3>
          <div className="stat-value">
            {remainingCalories > 0 ? remainingCalories : 0}
          </div>
          <div className="stat-label">calories</div>
        </div>

        <div className="stat-card bmi">
          <h3>BMI</h3>
          <div className="stat-value">
            {user.weight && user.height 
              ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
              : '--'
            }
          </div>
          <div className="stat-label">Body Mass Index</div>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="progress-section">
        <h3>Your Daily Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {progress.toFixed(1)}% of your daily goal ({totals.total_calories} / {user.daily_calorie_goal} calories)
        </div>
      </div>

      {/* قسم الوجبات */}
      <div className="meals-section">
        <div className="section-header">
          <h3>Today's Meals 🍽️</h3>
          <button 
            className="btn-primary"
            onClick={() => setShowMealForm(true)}
          >
            + Add Meal
          </button>
        </div>

        {meals.length === 0 ? (
          <div className="empty-state">
            <p>No meals added today. Start by adding your first meal!</p>
          </div>
        ) : (
          <div className="meals-list">
            {meals.map(meal => (
              <div key={meal.id} className="meal-card">
                <div className="meal-info">
                  <h4>{meal.name}</h4>
                  <span className="meal-type">{meal.meal_type}</span>
                </div>
                <div className="meal-nutrition">
                  <span className="calories">{meal.calories} cal</span>
                  {meal.protein > 0 && <span>P: {meal.protein}g</span>}
                  {meal.carbs > 0 && <span>C: {meal.carbs}g</span>}
                  {meal.fat > 0 && <span>F: {meal.fat}g</span>}
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteMeal(meal.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* إجمالي التغذية */}
        {meals.length > 0 && (
          <div className="nutrition-totals">
            <h4>Daily Totals</h4>
            <div className="totals-grid">
              <div className="total-item">
                <span>Calories:</span>
                <strong>{totals.total_calories || 0}</strong>
              </div>
              <div className="total-item">
                <span>Protein:</span>
                <strong>{totals.total_protein || 0}g</strong>
              </div>
              <div className="total-item">
                <span>Carbs:</span>
                <strong>{totals.total_carbs || 0}g</strong>
              </div>
              <div className="total-item">
                <span>Fat:</span>
                <strong>{totals.total_fat || 0}g</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نموذج إضافة وجبة */}
      {showMealForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Meal</h3>
              <button 
                className="close-btn"
                onClick={() => setShowMealForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddMeal} className="meal-form">
              <div className="form-group">
                <label>Meal Name *</label>
                <input
                  type="text"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                  placeholder="e.g., Chicken Salad"
                  required
                />
              </div>

              <div className="form-group">
                <label>Calories *</label>
                <input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                  placeholder="e.g., 350"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({...mealForm, protein: e.target.value})}
                    placeholder="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})}
                    placeholder="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({...mealForm, fat: e.target.value})}
                    placeholder="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Meal Type</label>
                <select
                  value={mealForm.meal_type}
                  onChange={(e) => setMealForm({...mealForm, meal_type: e.target.value})}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowMealForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* الإجراءات السريعة */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/profile" className="action-btn profile">
            🧑‍💼 Edit Profile
          </Link>
          <button 
            className="action-btn add-meal"
            onClick={() => setShowMealForm(true)}
          >
            ➕ Add Meal
          </button>
          <button className="action-btn reports">
            📈 Weekly Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
