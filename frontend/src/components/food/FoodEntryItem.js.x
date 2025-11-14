import React from 'react';

const FoodEntryItem = ({ entry, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNutritionInfo = () => {
    const parts = [];
    if (entry.protein > 0) parts.push(`Protein: ${entry.protein}g`);
    if (entry.carbs > 0) parts.push(`Carbs: ${entry.carbs}g`);
    if (entry.fats > 0) parts.push(`Fats: ${entry.fats}g`);
    
    return parts.length > 0 ? parts.join(' • ') : 'No nutrition details';
  };

  return (
    <div className="food-entry-item">
      <div className="food-entry-info">
        <h4>{entry.food_name}</h4>
        <div className="food-entry-meta">
          <span>{formatDate(entry.entry_date)}</span>
          {getNutritionInfo() && <span> • {getNutritionInfo()}</span>}
        </div>
      </div>
      
      <div className="food-entry-details">
        <span className="food-entry-calories">{entry.calories} kcal</span>
        <div className="food-entry-actions">
          <button 
            className="btn-link"
            onClick={() => onEdit(entry)}
          >
            Edit
          </button>
          <button 
            className="btn-link"
            onClick={() => onDelete(entry.id)}
            style={{ color: '#dc3545' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodEntryItem;