const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// تهيئة الجدول عند بدء التشغيل
User.createTable((err) => {
  if (err) {
    console.error('❌ Failed to create users table:', err);
  } else {
    console.log('✅ Users table ready');
  }
});

// تسجيل الدخول
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', { email });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  User.verifyPassword(email, password, (err, user) => {
    if (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error during login' 
      });
    }
    
    if (!user) {
      console.log('❌ User not found or wrong password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // إنشاء token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET || 'your-jwt-secret-123',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for user:', user.email);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        daily_calorie_goal: user.daily_calorie_goal,
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender
      }
    });
  });
});

// التسجيل
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  console.log('📝 Registration attempt:', { username, email });

  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Username, email and password are required' 
    });
  }

  // التحقق من وجود المستخدم
  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      console.error('❌ Registration error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error during registration' 
      });
    }

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists' 
      });
    }

    // التحقق من وجود اسم المستخدم
    User.findByUsername(username, (err, existingUsername) => {
      if (err) {
        console.error('❌ Registration error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error during registration' 
        });
      }

      if (existingUsername) {
        return res.status(400).json({ 
          success: false,
          error: 'Username already taken' 
        });
      }

      // إنشاء مستخدم جديد
      User.create({
        username,
        email,
        password, // في تطبيق حقيقي، يجب تشفير كلمة المرور باستخدام bcrypt
        daily_calorie_goal: 2000
      }, (err, newUser) => {
        if (err) {
          console.error('❌ Registration error:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Internal server error during registration' 
          });
        }

        // إنشاء token
        const token = jwt.sign(
          { 
            userId: newUser.id, 
            email: newUser.email,
            username: newUser.username 
          },
          process.env.JWT_SECRET || 'your-jwt-secret-123',
          { expiresIn: '24h' }
        );

        console.log('✅ Registration successful for user:', newUser.email);
        
        res.status(201).json({
          success: true,
          message: 'User created successfully',
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            daily_calorie_goal: newUser.daily_calorie_goal,
            weight: newUser.weight,
            height: newUser.height,
            age: newUser.age,
            gender: newUser.gender
          }
        });
      });
    });
  });
});

// جلب بيانات المستخدم
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    
    User.findById(decoded.userId, (err, user) => {
      if (err) {
        console.error('❌ Profile fetch error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          daily_calorie_goal: user.daily_calorie_goal,
          weight: user.weight,
          height: user.height,
          age: user.age,
          gender: user.gender
        }
      });
    });

  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// تحديث بيانات المستخدم
router.put('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-123');
    
    User.update(decoded.userId, req.body, (err, updatedUser) => {
      if (err) {
        console.error('❌ Profile update error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          daily_calorie_goal: updatedUser.daily_calorie_goal,
          weight: updatedUser.weight,
          height: updatedUser.height,
          age: updatedUser.age,
          gender: updatedUser.gender
        }
      });
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// endpoint للتحقق من حالة الـ auth
router.get('/status', (req, res) => {
  res.json({ 
    success: true,
    message: 'Auth service is running',
    database: 'SQLite'
  });
});

module.exports = router;
