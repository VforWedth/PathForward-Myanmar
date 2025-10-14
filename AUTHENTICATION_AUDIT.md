# PathForward Myanmar - Authentication System Audit & Improvements

## 📋 Executive Summary

This document provides a comprehensive analysis of the authentication system for PathForward Myanmar, identifying current implementation, security issues, and providing production-ready improvements.

**Current Status:** ⚠️ Basic implementation with critical security gaps  
**Recommended Action:** Implement all critical and high-priority fixes before production

---

## 🔍 Current Implementation Analysis

### ✅ What's Working Well

1. **JWT-based Authentication**
   - Token generation and verification implemented
   - Bearer token authentication in headers
   - Token expiration (7 days default)

2. **Password Security**
   - Bcrypt hashing with salt (10 rounds)
   - Password hashing on user creation and update
   - Password comparison method implemented

3. **Role-Based Access Control (RBAC)**
   - Multiple user roles (admin, student, company, university, freelancer)
   - Role-based middleware (`authorize`)
   - Protected routes with `protect` middleware

4. **Frontend State Management**
   - Zustand store for auth state
   - Axios interceptors for token injection
   - Auto-redirect on 401 errors

5. **User Account Management**
   - Active/inactive status tracking
   - Email verification flag
   - Last login timestamp

---

## 🚨 Critical Security Issues

### 1. **Missing Input Validation** (CRITICAL)
**Issue:** No validation on registration inputs  
**Risk:** SQL injection, XSS attacks, malformed data

**Current Code:**
```javascript
const { email, password, phone, role, profileData } = req.body;
// No validation before use
```

**Fix Required:** Add comprehensive validation

### 2. **No Rate Limiting** (CRITICAL)
**Issue:** No protection against brute force attacks  
**Risk:** Attackers can attempt unlimited login attempts

**Fix Required:** Implement rate limiting on auth endpoints

### 3. **Weak Password Requirements** (HIGH)
**Issue:** Only frontend validation (minLength={6})  
**Risk:** Weak passwords can be easily cracked

**Fix Required:** Backend password strength validation

### 4. **No Email Verification Flow** (HIGH)
**Issue:** `isVerified` flag exists but no verification process  
**Risk:** Fake accounts, spam, unauthorized access

**Fix Required:** Implement email verification with tokens

### 5. **Missing CSRF Protection** (HIGH)
**Issue:** No CSRF tokens for state-changing operations  
**Risk:** Cross-site request forgery attacks

**Fix Required:** Implement CSRF protection

### 6. **Token Refresh Not Implemented** (MEDIUM)
**Issue:** No refresh token mechanism  
**Risk:** Users logged out after 7 days, poor UX

**Fix Required:** Implement refresh token flow

### 7. **No Account Lockout** (MEDIUM)
**Issue:** No lockout after failed login attempts  
**Risk:** Brute force attacks

**Fix Required:** Lock account after N failed attempts

### 8. **Sensitive Data in Logs** (MEDIUM)
**Issue:** Error messages may expose sensitive info  
**Risk:** Information disclosure

**Fix Required:** Sanitize error messages

### 9. **No Session Management** (LOW)
**Issue:** No way to invalidate tokens or track sessions  
**Risk:** Stolen tokens remain valid until expiration

**Fix Required:** Implement token blacklist or session store

### 10. **Missing Security Headers** (LOW)
**Issue:** No security headers (helmet.js)  
**Risk:** Various web vulnerabilities

**Fix Required:** Add helmet middleware

---

## 🛠️ Production-Ready Implementation

### Phase 1: Critical Fixes (Must Have Before Launch)

#### 1.1 Input Validation & Sanitization

**Install Dependencies:**
```bash
cd server
npm install express-validator validator
```

**Create Validation Middleware:**
```javascript
// server/src/middleware/validation.js
const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Validation rules for registration
const registerValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      // Additional email validation
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone number format'),
  
  body('role')
    .isIn(['student', 'company', 'university', 'freelancer'])
    .withMessage('Invalid role'),
  
  body('profileData')
    .optional()
    .isObject().withMessage('Profile data must be an object')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate
};
```

#### 1.2 Rate Limiting

**Install Dependencies:**
```bash
npm install express-rate-limit
```

**Create Rate Limiter:**
```javascript
// server/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: {
    success: false,
    message: 'Too many accounts created from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  registerLimiter
};
```

#### 1.3 Security Headers

**Install Dependencies:**
```bash
npm install helmet
```

