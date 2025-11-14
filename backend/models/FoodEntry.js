const { pool } = require('../config/database');

class FoodEntry {
  // Create new food entry
  static async create(entryData) {
    const { userId, foodName, calories, protein, carbs, fats, entryDate } = entryData;
    
    const result = await pool.query(
      `INSERT INTO food_entries 
       (user_id, food_name, calories, protein, carbs, fats, entry_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, foodName, calories, protein, carbs, fats, entryDate]
    );
    
    return result.rows[0];
  }

  // Find entry by ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT fe.*, u.username 
       FROM food_entries fe 
       JOIN users u ON fe.user_id = u.id 
       WHERE fe.id = $1`,
      [id]
    );
    
    return result.rows[0];
  }

  // Find all entries by user ID with pagination
  static async findByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      `SELECT * FROM food_entries 
       WHERE user_id = $1 
       ORDER BY entry_date DESC, created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    
    // Get total count for pagination
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM food_entries WHERE user_id = $1',
      [userId]
    );
    
    return {
      entries: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Find entries by date range
  static async findByDateRange(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM food_entries 
       WHERE user_id = $1 AND entry_date BETWEEN $2 AND $3 
       ORDER BY entry_date, created_at`,
      [userId, startDate, endDate]
    );
    
    return result.rows;
  }

  // Update food entry
  static async update(id, updateData) {
    const { foodName, calories, protein, carbs, fats, entryDate } = updateData;
    
    const result = await pool.query(
      `UPDATE food_entries 
       SET food_name = $1, calories = $2, protein = $3, carbs = $4, fats = $5, entry_date = $6 
       WHERE id = $7 RETURNING *`,
      [foodName, calories, protein, carbs, fats, entryDate, id]
    );
    
    return result.rows[0];
  }

  // Delete food entry
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM food_entries WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }

  // Get daily summary
  static async getDailySummary(userId, date) {
    const result = await pool.query(
      `SELECT 
         SUM(calories) as total_calories,
         SUM(protein) as total_protein,
         SUM(carbs) as total_carbs,
         SUM(fats) as total_fats,
         COUNT(*) as entry_count
       FROM food_entries 
       WHERE user_id = $1 AND entry_date = $2`,
      [userId, date]
    );
    
    return result.rows[0];
  }

  // Get monthly overview
  static async getMonthlyOverview(userId, year, month) {
    const result = await pool.query(
      `SELECT 
         entry_date,
         SUM(calories) as daily_calories,
         SUM(protein) as daily_protein,
         SUM(carbs) as daily_carbs,
         SUM(fats) as daily_fats,
         COUNT(*) as daily_entries
       FROM food_entries 
       WHERE user_id = $1 
         AND EXTRACT(YEAR FROM entry_date) = $2 
         AND EXTRACT(MONTH FROM entry_date) = $3
       GROUP BY entry_date 
       ORDER BY entry_date`,
      [userId, year, month]
    );
    
    return result.rows;
  }

  // Search food entries
  static async search(userId, query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const searchQuery = `%${query}%`;
    
    const result = await pool.query(
      `SELECT * FROM food_entries 
       WHERE user_id = $1 AND food_name ILIKE $2 
       ORDER BY entry_date DESC, created_at DESC 
       LIMIT $3 OFFSET $4`,
      [userId, searchQuery, limit, offset]
    );
    
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM food_entries WHERE user_id = $1 AND food_name ILIKE $2',
      [userId, searchQuery]
    );
    
    return {
      entries: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }
// أضف هذه الدالة في نهاية الملف
// حذف جميع مدخلات المستخدم
static async deleteByUserId(userId) {
  const result = await pool.query(
    'DELETE FROM food_entries WHERE user_id = $1 RETURNING *',
    [userId]
  );
  
  return result.rows;
}
}

module.exports = FoodEntry;