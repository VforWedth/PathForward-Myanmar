# Railway Deployment Guide - PathForward Myanmar Backend

## Complete Step-by-Step Guide

---

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to GitHub

---

## Part 1: Prepare Your Code (Already Done!)

I've created the necessary configuration files:
- ✅ `server/railway.json` - Railway configuration
- ✅ `server/nixpacks.toml` - Build configuration
- ✅ `server/package.json` - Already has correct start script

---

## Part 2: Deploy to Railway

### Step 1: Sign Up & Create Project

1. **Go to Railway**: https://railway.app
2. **Click "Start a New Project"** or "Login with GitHub"
3. **Authorize Railway** to access your GitHub
4. **Click "New Project"**
5. **Select "Deploy from GitHub repo"**

### Step 2: Configure Deployment

1. **Select Repository**: Choose `PathForward-Myanmar`
2. **IMPORTANT**: Railway will show a configuration screen
3. **Configure these settings**:

   **Root Directory**:
   ```
   server
   ```

   **Build Command** (leave empty or use):
   ```
   pnpm install
   ```

   **Start Command**:
   ```
   node src/index.js
   ```

4. **Click "Deploy"** (Don't worry if it fails first time - we'll add env vars)

### Step 3: Add Environment Variables

1. After deployment starts, **click on your service**
2. **Click "Variables" tab**
3. **Click "Add Variable"** and add each of these:

#### Database Variables
```
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
```
```
DB_PORT=6543
```
```
DB_NAME=postgres
```
```
DB_USER=postgres.cgtnpglqjpedhjfcputl
```
```
DB_PASSWORD=hacktivators5
```

#### Application Variables
```
NODE_ENV=production
```
```
PORT=5000
```

#### Security Variables
```
JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
```
```
JWT_EXPIRE=7d
```

#### Other Variables
```
REQUIRE_COMPANY_VERIFICATION=false
```
```
MAX_FILE_SIZE=5242880
```
```
UPLOAD_PATH=/tmp/uploads
```

**IMPORTANT**: Don't add `CLIENT_URL` yet - we'll add it after we get the Railway URL!

### Step 4: Get Your Railway URL

1. **Click "Settings" tab**
2. **Scroll to "Domains"** section
3. **Click "Generate Domain"**
4. **Copy the generated URL** (e.g., `https://pathforward-myanmar-production.up.railway.app`)

### Step 5: Add CLIENT_URL Variable

1. Go back to **"Variables" tab**
2. **Add one more variable**:
   ```
   CLIENT_URL=https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app
   ```
   (Use your actual Vercel URL)

3. **Redeploy**: The app will automatically redeploy with new variables

### Step 6: Wait for Deployment

1. **Click "Deployments" tab**
2. **Watch the build logs**
3. **Wait for**:
   - ✅ Installing dependencies
   - ✅ Starting server
   - ✅ "Server is running on port 5000"
   - ✅ "Database models synchronized"

**Deployment should take 2-5 minutes**

---

## Part 3: Test Your Backend

### Test 1: Health Check

1. **Open your browser**
2. **Go to**: `https://your-railway-url.up.railway.app/api/health`
3. **Expected response**:
   ```json
   {
     "success": true,
     "message": "PathForward Myanmar API is running",
     "timestamp": "2025-10-19T..."
   }
   ```

### Test 2: Check Logs

1. **In Railway Dashboard**, click "Logs" tab
2. **Look for**:
   ```
   ✅ Database connected successfully
   ✅ Database models synchronized
   🚀 Server is running on port 5000
   📍 Environment: production
   ```

If you see these messages → **Backend is working!** 🎉

---

## Part 4: Connect Frontend (Vercel) to Backend (Railway)

### Step 1: Update Vercel Environment Variables

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click your project**: path-forward-myanmar
3. **Click "Settings" → "Environment Variables"**
4. **Add or Update these variables**:

**Variable 1**:
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://your-railway-url.up.railway.app/api`
- Environment: All (Production, Preview, Development)

**Variable 2**:
- Name: `NEXT_PUBLIC_SERVER_URL`
- Value: `https://your-railway-url.up.railway.app`
- Environment: All (Production, Preview, Development)

### Step 2: Redeploy Vercel

1. **Go to "Deployments" tab**
2. **Click the ⋯ menu** on latest deployment
3. **Click "Redeploy"**
4. **UNCHECK "Use existing build cache"**
5. **Click "Redeploy"**

---

## Part 5: Final Testing

### Test Registration Flow

1. **Go to your Vercel URL**: https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app/register/student

2. **Fill out the registration form**:
   - Email: test@example.com
   - Password: Test123!
   - Name: Test User
   - Phone: 1234567890

3. **Click Register**

4. **Expected**: Account created successfully, redirected to login

### Test Login Flow

1. **Go to**: https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app/login

2. **Login with**:
   - Email: test@example.com
   - Password: Test123!

3. **Expected**: Successfully logged in, redirected to dashboard

---

## Troubleshooting

### Issue 1: "Application failed to respond"

**Check Railway Logs**:
1. Go to Railway → Logs tab
2. Look for error messages

