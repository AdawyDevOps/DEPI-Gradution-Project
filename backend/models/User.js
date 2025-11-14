const db = require('../config/database');

class User {
  // إنشاء جدول المستخدمين إذا لم يكن موجوداً
  static createTable(callback) {
    // تم نقل التهيئة إلى database.js
    if (callback) callback(null);
  }

  // البحث عن مستخدم بالبريد الإلكتروني
  static findByEmail(email, callback) {
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          console.error('❌ Error finding user by email:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, row);
        }
      }
    );
  }

  // البحث عن مستخدم بالاسم
  static findByUsername(username, callback) {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          console.error('❌ Error finding user by username:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, row);
        }
      }
    );
  }

  // إنشاء مستخدم جديد
  static create(userData, callback) {
    const { username, email, password, daily_calorie_goal = 2000, weight, height, age, gender = 'male' } = userData;
    
    db.run(
      `INSERT INTO users (username, email, password, daily_calorie_goal, weight, height, age, gender) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password, daily_calorie_goal, weight, height, age, gender],
      function(err) {
        if (err) {
          console.error('❌ Error creating user:', err);
          if (callback) callback(err, null);
        } else {
          // إرجاع المستخدم المُنشأ
          User.findById(this.lastID, callback);
        }
      }
    );
  }

  // البحث عن مستخدم بال ID
  static findById(id, callback) {
    db.get(
      'SELECT id, username, email, daily_calorie_goal, weight, height, age, gender, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('❌ Error finding user by ID:', err);
          if (callback) callback(err, null);
        } else {
          if (callback) callback(null, row);
        }
      }
    );
  }

  // تحديث بيانات المستخدم
  static update(id, userData, callback) {
    const { daily_calorie_goal, weight, height, age, gender } = userData;
    
    db.run(
      `UPDATE users 
       SET daily_calorie_goal = ?, weight = ?, height = ?, age = ?, gender = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [daily_calorie_goal, weight, height, age, gender, id],
      function(err) {
        if (err) {
          console.error('❌ Error updating user:', err);
          if (callback) callback(err, null);
        } else if (this.changes === 0) {
          if (callback) callback(new Error('User not found'), null);
        } else {
          User.findById(id, callback);
        }
      }
    );
  }

  // التحقق من كلمة المرور
  static verifyPassword(email, password, callback) {
    User.findByEmail(email, (err, user) => {
      if (err) {
        if (callback) callback(err, null);
        return;
      }
      
      if (!user) {
        if (callback) callback(null, null);
        return;
      }
      
      // مقارنة كلمة المرور مباشرة
      if (user.password === password) {
        const { password, ...userWithoutPassword } = user;
        if (callback) callback(null, userWithoutPassword);
      } else {
        if (callback) callback(null, null);
      }
    });
  }
}

module.exports = User;
