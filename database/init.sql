-- إنشاء الداتا بيز
CREATE DATABASE IF NOT EXISTS calorie_chronicle;
USE calorie_chronicle;

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    daily_calorie_goal INT DEFAULT 2000,
    weekly_weight_goal DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول الوجبات
CREATE TABLE IF NOT EXISTS food_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    entry_date DATE NOT NULL,
    entry_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- بيانات تجريبية
INSERT IGNORE INTO users (username, email, password_hash, daily_calorie_goal) VALUES
('testuser', 'test@test.com', '$2b$10$exampleHash', 2000);

INSERT IGNORE INTO food_entries (user_id, food_name, calories, entry_date) VALUES
(1, 'Chicken Breast', 165, CURDATE()),
(1, 'Rice', 206, CURDATE()),
(1, 'Apple', 95, CURDATE());
