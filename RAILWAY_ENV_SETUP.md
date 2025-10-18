# Railway Environment Variables Setup

## Critical Fix Applied

**Problem Solved**: Server was not starting on Railway because of incorrect `NODE_ENV` check.

**What Was Fixed**:
- ✅ Server now starts on Railway (was checking `NODE_ENV !== 'production'`)
- ✅ CORS configuration updated to allow your Vercel frontend
- ✅ Server binds to `0.0.0.0` (required for Railway)
- ✅ Better error logging and startup messages

---

## Required Railway Environment Variables

Go to **Railway Dashboard → Your Project → Backend Service → Variables** and set these:

### 1. Database (Supabase)

```bash
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.your-project-ref
DB_PASSWORD=your-supabase-password
```

**Where to find these**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **Database**
4. Under **Connection Info**, find:
   - Host: `aws-0-ap-southeast-1.pooler.supabase.com`
   - Port: `6543` (use **pooler port**, not direct port)
   - Database: `postgres`
   - User: `postgres.xxxxxxxxxxxxx`
   - Password: Click **Reset Database Password** if you don't have it

### 2. Application Settings

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456
```

**Generate JWT_SECRET**:
- Open terminal: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Or use any long random string (at least 32 characters)

### 3. Frontend URL (CORS)

```bash
CLIENT_URL=https://path-forward-mm.vercel.app
```

**⚠️ IMPORTANT**:
- Use your **actual Vercel production URL**
- **NO trailing slash** at the end
- Must start with `https://`
- This allows CORS requests from your frontend

### 4. Email Settings (Optional - for later)

If you want email verification to work:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=PathForward Myanmar <noreply@pathforward.com>
```

---

## Verification Steps

### Step 1: Check Railway Logs

After setting environment variables, Railway will automatically redeploy.

1. Go to Railway Dashboard → Your Project → Backend Service
2. Click **Deployments** tab
3. Click on the latest deployment
4. Check the logs - you should see:

```
==================================================
🚀 PathForward Myanmar Server Started
==================================================
📍 Port: 5000
📍 Environment: production
📍 Client URL: https://path-forward-mm.vercel.app
📍 Database: postgres
📍 CORS Origins: 4 configured
==================================================
✅ Database connection established
✅ Database models synchronized
```

### Step 2: Test Health Endpoint

Open this URL in your browser (replace with your Railway URL):
```
https://pathforward-myanmar.up.railway.app/api/health
```

**Expected Response**:
```json
{
  "success": true,
  "message": "PathForward Myanmar API is running",
  "timestamp": "2025-10-19T..."
}
```

If you get this, your backend is **WORKING** ✅

### Step 3: Test from Frontend

1. Open your Vercel deployment
2. Go to `/register/student`
3. Open browser DevTools (F12) → Network tab
4. Fill out the registration form and submit
5. Check the network request:
   - **URL**: Should be `https://pathforward-myanmar.up.railway.app/api/auth/register`
   - **Status**: Should be `200 OK` (not 502!)
   - **Response**: Should contain `{"success": true, ...}`

---

## Common Issues & Solutions

### Issue 1: Still Getting 502 Error

**Cause**: Server not starting properly

**Check**:
1. Railway logs - is the server starting?
2. Database connection - check Supabase credentials
3. PORT variable - should be set to `5000` or removed (Railway auto-assigns)

**Fix**:
```bash
# Remove PORT variable from Railway (Railway sets this automatically)
# OR set it to 5000 explicitly
PORT=5000
```

### Issue 2: CORS Error Still Showing

**Cause**: `CLIENT_URL` doesn't match your Vercel URL

**Check**:
1. Railway `CLIENT_URL` variable
2. Your actual Vercel production URL