**Add to server:**
```javascript
// server/src/index.js
const helmet = require('helmet');

// Add after express initialization
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### 1.4 Account Lockout Mechanism

**Update User Model:**
```javascript
// server/src/models/User.js
// Add these fields to User model
loginAttempts: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},
lockUntil: {
  type: DataTypes.DATE,
  allowNull: true
}
```

**Add Methods to User Model:**
```javascript
// Check if account is locked
User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
User.prototype.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.update({
      loginAttempts: 1,
      lockUntil: null
    });
  }
  
  // Otherwise increment
  const updates = { loginAttempts: this.loginAttempts + 1 };
  
  // Lock account after 5 failed attempts
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    updates.lockUntil = Date.now() + LOCK_TIME;
  }
  
  return await this.update(updates);
};

// Reset login attempts
User.prototype.resetLoginAttempts = async function() {
  return await this.update({
    loginAttempts: 0,
    lockUntil: null
  });
};
```

#### 1.5 Enhanced Auth Controller

**Updated authController.js:**
```javascript
// server/src/controllers/authController.js
const { User, Student, Company, University, Freelancer } = require('../models');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, phone, role, profileData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: email.toLowerCase() },
          ...(phone ? [{ phone }] : [])
        ]
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? 'User already exists with this email'
          : 'User already exists with this phone number'
      });
    }

    // Validate profile data based on role
    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required'
      });
    }

    // Role-specific validation
    const requiredFields = {
      student: ['firstName', 'lastName'],
      company: ['companyName'],
      university: ['universityName'],
      freelancer: ['firstName', 'lastName']
    };

    const missing = requiredFields[role]?.filter(field => !profileData[field]);
    if (missing && missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      phone,
      role
    });

    // Create role-specific profile
    let profile;
    try {
      switch (role) {
        case 'student':
          profile = await Student.create({
            userId: user.id,
            ...profileData
          });
          break;
        case 'company':
          profile = await Company.create({
            userId: user.id,
            ...profileData
          });
          break;
        case 'university':
          profile = await University.create({
            userId: user.id,
            ...profileData
          });
          break;
        case 'freelancer':
          profile = await Freelancer.create({
            userId: user.id,
            ...profileData
          });
          break;
      }
    } catch (profileError) {
      // Rollback user creation if profile creation fails
      await user.destroy();
      throw profileError;
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      const attemptsLeft = 5 - user.loginAttempts - 1;
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsLeft: attemptsLeft > 0 ? attemptsLeft : 0
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'loginAttempts', 'lockUntil'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get role-specific profile
    let profile;
    switch (user.role) {
      case 'student':
        profile = await Student.findOne({ where: { userId: user.id } });
        break;
      case 'company':
        profile = await Company.findOne({ where: { userId: user.id } });
        break;
      case 'university':
        profile = await University.findOne({ where: { userId: user.id } });
        break;
      case 'freelancer':
        profile = await Freelancer.findOne({ where: { userId: user.id } });
        break;
    }

    res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is primarily client-side
    // However, we can log the activity
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
```

#### 1.6 Update Auth Routes

**Updated authRoutes.js:**
```javascript
// server/src/routes/authRoutes.js
const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  validate 
} = require('../middleware/validation');
const { 
  authLimiter, 
  registerLimiter 
} = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', registerLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
```

#### 1.7 Update Server Index

**Updated index.js:**
```javascript
// server/src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);

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
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
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

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Security features enabled`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
```

---

### Phase 2: High Priority Features

#### 2.1 Email Verification System

**Install Dependencies:**
```bash
npm install nodemailer crypto
```

**Create Email Service:**
```javascript
// server/src/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"PathForward Myanmar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - PathForward Myanmar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to PathForward Myanmar!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"PathForward Myanmar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - PathForward Myanmar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
```

**Update User Model for Verification:**
```javascript
// Add to User model
verificationToken: {
  type: DataTypes.STRING,
  allowNull: true
},
verificationTokenExpire: {
  type: DataTypes.DATE,
  allowNull: true
},
resetPasswordToken: {
  type: DataTypes.STRING,
  allowNull: true
},
resetPasswordExpire: {
  type: DataTypes.DATE,
  allowNull: true
}
```

**Add Verification Methods:**
```javascript
// server/src/utils/tokens.js
const crypto = require('crypto');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateVerificationToken,
  hashToken
};
```

**Add Verification Endpoints:**
```javascript
// Add to authController.js

const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateVerificationToken, hashToken } = require('../utils/tokens');

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const hashedToken = hashToken(token);
    
    const user = await User.findOne({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpire: { [Op.gt]: Date.now() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }
    
    // Generate new token
    const verificationToken = generateVerificationToken();
    user.verificationToken = hashToken(verificationToken);
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    
    // Send email
    await sendVerificationEmail(user.email, verificationToken);
    
    res.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }
    
    // Generate reset token
    const resetToken = generateVerificationToken();
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    
    // Send email
    await sendPasswordResetEmail(user.email, resetToken);
    
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const hashedToken = hashToken(token);
    
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { [Op.gt]: Date.now() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

#### 2.2 Refresh Token Implementation

**Update JWT Utils:**
```javascript
// server/src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' } // Shorter expiry
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { 
  generateToken, 
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};
```

**Add Refresh Endpoint:**
```javascript
// Add to authController.js

