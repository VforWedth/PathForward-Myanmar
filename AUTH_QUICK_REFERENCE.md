# Authentication System - Quick Reference Card

## 🔐 API Endpoints

### Public Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Register new user | 3 per hour |
| POST | `/api/auth/login` | Login user | 5 per 15 min |
| GET | `/api/auth/verify-email/:token` | Verify email address | None |
| POST | `/api/auth/resend-verification` | Resend verification email | 5 per 15 min |
| POST | `/api/auth/forgot-password` | Request password reset | 3 per hour |
| POST | `/api/auth/reset-password/:token` | Reset password | None |
| POST | `/api/auth/refresh` | Refresh access token | None |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

---

## 📝 Request/Response Examples

### Register User

**Request:**
```json
POST /api/auth/register
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "phone": "+959123456789",
  "role": "student",
  "profileData": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "student@example.com",
    "role": "student",
    "isVerified": false
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain uppercase, lowercase, number, and special character"
    }
  ]
}
```

### Login User

**Request:**
```json
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "student@example.com",
    "role": "student",
    "isVerified": true
  }
}
```

**Error Response - Wrong Password (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "attemptsLeft": 4
}
```

**Error Response - Account Locked (423):**
```json
{
  "success": false,
  "message": "Account is temporarily locked due to multiple failed login attempts. Please try again later."
}
```

### Get Current User

**Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "student@example.com",
    "role": "student",
    "isVerified": true,
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00.000Z"
  },
  "profile": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "university": null,
    "major": null
  }
}
```

### Refresh Token

**Request:**
```json
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Forgot Password

**Request:**
```json
POST /api/auth/forgot-password
{
  "email": "student@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

### Reset Password

**Request:**
```json
POST /api/auth/reset-password/token-here
{
  "password": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 🔑 Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Valid Examples:**
- `SecurePass123!`
- `MyP@ssw0rd`
- `Test@1234`

**Invalid Examples:**
- `password` (no uppercase, number, or special char)
- `Pass123` (too short, no special char)
- `PASSWORD123!` (no lowercase)

---

## 🛡️ Security Features

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Register | 3 accounts | 1 hour |
| Password Reset | 3 requests | 1 hour |
| General API | 100 requests | 15 minutes |

### Account Lockout

- **Trigger:** 5 failed login attempts
- **Duration:** 2 hours
- **Reset:** Automatic after lockout period or successful login

### Token Expiration

- **Access Token:** 15 minutes
- **Refresh Token:** 7 days
- **Verification Token:** 24 hours
- **Reset Token:** 1 hour

---

## 🎯 User Roles

| Role | Description | Registration Fields |
|------|-------------|---------------------|
| `student` | Students seeking opportunities | firstName, lastName |
| `company` | Companies posting jobs | companyName |
| `university` | Universities managing students | universityName |
| `freelancer` | Independent freelancers | firstName, lastName |
| `admin` | System administrators | (Created manually) |

---

## 🔄 Frontend Integration

### Using the Auth Store (React/Next.js)

```typescript
import { useAuthStore } from '@/store/authStore';

function LoginComponent() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User is now logged in, redirect handled automatically
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    // Your login form
  );
}
```

### Making Authenticated Requests

```typescript
import api from '@/lib/api';

// Token is automatically added to headers
const response = await api.get('/auth/me');

// Token refresh is automatic on 401 errors
const data = await api.post('/some-protected-endpoint', { data });
```

### Checking Authentication Status

```typescript
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

function ProtectedPage() {
  const { isAuthenticated, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user?.email}</div>;
}
```

---

## 🐛 Common Error Codes

| Code | Message | Cause | Solution |
|------|---------|-------|----------|
| 400 | Validation failed | Invalid input data | Check request format |
| 401 | Invalid credentials | Wrong email/password | Verify credentials |
| 401 | Not authorized | Missing/invalid token | Login again |
| 403 | Role not authorized | Insufficient permissions | Check user role |
| 423 | Account locked | Too many failed attempts | Wait 2 hours |
| 429 | Too many requests | Rate limit exceeded | Wait and retry |
| 500 | Server error | Internal server issue | Contact support |

---

## 📧 Email Templates

### Verification Email
- **Subject:** Verify Your Email - PathForward Myanmar
- **Expiry:** 24 hours
- **Action:** Click verification link

### Password Reset Email
- **Subject:** Password Reset Request - PathForward Myanmar
- **Expiry:** 1 hour
- **Action:** Click reset link and enter new password

### Welcome Email
- **Subject:** Welcome to PathForward Myanmar!
- **Trigger:** After email verification
- **Action:** Get started with the platform

---

## 🧪 Testing Commands

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "role": "student",
    "profileData": {
      "firstName": "Test",
      "lastName": "User"
    }
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Environment Variables

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_NAME=pathforward_myanmar
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=different_secret_min_32_chars

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
CLIENT_URL=http://localhost:3000
```

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role ENUM('admin', 'student', 'company', 'university', 'freelancer'),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP,
  verification_token VARCHAR(255),
  verification_token_expire TIMESTAMP,
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up `.env` file with all required variables
- [ ] Run database migrations
- [ ] Start server: `npm run dev`
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Verify email functionality
- [ ] Test rate limiting
- [ ] Test account lockout
- [ ] Test token refresh

---

## 📞 Support & Resources

- **Documentation:** See `AUTHENTICATION_AUDIT.md` for detailed information
- **Implementation Guide:** See `SECURITY_IMPLEMENTATION_GUIDE.md`
- **API Documentation:** See `API_DOCUMENTATION.md`

---

## ⚡ Quick Tips

1. **Always use HTTPS in production**
2. **Never commit `.env` files**
3. **Use strong, unique JWT secrets**
4. **Enable email verification in production**
5. **Monitor failed login attempts**
6. **Keep dependencies updated**
7. **Use environment-specific configs**
8. **Implement proper logging**
9. **Regular security audits**
10. **Test all authentication flows**

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
