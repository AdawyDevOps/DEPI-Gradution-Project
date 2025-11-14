const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');

// استيراد config database فقط (سيقوم بتهيئة الجداول تلقائياً)
require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://frontend:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);

// Basic health check
app.get('/api', (req, res) => {
  res.json({ 
    message: '🎉 Calorie Chronicle API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Test endpoint is working!',
    status: 'OK'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});
