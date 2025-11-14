const db = require('../config/database');

class Meal {
  // إنشاء جدول الوجبات إذا لم يكن موجوداً
  static createTable(callback) {
    // تم نقل التهيئة إلى database.js
    if (callback) callback(null);
  }

  // إضافة وجبة جديدة
  static create(mealData, callback) {
    const { user_id, name, calories, protein, carbs, fat, meal_type, date } = mealData;
    
    db.run(
      `INSERT INTO meals (user_id, name, calories, protein, carbs, fat, meal_type, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, calories, protein, carbs, fat, meal_type, date],
      function(err) {
        if (err) {
          console.error('❌ Error creating meal:', err);
          if (callback) callback(err, null);
        } else {
          // إرجاع الوجبة المُنشأة
          Meal.findById(this.lastID, callback);
        }
      }
    );
  }

  // الحصول على وجبات مستخدم في تاريخ محدد
  static getByUserAndDate(user_id, date, callback) {
    db.all(
      `SELECT * FROM meals 
       WHERE user_id = ? AND date = ? 
       ORDER BY 
         CASE meal_type
           WHEN 'breakfast' THEN 1
           WHEN 'lunch' THEN 2
           WHEN 'dinner' THEN 3
           WHEN 'snack' THEN 4
           ELSE 5
         END, created_at`,
      [user_id, date],
      (err, rows) => {
        if (err) {
          console.error('❌ Error getting meals:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, rows);
        }
      }
    );
  }

  // الحصول على إجمالي السعرات الحرارية ليوم محدد
  static getDailyTotal(user_id, date, callback) {
    db.get(
      `SELECT 
        SUM(calories) as total_calories,
        SUM(protein) as total_protein,
        SUM(carbs) as total_carbs,
        SUM(fat) as total_fat
       FROM meals 
       WHERE user_id = ? AND date = ?`,
      [user_id, date],
      (err, row) => {
        if (err) {
          console.error('❌ Error getting daily total:', err);
          if (callback) callback(err, null);
        } else {
          // التأكد من أن القيم ليست null
          const totals = {
            total_calories: row?.total_calories || 0,
            total_protein: row?.total_protein || 0,
            total_carbs: row?.total_carbs || 0,
            total_fat: row?.total_fat || 0
          };
          if (callback) callback(null, totals);
        }
      }
    );
  }

  // الحصول على إحصائيات أسبوعية
  static getWeeklyStats(user_id, startDate, callback) {
    db.all(
      `SELECT date, SUM(calories) as daily_calories
       FROM meals 
       WHERE user_id = ? AND date >= ? AND date <= date(?, '+6 days')
       GROUP BY date
       ORDER BY date`,
      [user_id, startDate, startDate],
      (err, rows) => {
        if (err) {
          console.error('❌ Error getting weekly stats:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, rows);
        }
      }
    );
  }

  // البحث عن وجبة بال ID
  static findById(id, callback) {
    db.get(
      'SELECT * FROM meals WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('❌ Error finding meal by ID:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, row);
        }
      }
    );
  }

  // حذف وجبة
  static delete(id, callback) {
    db.run(
      'DELETE FROM meals WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          console.error('❌ Error deleting meal:', err);
          if (callback) callback(err);
        } else {
          if (callback) callback(null);
        }
      }
    );
  }
}

module.exports = Meal;
