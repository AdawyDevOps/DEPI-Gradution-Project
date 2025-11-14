const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all food entries for user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const foodEntries = await pool.query(
      `SELECT * FROM food_entries 
       WHERE user_id = $1 
       ORDER BY entry_date DESC, created_at DESC`,
      [userId]
    );
    
    res.json(foodEntries.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new food entry
router.post('/', async (req, res) => {
  try {
    const { userId, foodName, calories, protein, carbs, fats, entryDate } = req.body;
    
    const newEntry = await pool.query(
      `INSERT INTO food_entries 
       (user_id, food_name, calories, protein, carbs, fats, entry_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, foodName, calories, protein, carbs, fats, entryDate]
    );
    
    res.status(201).json(newEntry.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update food entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { foodName, calories, protein, carbs, fats, entryDate } = req.body;
    
    const updatedEntry = await pool.query(
      `UPDATE food_entries 
       SET food_name = $1, calories = $2, protein = $3, carbs = $4, fats = $5, entry_date = $6 
       WHERE id = $7 RETURNING *`,
      [foodName, calories, protein, carbs, fats, entryDate, id]
    );
    
    if (updatedEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Food entry not found' });
    }
    
    res.json(updatedEntry.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete food entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEntry = await pool.query(
      'DELETE FROM food_entries WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (deletedEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Food entry not found' });
    }
    
    res.json({ message: 'Food entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;