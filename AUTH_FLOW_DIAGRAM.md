# Authentication Flow Diagrams - PathForward Myanmar

## 🔐 Complete Authentication Flows

---

## 1. Registration Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register
       │    { email, password, role, profileData }
       ▼
┌─────────────────────────────────────────────────┐
│              Rate Limiter                       │
│         (3 registrations/hour)                  │
└──────┬──────────────────────────────────────────┘
       │
       │ 2. Check rate limit
       ▼
┌─────────────────────────────────────────────────┐
│           Input Validator                       │
│  • Email format                                 │
│  • Password strength (8+ chars, complex)        │
│  • Role validation                              │
│  • Profile data validation                      │
└──────┬──────────────────────────────────────────┘
       │
       │ 3. Validate input
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Check if email exists                        │
│  • Hash password (bcrypt)                       │
│  • Create user record                           │
│  • Create role-specific profile                 │
│  • Generate verification token                  │
│  • Generate JWT tokens                          │
└──────┬──────────────────────────────────────────┘
       │
       │ 4. Create user
       ▼
┌─────────────────────────────────────────────────┐
│            Database                             │
│  • users table                                  │
│  • students/companies/universities/freelancers  │
└──────┬──────────────────────────────────────────┘
       │
       │ 5. User created
       ▼
┌─────────────────────────────────────────────────┐
│          Email Service                          │
│  • Send verification email                      │
│  • Include verification link                    │
│  • 24-hour expiry                               │
└──────┬──────────────────────────────────────────┘
       │
       │ 6. Email sent
       ▼