**Fix**:
```bash
# Update CLIENT_URL to match your Vercel URL EXACTLY
CLIENT_URL=https://path-forward-mm.vercel.app

# Common mistakes:
❌ CLIENT_URL=path-forward-mm.vercel.app  (missing https://)
❌ CLIENT_URL=https://path-forward-mm.vercel.app/  (trailing slash)
✅ CLIENT_URL=https://path-forward-mm.vercel.app  (correct!)
```

### Issue 3: Database Connection Failed

**Cause**: Wrong Supabase credentials or using direct connection instead of pooler

**Check Railway Logs**:
```
❌ Database initialization error: Connection refused
```

**Fix**:
1. Use **pooler connection** (port 6543), NOT direct connection (port 5432)
2. Verify all Supabase credentials
3. Check if Supabase project is active

**Correct Supabase Pooler Settings**:
```bash
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543  # Pooler port (NOT 5432)
DB_NAME=postgres
```

### Issue 4: Server Starts But Can't Connect

**Cause**: Server not binding to `0.0.0.0`

**Already Fixed** in code:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  // Server binds to all network interfaces
});
```

---

## Environment Variable Checklist

Copy this checklist to ensure you have everything:

**Railway Backend Variables**:
- [ ] `DB_HOST` - Supabase pooler host
- [ ] `DB_PORT` - `6543` (pooler port)
- [ ] `DB_NAME` - `postgres`
- [ ] `DB_USER` - Your Supabase user (postgres.xxxxx)
- [ ] `DB_PASSWORD` - Your Supabase password
- [ ] `NODE_ENV` - `production`
- [ ] `JWT_SECRET` - Random 64+ character string
- [ ] `CLIENT_URL` - Your Vercel URL (no trailing slash)
- [ ] `PORT` - `5000` (or let Railway auto-assign)

**Vercel Frontend Variables**:
- [ ] `NEXT_PUBLIC_API_URL` - `https://your-railway-url.up.railway.app/api`
- [ ] `NEXT_PUBLIC_SERVER_URL` - `https://your-railway-url.up.railway.app`

---

## What Changed in Code

### 1. server/src/index.js - CORS Configuration

**Before**:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

**After**:
```javascript
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'https://path-forward-mm.vercel.app',
  // ... more origins
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. server/src/index.js - Server Startup

**Before** (BROKEN on Railway):
```javascript
// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

**After** (WORKS on Railway):
```javascript
const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 PathForward Myanmar Server Started');
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
```

**Key Changes**:
- ✅ Removed `NODE_ENV !== 'production'` check (was preventing Railway start)
- ✅ Binds to `0.0.0.0` (required for Railway)
- ✅ Better logging to debug issues
- ✅ Graceful error handling

---

## Expected Railway Logs (Success)

After deploying, you should see these logs in Railway:

```bash
Nixpacks build started
 > Using Node.js 20
 > Installing dependencies with pnpm
 > Starting build
 > Build completed

Starting deployment...
==================================================
🚀 PathForward Myanmar Server Started
==================================================
📍 Port: 5000
📍 Environment: production
📍 Client URL: https://path-forward-mm.vercel.app
📍 Database: postgres
📍 CORS Origins: 4 configured
==================================================
✅ Database connection established
✅ Database models synchronized
```

If you see this = **SUCCESS** ✅

---

## Next Steps After Setup

1. **Commit and Push** the code changes (already done automatically)
2. **Set Railway environment variables** (follow checklist above)
3. **Wait for Railway auto-redeploy** (1-2 minutes)
4. **Check Railway logs** for success message
5. **Test health endpoint** in browser
6. **Test registration** from Vercel frontend
7. **Verify no 502 or CORS errors**

---

## Support

If you still encounter issues:

1. **Share Railway Logs**:
   - Copy the full deployment logs
   - Look for any error messages

2. **Share Environment Variables** (sanitized):
   - List which variables you've set (don't share actual passwords)
   - Confirm formats match this guide

3. **Test Health Endpoint**:
   - Try accessing `/api/health` directly
   - Share the response or error

---

**Last Updated**: 2025-10-19
**Status**: Ready to deploy
