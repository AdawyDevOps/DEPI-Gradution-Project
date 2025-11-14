const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      daily_calorie_goal INTEGER DEFAULT 2000,
      weight REAL,
      height REAL,
      age INTEGER,
      gender TEXT DEFAULT 'male',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err);
    } else {
      console.log('✅ Users table ready');
      
      // إنشاء مستخدم تجريبي إذا لم يكن موجوداً
      db.get('SELECT * FROM users WHERE email = ?', ['test@test.com'], (err, row) => {
        if (!row) {
          db.run(
            `INSERT INTO users (username, email, password, daily_calorie_goal, weight, height, age, gender) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['testuser', 'test@test.com', 'test123', 2000, 75, 175, 28, 'male'],
            function(err) {
              if (err) {
                console.error('❌ Error creating test user:', err);
              } else {
                console.log('✅ Test user created: test@test.com');
              }
            }
          );
        } else {
          console.log('✅ Test user already exists');
        }
      });
    }
  });

  // Create meals table
  db.run(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL,
      carbs REAL,
      fat REAL,
      meal_type TEXT DEFAULT 'lunch',
      date TEXT DEFAULT CURRENT_DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating meals table:', err);
    } else {
      console.log('✅ Meals table ready');
    }
  });
});

// Promisified database methods
db.getAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = db;