┌─────────────────────────────────────────────────┐
│            Response                             │
│  {                                              │
│    success: true,                               │
│    token: "access_token",                       │
│    refreshToken: "refresh_token",               │
│    user: { id, email, role, isVerified }        │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       │ 7. Store tokens in localStorage
       ▼
┌─────────────┐
│   User      │
│ (Logged In) │
└─────────────┘
```

---

## 2. Login Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────────────────────────────────┐
│              Rate Limiter                       │
│         (5 attempts/15 minutes)                 │
└──────┬──────────────────────────────────────────┘
       │
       │ 2. Check rate limit
       ▼
┌─────────────────────────────────────────────────┐
│           Input Validator                       │
│  • Email format                                 │
│  • Password present                             │
└──────┬──────────────────────────────────────────┘
       │
       │ 3. Validate input
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Find user by email                           │
│  • Check if account locked                      │
│  • Verify password (bcrypt.compare)             │
│  • Check if account active                      │
│  • Reset login attempts on success              │
│  • Update last login timestamp                  │
│  • Generate JWT tokens                          │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Password Wrong ───┐
       │                      │
       │                      ▼
       │              ┌───────────────────┐
       │              │ Increment Attempts│
       │              │ Lock after 5      │
       │              └───────────────────┘
       │                      │
       │                      ▼
       │              ┌───────────────────┐
       │              │ Return Error      │
       │              │ + Attempts Left   │
       │              └───────────────────┘
       │
       │ 4. Password Correct
       ▼
┌─────────────────────────────────────────────────┐
│            Response                             │
│  {                                              │
│    success: true,                               │
│    token: "access_token",                       │
│    refreshToken: "refresh_token",               │
│    user: { id, email, role, isVerified }        │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       │ 5. Store tokens in localStorage
       ▼
┌───��─────────┐
│   User      │
│ (Logged In) │
└─────────────┘
```

---

## 3. Email Verification Flow

```
┌─────────────┐
│   User      │
│  (Email)    │
└──────┬──────┘
       │
       │ 1. Click verification link
       │    /verify-email?token=xxx
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Hash the token                               │
│  • Find user with matching token                │
│  • Check token expiry (24 hours)                │
│  • Set isVerified = true                        │
│  • Clear verification token                     │
│  • Send welcome email                           │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Token Invalid/Expired ───┐
       │                             │
       │                             ▼
       │                     ┌───────────────┐
       │                     │ Return Error  │
       │                     │ Offer Resend  │
       │                     └───────────────┘
       │
       │ 2. Token Valid
       ▼
┌─────────────────────────────────────────────────┐
│            Database                             │
│  • Update user.isVerified = true                │
│  • Clear verification tokens                    │
└──────┬──────────────────────────────────────────┘
       │
       │ 3. Send welcome email
       ▼
┌─────────────────────────────────────────────────┐
│          Email Service                          │
│  • Send welcome email                           │
│  • Include getting started guide                │
└──────┬──────────────────────────────────────────┘
       │
       │ 4. Success response
       ▼
┌─────────────┐
│   User      │
│ (Verified)  │
└─────────────┘
```

---

## 4. Password Reset Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/forgot-password
       │    { email }
       ▼
┌─────────────────────────────────────────────────┐
│              Rate Limiter                       │
│         (3 requests/hour)                       │
└──────┬──────────────────────────────────────────┘
       │
       │ 2. Check rate limit
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Find user by email                           │
│  • Generate reset token                         │
│  • Hash and store token                         │
│  • Set 1-hour expiry                            │
│  • Send reset email                             │
└──────┬─���────────────────────────────────────────┘
       │
       │ 3. Send reset email
       ▼
┌─────────────────────────────────────────────────┐
│          Email Service                          │
│  • Send password reset email                    │
│  • Include reset link                           │
│  • 1-hour expiry warning                        │
└──────┬──────────────────────────────────────────┘
       │
       │ 4. User clicks reset link
       │    /reset-password?token=xxx
       ▼
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 5. POST /api/auth/reset-password/:token
       │    { password }
       ▼
┌─────────────────────────────────────────────────┐
│           Input Validator                       │
│  • Password strength validation                 │
└──────┬────���─────────────────────────────────────┘
       │
       │ 6. Validate password
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Hash the token                               │
│  • Find user with matching token                │
│  • Check token expiry (1 hour)                  │
│  • Hash new password                            │
│  • Update user password                         │
│  • Clear reset token                            │
└──────┬──────────────────────────────────────────┘
       │
       │ 7. Password updated
       ▼
┌─────────────────────────────────────────────────┐
│            Response                             │
│  {                                              │
│    success: true,                               │
│    message: "Password reset successful"         │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       │ 8. Redirect to login
       ▼
┌─────────────┐
│   User      │
│ (Can Login) │
└─────────────┘
```

---

## 5. Token Refresh Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. Make API request with expired access token
       │    Authorization: Bearer expired_token
       ▼
┌─────────────────────────────────────────────────┐
│          API Endpoint                           │
│  • Verify access token                          │
│  • Token expired (401)                          │
└──────┬──────────────────────────────────────────┘
       │
       │ 2. 401 Unauthorized
       ▼
┌─────────────────────────────────────────────────┐
│       Axios Interceptor                         │
│  • Detect 401 error                             │
│  • Get refresh token from localStorage          │
│  • Queue failed request                         │
└──────┬──────────────────────────────────────────┘
       │
       │ 3. POST /api/auth/refresh
       │    { refreshToken }
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  • Verify refresh token                         │
│  • Check if user exists and active              │
│  • Generate new access token                    │
│  • Generate new refresh token                   │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Refresh Token Invalid ───┐
       │                             │
       │                             ▼
       │                     ┌───────────────┐
       │                     │ Clear Tokens  │
       │                     │ Redirect Login│
       │                     └──────────���────���
       │
       │ 4. New tokens generated
       ▼
┌─────────────────────────────────────────────────┐
│            Response                             │
│  {                                              │
│    success: true,                               │
│    token: "new_access_token",                   │
│    refreshToken: "new_refresh_token"            │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       │ 5. Update tokens in localStorage
       ▼
┌─────────────────────────────────────────────────┐
│       Axios Interceptor                         │
│  • Update Authorization header                  │
│  • Retry all queued requests                    │
└──────┬──────────────────────────────────────────┘
       │
       │ 6. Retry original request with new token
       ▼
┌──────���────���─────────────────────────────────────┐
│          API Endpoint                           │
│  • Verify new access token                      │
│  • Process request                              │
│  • Return response                              │
└──────┬──────────────────────────────────────────┘
       │
       │ 7. Success response
       ▼
┌─────────────┐
│   User      │
│ (Seamless)  │
└─────────────┘
```

---

## 6. Protected Route Access Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. GET /api/protected-endpoint
       │    Authorization: Bearer access_token
       ▼
┌─────────────────────────────────────────────────┐
│              Rate Limiter                       │
│         (100 requests/15 minutes)               │
└──────┬───────────────────────��──────────────────┘
       │
       │ 2. Check rate limit
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Middleware                        │
│  • Extract token from header                    │
│  • Verify JWT signature                         │
│  • Check token expiry                           │
│  • Get user from database                       │
│  • Check if user active                         │
│  • Attach user to request                       │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Token Invalid/Expired ───┐
       │                             │
       │                             ▼
       │                     ┌───────────────┐
       │                     │ Return 401    │
       │                     │ Trigger Refresh│
       │                     └───────────────┘
       │
       │ 3. Token Valid
       ▼
┌─────────────────────────────────────────────────┐
│       Authorization Middleware                  │
│  • Check user role                              │
│  • Verify role has permission                   │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Role Not Authorized ───┐
       │                           │
       │                           ▼
       │                   ┌───────────────┐
       │                   │ Return 403    │
       │                   │ Forbidden     │
       │                   └───────────────┘
       │
       │ 4. Authorized
       ▼
┌─────────────────────────────────────────────────┐
│          Route Handler                          │
│  • Process request                              │
│  • Access user data from req.user               │
│  • Perform business logic                       │
│  • Return response                              │
└──────┬───���──────────────────────────────────────┘
       │
       │ 5. Success response
       ▼
┌─────────────┐
│   User      │
│  (Client)   │
└─────────────┘
```

---

## 7. Account Lockout Flow

```
┌─────────────┐
│   User      │
│  (Client)   │
└──────┬──────┘
       │
       │ Attempt 1: Wrong password
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  loginAttempts: 0 → 1                           │
│  Response: "Invalid credentials, 4 left"        │
└─────────────────────────────────────────────────┘
       │
       │ Attempt 2: Wrong password
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  loginAttempts: 1 → 2                           │
│  Response: "Invalid credentials, 3 left"        │
└─────────────────────────────────────────────────┘
       │
       │ Attempt 3: Wrong password
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  loginAttempts: 2 → 3                           │
│  Response: "Invalid credentials, 2 left"        │
└─────────────────────────────────────────────────┘
       │
       │ Attempt 4: Wrong password
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  loginAttempts: 3 → 4                           │
│  Response: "Invalid credentials, 1 left"        │
└─────────────────────────────────────────────────┘
       │
       │ Attempt 5: Wrong password
       ▼
┌─��──────────────────���────────────────────────────┐
│          Auth Controller                        │
│  loginAttempts: 4 → 5                           │
│  lockUntil: now + 2 hours                       │
│  Response: "Account locked for 2 hours"         │
└─────────────────────────────────────────────────┘
       │
       │ Attempt 6: Try to login (even with correct password)
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  Check: lockUntil > now?                        │
│  Response: "Account temporarily locked"         │
└─────────────────────────────────────────────────┘
       │
       │ Wait 2 hours...
       ▼
┌─────────────────────────────────────────────────┐
│          Auth Controller                        │
│  Check: lockUntil < now?                        │
��  Reset: loginAttempts = 0, lockUntil = null     │
│  Allow login attempt                            │
└─────────────────────────────────────────────────┘
       │
       │ Successful login
       ▼
┌─────────────┐
│   User      │
│ (Logged In) │
└─────────────┘
```

---

## 8. Complete User Journey

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              USER REGISTRATION                  │
│                                                 │
│  1. User visits /register                       │
│  2. Selects role (student/company/etc)          │
│  3. Fills registration form                     │
│  4. Submits form                                │
│     ↓                                           │
│  5. Backend validates input                     │
│  6. Creates user account                        │
│  7. Sends verification email                    │
│  8. Returns JWT tokens                          │
│     ↓                                           ��
│  9. User redirected to dashboard                │
│ 10. Shows "Please verify email" banner          │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│            EMAIL VERIFICATION                   │
│                                                 │
│  1. User checks email                           │
│  2. Clicks verification link                    │
│  3. Backend verifies token                      │
│  4. Sets isVerified = true                      │
│  5. Sends welcome email                         │
│     ↓                                           │
│  6. User sees success message                   │
│  7. Full access granted                         │
│                                                 │
└──────────────────┬──────────────────────────────��
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│            USING THE PLATFORM                   │
│                                                 │
│  1. User browses platform                       │
│  2. Makes API requests                          │
│  3. Access token in header                      │
│  4. Backend verifies token                      │
│  5. Returns requested data                      │
│     ↓                                           │
│  After 15 minutes...                            │
│     ↓                                           │
│  6. Access token expires                        │
│  7. Next request returns 401                    │
│  8. Frontend auto-refreshes token               │
│  9. Retries request with new token              │
│ 10. User continues seamlessly                   │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ���
┌─────────────────────────────────────────────────┐
│                                                 │
│            FORGOT PASSWORD                      │
│                                                 │
│  1. User clicks "Forgot Password"               │
│  2. Enters email address                        │
│  3. Backend sends reset email                   │
│  4. User clicks reset link                      │
│  5. Enters new password                         │
│  6. Backend validates and updates               │
│  7. User redirected to login                    │
│  8. Logs in with new password                   │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│                 LOGOUT                          │
│                                                 │
│  1. User clicks logout                          │
│  2. Frontend calls /api/auth/logout             │
│  3. Frontend clears tokens                      │
│  4. User redirected to login                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 9. Security Layers Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                       │
│              (Browser/Mobile App)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  LAYER 1: HTTPS                         │
│              (Encrypted Transport)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              LAYER 2: RATE LIMITING                     │
│         (Prevent Brute Force Attacks)                   │
│  • 5 login attempts / 15 min                            │
│  • 3 registrations / hour                               │
│  • 100 API requests / 15 min                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            LAYER 3: SECURITY HEADERS                    │
│              (Helmet.js Protection)                     │
│  • Content Security Policy                              │
│  • XSS Protection                                       │
│  • HSTS                                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 4: INPUT VALIDATION                     │
│         (Prevent Injection Attacks)                     │
│  • Email format validation                              │
│  • Password strength check                              │
│  • SQL injection prevention                             │
│  • XSS sanitization                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          LAYER 5: AUTHENTICATION                        │
│            (JWT Token Verification)                     │
���  • Token signature check                                │
│  • Token expiry check                                   │
│  • User existence check                                 │
│  • Account status check                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 6: AUTHORIZATION                        │
│          (Role-Based Access Control)                    │
│  • Check user role                                      │
│  • Verify permissions                                   │
│  • Resource ownership check                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────���───────────┐
│          LAYER 7: BUSINESS LOGIC                        │
│           (Application Code)                            │
│  • Process request                                      │
│  • Database operations                                  │
│  • Return response                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    RESPONSE                             │
│              (Sanitized Data)                           │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                   TOKEN CREATION                        │
│                                                         │
│  User Login/Register                                    │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Access Token    │      │  Refresh Token   │        │
│  │  Expiry: 15 min  │      │  Expiry: 7 days  │        │
│  │  Contains:       │      │  Contains:       │        │
│  │  • User ID       │      │  • User ID       │        │
│  │  • Role          │      │                  │        │
│  └────────┬─────────┘      └────────┬─────────┘        │
│           │                         │                  │
│           └─────────┬───────────────┘                  │
│                     │                                  │
│                     ▼                                  │
│           Stored in localStorage                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  TOKEN USAGE                            │
│                                                         │
│  Every API Request                                      │
│         │                                               │
│         ▼                                               │
│  Authorization: Bearer {access_token}                   │
│         │                                               │
│         ▼                                               │
│  Backend verifies token                                 │
│         │                                               │
│         ├─── Valid ────► Process Request                │
│         │                                               │
│         └─── Expired ──► Return 401                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 TOKEN REFRESH                           │
│                                                         │
│  On 401 Error                                           │
│         │                                               │
│         ▼                                               │
│  Send refresh_token to /api/auth/refresh                │
│         │                                               │
│         ▼                                               │
│  Backend verifies refresh_token                         │
│         │                                               │
│         ├─── Valid ────► Generate new tokens            │
│         │                                               │
│         └─── Invalid ──► Logout user                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 TOKEN EXPIRY                            │
│                                                         │
│  After 7 days (refresh token expires)                   │
│         │                                               │
│         ▼                                               │
│  User must login again                                  │
│         │                                               │
│         ▼                                               │
│  New tokens generated                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Legend

```
┌─────────┐
│  Box    │  = Process/Component
└─────────┘

    │
    ▼         = Flow Direction

    ├───      = Decision Branch

    ═══       = Important Path
```

---

## Key Takeaways

1. **Multiple Security Layers**: Each request passes through 7 security layers
2. **Automatic Token Refresh**: Users never see token expiration
3. **Account Protection**: Lockout after 5 failed attempts
4. **Email Verification**: Ensures valid email addresses
5. **Rate Limiting**: Prevents abuse and attacks
6. **Input Validation**: Stops malicious data at the door
7. **Role-Based Access**: Users only access what they're allowed to

---

*These diagrams represent the complete authentication flow for PathForward Myanmar platform.*