**Common causes**:
- Database connection failed → Check DB credentials
- Missing environment variables → Add them in Variables tab
- Port binding issue → Railway automatically sets PORT

**Fix**: Update environment variables and redeploy

---

### Issue 2: "Cannot connect to database"

**Error in logs**:
```
❌ Failed to connect to database
```

**Fix**:
1. Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
2. Make sure you're using the **connection pooler** (port 6543)
3. Check Supabase dashboard to ensure database is running

---

### Issue 3: "CORS Error" in browser

**Error in browser console**:
```
Access to XMLHttpRequest at 'https://railway-url...' from origin 'https://vercel-url...' has been blocked by CORS
```

**Fix**:
1. In Railway Variables, check `CLIENT_URL` matches your Vercel URL exactly
2. Redeploy Railway
3. Clear browser cache and try again

---

### Issue 4: "Network Error" when registering/logging in

**Check**:
1. Open browser DevTools (F12) → Console tab
2. Look for the API request URL
3. **If URL is `http://localhost:5000/api/...`** → Vercel env vars not set correctly
4. **If URL is your Railway URL** → Backend might be down

**Fix**:
- If localhost: Update Vercel environment variables and redeploy
- If Railway URL: Check Railway logs for errors

---

## Quick Reference: All Environment Variables

### Railway (Backend)
```env
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.cgtnpglqjpedhjfcputl
DB_PASSWORD=hacktivators5
JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-url.vercel.app
REQUIRE_COMPANY_VERIFICATION=false
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/tmp/uploads
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
NEXT_PUBLIC_SERVER_URL=https://your-railway-url.up.railway.app
```

---

## Monitoring & Maintenance

### Check Backend Status
- **Railway Dashboard** → Logs: Real-time server logs
- **Railway Dashboard** → Metrics: CPU, Memory, Network usage
- **Health Check**: https://your-railway-url.up.railway.app/api/health

### Check Frontend Status
- **Vercel Dashboard** → Deployments: Build status
- **Vercel Dashboard** → Analytics: Traffic and performance
- **Your Site**: https://your-vercel-url.vercel.app

---

## Cost & Limits (Free Tier)

### Railway Free Tier
- ✅ **$5 worth of usage/month** (plenty for MVP)
- ✅ **500 hours/month** (enough for 24/7 running)
- ✅ **100 GB bandwidth**
- ⚠️ **No credit card required** for trial

**Expected usage for your MVP**: ~$2-3/month (well within free tier)

### Vercel Free Tier
- ✅ **100 GB bandwidth**
- ✅ **Unlimited** deployments
- ✅ **1 million** function invocations

---

## What to Do After Successful Deployment

1. ✅ **Test all features**:
   - User registration (Student, Freelancer, Company, University)
   - Login/Logout
   - Job posting (Company)
   - Job applications (Student/Freelancer)
   - Dashboard views

2. ✅ **Monitor for errors**:
   - Check Railway logs daily
   - Check Vercel function logs
   - Monitor Supabase database

3. ✅ **Security checklist**:
   - [ ] Change JWT_SECRET to a stronger value
   - [ ] Change DB_PASSWORD (create new Supabase project or rotate password)
   - [ ] Set up rate limiting (already in your code)
   - [ ] Enable HTTPS only (Railway does this automatically)

4. ✅ **Performance optimization**:
   - Add database indexes for frequently queried fields
   - Implement caching for static data
   - Monitor Railway metrics

---

## Need Help?

If deployment fails:

1. **Check Railway Logs** for error messages
2. **Common errors and solutions**:
   - "Module not found" → Check pnpm install completed
   - "Port already in use" → Railway handles this automatically
   - "Database connection timeout" → Check Supabase credentials
   - "Cannot find module 'express'" → Dependencies not installed

3. **Railway Support**:
   - Discord: https://discord.gg/railway
   - Docs: https://docs.railway.app

---

## Success Checklist

- [ ] Railway deployment successful
- [ ] Health check endpoint returns 200 OK
- [ ] Railway logs show "Server is running"
- [ ] Railway logs show "Database connected"
- [ ] Vercel environment variables updated
- [ ] Vercel redeployed
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Dashboard loads correctly

---

**Last Updated**: 2025-10-19
**Your Railway Setup**: Backend (Express + PostgreSQL via Supabase)
**Your Vercel Setup**: Frontend (Next.js)

---

## Quick Start Summary

```bash
# 1. Commit configuration files
git add server/railway.json server/nixpacks.toml
git commit -m "Add Railway configuration"
git push origin main

# 2. Deploy on Railway
- Go to https://railway.app
- New Project → Deploy from GitHub
- Select PathForward-Myanmar repo
- Set root directory: server
- Add all environment variables
- Generate domain
- Wait for deployment

# 3. Update Vercel
- Add NEXT_PUBLIC_API_URL with Railway URL
- Add NEXT_PUBLIC_SERVER_URL with Railway URL
- Redeploy without cache

# 4. Test
- Visit Railway URL/api/health
- Try registration on Vercel URL
- Try login on Vercel URL
```

**Total Time**: 10-15 minutes
**Difficulty**: Easy
**Cost**: $0 for MVP

Good luck! 🚀
