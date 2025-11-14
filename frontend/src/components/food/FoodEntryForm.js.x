import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { foodEntriesService } from '../../services/foodEntries';

const FoodEntryForm = ({ onSubmit, onCancel, editEntry = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    foodName: editEntry?.food_name || '',
    calories: editEntry?.calories || '',
    protein: editEntry?.protein || '',
    carbs: editEntry?.carbs || '',
    fats: editEntry?.fats || '',
    entryDate: editEntry?.entry_date || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const entryData = {
        ...formData,
        userId: user.id,
        calories: parseInt(formData.calories),
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0
      };

      let response;
      if (editEntry) {
        response = await foodEntriesService.update(editEntry.id, entryData);
      } else {
        response = await foodEntriesService.create(entryData);
      }
      
      onSubmit(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-entry-form">
      <h3>{editEntry ? 'Edit Food Entry' : 'Add Food Entry'}</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Food Name *</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Calories *</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Protein (g)</label>
            <input
              type="number"
              step="0.1"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>Carbs (g)</label>
            <input
              type="number"
              step="0.1"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>Fats (g)</label>
            <input
              type="number"
              step="0.1"
              name="fats"
              value={formData.fats}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="entryDate"
            value={formData.entryDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editEntry ? 'Update Entry' : 'Add Entry')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodEntryForm;