# Security Implementation Guide - PathForward Myanmar

## 🚀 Quick Start - Implementing Security Fixes

This guide will walk you through implementing all critical security improvements for the PathForward Myanmar authentication system.

---

## 📦 Step 1: Install Required Dependencies

Navigate to the server directory and install the necessary packages:

```bash
cd server
npm install express-validator validator express-rate-limit helmet nodemailer
```

**Package Purposes:**
- `express-validator`: Input validation and sanitization
- `validator`: Additional validation utilities
- `express-rate-limit`: Rate limiting to prevent brute force attacks
- `helmet`: Security headers middleware
- `nodemailer`: Email sending functionality

---

## 🗄️ Step 2: Update Database Schema

Run the database migration to add new security fields to the User model:

```bash
cd server
node src/database/migrate.js
```

Or manually add these fields to your User table:

```sql
ALTER TABLE users ADD COLUMN login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN lock_until TIMESTAMP;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN verification_token_expire TIMESTAMP;
ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_password_expire TIMESTAMP;
```

---

## 🔧 Step 3: Update User Model

Update `server/src/models/User.js` to include new fields and methods:

```javascript
// Add these fields to the User model definition
loginAttempts: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},
lockUntil: {
  type: DataTypes.DATE,
  allowNull: true
},
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

Add these methods after the model definition:

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

---

## 🔐 Step 4: Update JWT Utilities

Update `server/src/utils/jwt.js` to support refresh tokens:

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' } // Shorter expiry for access token
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
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
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
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

---

## 📧 Step 5: Configure Email Service

Update your `.env` file with email configuration:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# For Gmail, you need to:
# 1. Enable 2-factor authentication
# 2. Generate an "App Password" from Google Account settings
# 3. Use that app password here
```

**Alternative Email Services:**

### Using SendGrid:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Using AWS SES:
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_aws_smtp_username
EMAIL_PASSWORD=your_aws_smtp_password
```

---

## 🛡️ Step 6: Update Server Index

Replace `server/src/index.js` with the enhanced version:

```javascript
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

// Security middleware - MUST be first
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

// Rate limiting - Apply to all API routes
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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
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
      console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
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
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
```

---

## 🔄 Step 7: Update Auth Controller

Replace `server/src/controllers/authController.js` with the enhanced version from the audit document. Key changes include:

1. **Enhanced Registration:**
   - Email normalization (lowercase)
   - Profile data validation
   - Transaction rollback on failure
   - Better error handling

2. **Enhanced Login:**
   - Account lockout after 5 failed attempts
   - Login attempt tracking
   - Better error messages
   - Security logging

3. **New Endpoints:**
   - Email verification
   - Password reset
   - Refresh token
   - Resend verification

---

## 🛣️ Step 8: Update Auth Routes

Replace `server/src/routes/authRoutes.js`:

```javascript
const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate 
} = require('../middleware/validation');
const { 
  authLimiter, 
  registerLimiter,
  passwordResetLimiter
} = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, validate, resetPassword);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
```

---

## 🌐 Step 9: Update Frontend

### 9.1 Install Frontend Dependencies

```bash
cd client
npm install zustand
```

### 9.2 Update API Client

The `client/src/lib/api.ts` file has been created with:
- Automatic token injection
- Token refresh on 401 errors
- Request queuing during refresh
- Automatic redirect to login on auth failure

### 9.3 Update Auth Store

The `client/src/store/authStore.ts` has been enhanced with:
- Refresh token support
- Better error handling
- Persistent state
- Auto token refresh

---

## 🔑 Step 10: Update Environment Variables

Create/update `.env` files:

### Server `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pathforward_myanmar
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_minimum_32_characters_long
JWT_REFRESH_SECRET=your_different_very_long_random_secret_key_for_refresh
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Frontend URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Client `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 Step 11: Test the Implementation

### 11.1 Start the Server

```bash
cd server
npm run dev
```

### 11.2 Start the Client

```bash
cd client
npm run dev
```

### 11.3 Test Checklist

- [ ] **Registration:**
  - Try registering with a weak password (should fail)
  - Try registering with invalid email (should fail)
  - Register with valid data (should succeed)
  - Try registering with same email (should fail)

- [ ] **Login:**
  - Login with correct credentials (should succeed)
  - Login with wrong password 5 times (should lock account)
  - Wait 2 hours or manually reset lockout in database
  - Login again (should work)

- [ ] **Rate Limiting:**
  - Try logging in more than 5 times in 15 minutes (should be blocked)
  - Try registering more than 3 times in 1 hour (should be blocked)

- [ ] **Email Verification:**
  - Check email for verification link
  - Click verification link (should verify account)
  - Try using expired token (should fail)

- [ ] **Password Reset:**
  - Request password reset
  - Check email for reset link
  - Reset password (should succeed)
  - Login with new password (should work)

- [ ] **Token Refresh:**
  - Login and wait for access token to expire (15 minutes)
  - Make an API request (should auto-refresh)
  - Check that new token is received

---

## 🐛 Troubleshooting

### Issue: Email not sending

**Solution:**
1. Check email credentials in `.env`
2. For Gmail, ensure you're using an App Password, not your regular password
3. Check firewall settings for port 587
4. Try using a different email service (SendGrid, AWS SES)

### Issue: Rate limiting too strict

**Solution:**
Adjust limits in `server/src/middleware/rateLimiter.js`:
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increase from 5 to 10
  // ...
});
```

### Issue: Database migration fails

**Solution:**
1. Backup your database
2. Manually run the SQL commands from Step 2
3. Or use `sequelize.sync({ force: true })` (WARNING: This will delete all data)

### Issue: CORS errors

**Solution:**
1. Check `CLIENT_URL` in server `.env`
2. Ensure it matches your frontend URL exactly
3. Check browser console for specific CORS error

### Issue: Token refresh not working

**Solution:**
1. Ensure `JWT_REFRESH_SECRET` is set in `.env`
2. Check browser localStorage for `refreshToken`
3. Check server logs for refresh errors

---

## 📊 Monitoring & Logging

### Add Logging Middleware

```bash
npm install morgan
```

```javascript
// In server/src/index.js
const morgan = require('morgan');

// Add after helmet
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
```

### Security Event Logging

Create `server/src/utils/logger.js`:

```javascript
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${event}: ${JSON.stringify(details)}\n`;
  
  const logFile = path.join(logDir, 'security.log');
  fs.appendFileSync(logFile, logEntry);
  
  console.log(`🔒 Security Event: ${event}`, details);
};

module.exports = { logSecurityEvent };
```

Use in auth controller:

```javascript
const { logSecurityEvent } = require('../utils/logger');

// In login function, after failed attempt:
logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
  email: email,
  ip: req.ip,
  userAgent: req.get('user-agent')
});

// After account lockout:
logSecurityEvent('ACCOUNT_LOCKED', {
  email: email,
  ip: req.ip
});
```

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique JWT secrets (min 32 characters)
- [ ] Enable HTTPS (use Let's Encrypt or cloud provider SSL)
- [ ] Configure production database with SSL
- [ ] Set up proper email service (not Gmail)
- [ ] Configure proper CORS origins
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Review and adjust rate limits for production traffic
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Set up DDoS protection (Cloudflare, AWS Shield, etc.)
- [ ] Review all environment variables
- [ ] Test all authentication flows in staging
- [ ] Perform security audit
- [ ] Set up automated security scanning

---

## 📚 Additional Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed

---

## ✅ Success Criteria

Your authentication system is properly secured when:

1. ✅ All tests pass
2. ✅ Rate limiting prevents brute force attacks
3. ✅ Email verification works
4. ✅ Password reset works
5. ✅ Account lockout works after 5 failed attempts
6. ✅ Token refresh works automatically
7. ✅ Input validation prevents malicious data
8. ✅ Security headers are present
9. ✅ No sensitive data in error messages
10. ✅ All endpoints are properly protected

Congratulations! Your authentication system is now production-ready! 🎉
