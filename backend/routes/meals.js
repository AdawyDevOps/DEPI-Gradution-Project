const express = require('express');
const jwt = require('jsonwebtoken');
const Meal = require('../models/Meal');
const router = express.Router();

// إضافة وجبة جديدة
router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    const { name, calories, protein, carbs, fat, meal_type, date } = req.body;

    if (!name || !calories) {
      return res.status(400).json({ 
        success: false,
        error: 'Meal name and calories are required' 
      });
    }

    Meal.create({
      user_id: decoded.userId,
      name,
      calories: parseInt(calories),
      protein: protein ? parseFloat(protein) : 0,
      carbs: carbs ? parseFloat(carbs) : 0,
      fat: fat ? parseFloat(fat) : 0,
      meal_type: meal_type || 'lunch',
      date: date || new Date().toISOString().split('T')[0]
    }, (err, meal) => {
      if (err) {
        console.error('❌ Error creating meal:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }

      res.status(201).json({
        success: true,
        message: 'Meal added successfully',
        meal
      });
    });

  } catch (error) {
    console.error('❌ Meal creation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// الحصول على وجبات اليوم
router.get('/today', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    const today = new Date().toISOString().split('T')[0];

    Meal.getByUserAndDate(decoded.userId, today, (err, meals) => {
      if (err) {
        console.error('❌ Error getting meals:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }

      Meal.getDailyTotal(decoded.userId, today, (err, totals) => {
        if (err) {
          console.error('❌ Error getting daily total:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
          });
        }

        res.json({
          success: true,
          meals: meals || [],
          totals: totals || {
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Get meals error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// الحصول على إحصائيات أسبوعية
router.get('/weekly', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    const startDate = req.query.startDate || new Date().toISOString().split('T')[0];

    Meal.getWeeklyStats(decoded.userId, startDate, (err, stats) => {
      if (err) {
        console.error('❌ Error getting weekly stats:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }

      res.json({
        success: true,
        stats: stats || []
      });
    });

  } catch (error) {
    console.error('❌ Get weekly stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// حذف وجبة
router.delete('/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    const mealId = req.params.id;

    Meal.delete(mealId, (err) => {
      if (err) {
        console.error('❌ Error deleting meal:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }

      res.json({
        success: true,
        message: 'Meal deleted successfully'
      });
    });

  } catch (error) {
    console.error('❌ Delete meal error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