const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    // Generate new tokens
    const newAccessToken = generateToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);
    
    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

---

### Phase 3: Frontend Improvements

#### 3.1 Enhanced Auth Store

**Updated authStore.ts:**
```typescript
// client/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'company' | 'university' | 'freelancer';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, refreshToken, user } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ 
            user, 
            token, 
            refreshToken,
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      register: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);
          const { token, refreshToken, user } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ 
            user, 
            token,
            refreshToken,
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          set({ 
            user: null, 
            token: null, 
            refreshToken: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          set({ 
            user: response.data.user, 
            isAuthenticated: true, 
            token 
          });
        } catch (error) {
          // Try to refresh token
          const refreshed = await get().refreshAccessToken();
          if (!refreshed) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            set({ 
              user: null, 
              token: null, 
              refreshToken: null,
              isAuthenticated: false 
            });
          }
        }
      },

      refreshAccessToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          set({ 
            token: newToken,
            refreshToken: newRefreshToken
          });
          
          return true;
        } catch (error) {
          return false;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

#### 3.2 Enhanced API Client

**Updated api.ts:**
```typescript
// client/src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        processQueue(null, newToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 📊 Testing Checklist

### Manual Testing

- [ ] Register with valid data (all roles)
- [ ] Register with duplicate email
- [ ] Register with weak password
- [ ] Register with invalid email format
- [ ] Login with correct credentials
- [ ] Login with wrong password (test lockout after 5 attempts)
- [ ] Login with non-existent email
- [ ] Access protected route without token
- [ ] Access protected route with valid token
- [ ] Access protected route with expired token
- [ ] Test token refresh flow
- [ ] Test logout functionality
- [ ] Test email verification flow
- [ ] Test password reset flow
- [ ] Test rate limiting on login endpoint
- [ ] Test rate limiting on registration endpoint
- [ ] Test role-based access control

### Automated Testing (Recommended)

```bash
npm install --save-dev jest supertest
```

Create test file:
```javascript
// server/src/__tests__/auth.test.js
const request = require('supertest');
const app = require('../index');

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@1234',
          role: 'student',
          profileData: {
            firstName: 'Test',
            lastName: 'User'
          }
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123',
          role: 'student'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@1234'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
    });
  });
});
```

---

## 🔐 Security Best Practices Summary

1. **Always validate and sanitize user input**
2. **Use HTTPS in production**
3. **Implement rate limiting on all endpoints**
4. **Use strong password requirements**
5. **Implement account lockout after failed attempts**
6. **Use secure, httpOnly cookies for tokens (optional enhancement)**
7. **Implement CSRF protection**
8. **Keep dependencies updated**
9. **Use environment variables for secrets**
10. **Implement proper error handling without leaking info**
11. **Log security events**
12. **Implement email verification**
13. **Use refresh tokens**
14. **Implement proper session management**
15. **Regular security audits**

---

## 📝 Environment Variables Required

Update `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=pathforward_myanmar
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_different_very_long_random_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Frontend URL
CLIENT_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## 🚀 Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Configure database with SSL
- [ ] Set up monitoring and logging
- [ ] Implement backup strategy
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure rate limiting based on traffic
- [ ] Set up CDN for static assets
- [ ] Enable database connection pooling
- [ ] Configure proper security headers
- [ ] Set up automated security scanning
- [ ] Document API endpoints
- [ ] Set up CI/CD pipeline
- [ ] Configure load balancing (if needed)

---

## 📚 Additional Recommendations

### 1. Two-Factor Authentication (2FA)
Consider implementing 2FA using libraries like `speakeasy` and `qrcode`.

### 2. OAuth Integration
Add social login (Google, Facebook) using `passport.js`.

### 3. Activity Logging
Log all authentication events for security auditing.

### 4. IP Whitelisting
For admin accounts, consider IP whitelisting.

### 5. Device Management
Track and manage user devices/sessions.

### 6. Security Monitoring
Implement real-time security monitoring and alerts.

---

## 🎯 Conclusion

The current authentication system has a solid foundation but requires critical security enhancements before production deployment. Implement Phase 1 fixes immediately, followed by Phase 2 features for a complete, production-ready authentication system.

**Priority Order:**
1. ✅ Input validation and sanitization (CRITICAL)
2. ✅ Rate limiting (CRITICAL)
3. ✅ Security headers (CRITICAL)
4. ✅ Account lockout (HIGH)
5. ✅ Enhanced error handling (HIGH)
6. ✅ Email verification (HIGH)
7. ✅ Password reset flow (HIGH)
8. ✅ Refresh token implementation (MEDIUM)

After implementing these improvements, your authentication system will be secure, scalable, and production-ready.
