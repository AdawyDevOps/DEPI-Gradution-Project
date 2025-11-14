const express = require('express');
const router = express.Router();

// GET user profile
router.get('/', (req, res) => {
  try {
    // بيانات وهمية للتجربة - بعدين حتصلحها
    const userProfile = {
      id: 1,
      name: "Ahmed",
      email: "ahmed@example.com",
      age: 20,
      gender: "male",
      height: 180,
      weight: 83,
      activityLevel: "moderate",
      goal: "lose_weight"
    };
    
    res.json(userProfile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE user profile
router.put('/', (req, res) => {
  try {
    // كود تحديث البروفايل
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
