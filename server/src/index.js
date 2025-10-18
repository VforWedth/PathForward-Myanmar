const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const universityRoutes = require('./routes/universityRoutes');
const quizRoutes = require('./routes/quizRoutes');
const studentRoutes = require('./routes/studentRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Middleware - CORS Configuration
// Allow multiple origins for flexibility
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://path-forward-mm.vercel.app',
  'https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/freelancer', freelancerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PathForward Myanmar API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't exit process, let server start even if DB fails initially
  }
};

// Start server function
const startServer = async () => {
  // Initialize database
  await initializeDatabase();

  // Start listening on PORT
  app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('🚀 PathForward Myanmar Server Started');
    console.log('='.repeat(50));
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Client URL: ${process.env.CLIENT_URL || 'Not set'}`);
    console.log(`📍 Database: ${process.env.DB_NAME || 'Not set'}`);
    console.log(`📍 CORS Origins: ${allowedOrigins.length} configured`);
    console.log('='.repeat(50));
  });
};

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Export for serverless environments (if needed in future)
module.exports = app;
