const express = require('express');
const User = require('../models/User');
const FoodEntry = require('../models/FoodEntry');
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate, validatePasswordChange } = require('../middleware/validation');
const router = express.Router();

// الحصول على بروفايل المستخدم
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// تحديث بروفايل المستخدم الأساسي
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;
    
    // التحقق من عدم وجود مستخدم آخر بنفس البريد أو الاسم
    const userExists = await User.existsByEmailOrUsername(email, username, userId);
    if (userExists) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    const updatedUser = await User.update(userId, { username, email });
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// تحديث إعدادات المستخدم الشخصية والأهداف
router.put('/profile/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username, email, age, gender, height_cm, weight_kg, 
      activity_level, goal
    } = req.body;
    
    // التحقق من البيانات إذا كانت موجودة
    if (username || email) {
      const userExists = await User.existsByEmailOrUsername(email, username, userId);
      if (userExists) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
    }
    
    const userData = {
      username, email, age, gender, height_cm, weight_kg, 
      activity_level, goal
    };
    
    const updatedUser = await User.updateWithGoals(userId, userData);
    
    res.json({
      message: 'Profile settings updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// تغيير كلمة المرور
router.put('/change-password', authenticateToken, validatePasswordChange, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    // الحصول على المستخدم الحالي
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // للتحقق من كلمة المرور الحالية، نحتاج للبيانات الكاملة
    const fullUser = await User.findByEmail(user.email);
    const validPassword = await User.verifyPassword(currentPassword, fullUser.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // تحديث كلمة المرور
    await User.updatePassword(userId, newPassword);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// الحصول على إحصائيات المستخدم
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const stats = await User.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// حذف حساب المستخدم
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // حذف جميع مدخلات الطعام أولاً
    await FoodEntry.deleteByUserId(userId);
    
    // ثم حذف المستخدم
    await User.delete(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;