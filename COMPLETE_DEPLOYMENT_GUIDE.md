# Complete Deployment Guide - PathForward Myanmar
## Fresh Start: Deploy Frontend (Vercel) + Backend (Railway)

This guide will walk you through deploying your application **from scratch**, step by step.

**Total Time**: 20-30 minutes
**Cost**: $0 (100% Free)
**Difficulty**: Easy (just follow along!)

---

## 📋 **What We're Deploying**

- **Frontend (Next.js)** → Vercel
- **Backend (Express.js)** → Railway
- **Database (PostgreSQL)** → Already on Supabase ✅

---

## ✅ **Prerequisites**

Before starting, make sure you have:

- [x] GitHub account
- [x] Code pushed to GitHub repository
- [x] Supabase database (you already have this!)
- [ ] Vercel account (we'll create if needed)
- [ ] Railway account (we'll create if needed)

---

# PART 1: Deploy Frontend to Vercel (10 minutes)

---

## Step 1: Sign Up / Login to Vercel

### 1.1 Go to Vercel

**Open your browser** and go to: **https://vercel.com**

### 1.2 Sign Up with GitHub

1. Click **"Start Deploying"** or **"Sign Up"**
2. Click **"Continue with GitHub"**
3. **Authorize Vercel** to access your GitHub account
4. You'll be redirected to Vercel Dashboard

✅ **You're now logged into Vercel!**

---

## Step 2: Create New Project on Vercel

### 2.1 Import Git Repository

1. On Vercel Dashboard, click **"Add New..."** (top right)
2. Click **"Project"**
3. You'll see **"Import Git Repository"** section
4. Find your repository: **PathForward-Myanmar**
   - If you don't see it, click **"Adjust GitHub App Permissions"**
   - Select your repositories or give access to all
   - Click **"Save"**
5. Click **"Import"** next to **PathForward-Myanmar**

### 2.2 Configure Project

You'll see the **"Configure Project"** screen.

**IMPORTANT SETTINGS**:

#### Project Name
- Leave as: `PathForward-Myanmar` (or customize)
- Click **"Edit"** if you want to change it

#### Framework Preset
- Should auto-detect: **Next.js**
- If not, select **Next.js** from dropdown

#### Root Directory
**THIS IS CRITICAL!**

1. Click **"Edit"** next to Root Directory
2. Type: `client`
3. Click **"Save"**

**Why?** Your Next.js app is in the `client` folder, not the root.

#### Build and Output Settings

**Leave these as default** (they'll auto-fill based on Next.js):
- Build Command: `next build` or `pnpm run build`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Don't change these!**

### 2.3 Environment Variables

**SKIP THIS FOR NOW** - we'll add them after Railway deployment.

Click **"Deploy"** at the bottom.

---

## Step 3: First Vercel Deployment

### 3.1 Watch the Build

You'll see:
```
Building...
└ Installing dependencies
└ Running build
└ Uploading build
```

**This first deployment will succeed!** ✅

It will take about **2-3 minutes**.

### 3.2 Get Your Vercel URL

After deployment completes:

1. You'll see: **"Congratulations! 🎉"**
2. Click **"Visit"** or copy the URL
3. Your URL looks like: `https://path-forward-myanmar-xyz123.vercel.app`

**⚠️ IMPORTANT**: Save this URL - we'll need it for Railway!

### 3.3 Test Your Frontend

Visit your Vercel URL. You should see your homepage!

**Note**: Login/Register won't work yet because the backend isn't deployed. That's normal!

---

# PART 2: Deploy Backend to Railway (15 minutes)

---

## Step 4: Sign Up / Login to Railway

### 4.1 Go to Railway

**Open your browser** and go to: **https://railway.app**

### 4.2 Sign Up with GitHub

1. Click **"Login"** or **"Start a New Project"**
2. Click **"Login with GitHub"**
3. **Authorize Railway** to access your GitHub
4. You'll be redirected to Railway Dashboard

✅ **You're now logged into Railway!**

---

## Step 5: Create New Project on Railway

### 5.1 Start New Project

1. On Railway Dashboard, click **"New Project"**
2. Click **"Deploy from GitHub repo"**

### 5.2 Select Repository

1. Click **"Configure GitHub App"** if needed
2. Find and click: **PathForward-Myanmar**
3. Railway will start analyzing your repo

### 5.3 Configure Service

You'll see a screen showing your project.

1. Click on the **service** that was created (should say "Building...")
2. Click **"Settings"** (gear icon on left sidebar)

### 5.4 Set Root Directory

**THIS IS CRITICAL!**

Scroll down to **"Service Settings"** or **"Build Settings"**:

1. Find **"Root Directory"**
2. Click **"Edit"** or type in the field
3. Enter: `server`
4. Press **Enter** or click **"Save"**

### 5.5 Set Start Command

Still in Settings, find **"Start Command"**:

1. Enter: `node src/index.js`
2. Press **Enter** or click **"Save"**

### 5.6 Set Install Command (Optional)

Find **"Install Command"** (if available):

1. Enter: `pnpm install`
2. Press **Enter** or click **"Save"**

---

## Step 6: Add Environment Variables to Railway

### 6.1 Open Variables Tab

Click **"Variables"** in the left sidebar.

### 6.2 Add Variables One by One

Click **"New Variable"** for each of these:

#### Variable 1: Database Host
- **Key**: `DB_HOST`
- **Value**: `aws-1-ap-southeast-1.pooler.supabase.com`
- Click **"Add"**

#### Variable 2: Database Port
- **Key**: `DB_PORT`
- **Value**: `6543`
- Click **"Add"**

#### Variable 3: Database Name
- **Key**: `DB_NAME`
- **Value**: `postgres`
- Click **"Add"**

#### Variable 4: Database User
- **Key**: `DB_USER`
- **Value**: `postgres.cgtnpglqjpedhjfcputl`
- Click **"Add"**

#### Variable 5: Database Password
- **Key**: `DB_PASSWORD`
- **Value**: `hacktivators5`
- Click **"Add"**

#### Variable 6: JWT Secret
- **Key**: `JWT_SECRET`
- **Value**: `pathforward_myanmar_secret_key_2024_change_this_in_production`
- Click **"Add"**

#### Variable 7: JWT Expire
- **Key**: `JWT_EXPIRE`
- **Value**: `7d`
- Click **"Add"**

#### Variable 8: Node Environment
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click **"Add"**

#### Variable 9: Port
- **Key**: `PORT`
- **Value**: `5000`
- Click **"Add"**

#### Variable 10: Company Verification
- **Key**: `REQUIRE_COMPANY_VERIFICATION`
- **Value**: `false`
- Click **"Add"**

#### Variable 11: Max File Size
- **Key**: `MAX_FILE_SIZE`
- **Value**: `5242880`
- Click **"Add"**

#### Variable 12: Upload Path
- **Key**: `UPLOAD_PATH`
- **Value**: `/tmp/uploads`
- Click **"Add"**

#### Variable 13: Client URL (Your Vercel URL)
- **Key**: `CLIENT_URL`
- **Value**: `https://your-vercel-url.vercel.app`
- **⚠️ REPLACE** with your actual Vercel URL from Step 3.2
- Click **"Add"**

**Total**: 13 variables added ✅

---

## Step 7: Generate Railway Domain

### 7.1 Go to Settings

Click **"Settings"** in the left sidebar.

### 7.2 Generate Domain

Scroll down to **"Domains"** section:

1. Click **"Generate Domain"**
2. Railway will create a URL like: `https://pathforward-myanmar-production.up.railway.app`
3. **Copy this URL** - you'll need it!

**⚠️ SAVE THIS URL!** Write it down or keep the tab open.

---

## Step 8: Redeploy Railway with All Variables

### 8.1 Trigger Redeploy

1. Click **"Deployments"** in the left sidebar
2. Railway should already be deploying automatically
3. If not, click **"Deploy"** or **"Redeploy"**

### 8.2 Watch the Deployment

You'll see logs streaming:

```
Installing dependencies...
└ pnpm install
Starting application...
└ node src/index.js
✅ Database connected successfully
✅ Database models synchronized
🚀 Server is running on port 5000
```

**Wait for**: "Server is running on port 5000" ✅

This takes about **2-5 minutes**.

---

## Step 9: Test Your Backend

### 9.1 Test Health Endpoint

Open your browser and go to:

```
https://your-railway-url.up.railway.app/api/health
```

**Replace `your-railway-url`** with your actual Railway URL from Step 7.2.

**Expected Response**:
```json
{
  "success": true,
  "message": "PathForward Myanmar API is running",
  "timestamp": "2025-10-19T..."
}
```

✅ **If you see this, your backend is working!**

### 9.2 Check Railway Logs

Back in Railway:

1. Click **"Logs"** in the left sidebar
2. Look for:
   - ✅ `Database connected successfully`
   - ✅ `Database models synchronized`
   - ✅ `Server is running on port 5000`

---

# PART 3: Connect Frontend to Backend (5 minutes)

---

## Step 10: Add Environment Variables to Vercel

### 10.1 Go to Vercel Project Settings

1. Go back to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project: **PathForward-Myanmar**
3. Click **"Settings"** tab (top)
4. Click **"Environment Variables"** (left sidebar)

### 10.2 Add API URL Variable

#### Variable 1: NEXT_PUBLIC_API_URL

1. Click **"Add New"**
2. **Name**: `NEXT_PUBLIC_API_URL`
3. **Value**: `https://your-railway-url.up.railway.app/api`
   - **⚠️ REPLACE** `your-railway-url` with your Railway URL
   - **⚠️ Don't forget the `/api` at the end!**
4. **Environment**: Check all three boxes ✅
   - Production
   - Preview
   - Development
5. Click **"Save"**

#### Variable 2: NEXT_PUBLIC_SERVER_URL

1. Click **"Add New"** again
2. **Name**: `NEXT_PUBLIC_SERVER_URL`
3. **Value**: `https://your-railway-url.up.railway.app`
   - **⚠️ REPLACE** `your-railway-url` with your Railway URL
   - **⚠️ No `/api` at the end this time!**
4. **Environment**: Check all three boxes ✅
5. Click **"Save"**

✅ **Both environment variables added!**

---

## Step 11: Redeploy Vercel with Environment Variables

### 11.1 Go to Deployments

1. Click **"Deployments"** tab (top)
2. Find the **latest deployment** (top of list)

### 11.2 Redeploy

1. Click **⋯** (three dots) on the right of the latest deployment
2. Click **"Redeploy"**
3. **IMPORTANT**: **UNCHECK** "Use existing build cache"
4. Click **"Redeploy"**

### 11.3 Wait for Deployment

Watch the build:
```
Building...
└ Installing dependencies
└ Running build
└ Uploading build
✅ Deployment complete
```

Takes about **2-3 minutes**.

---

# PART 4: Final Testing (5 minutes)

---

## Step 12: Test Complete Application

### 12.1 Open Your App

Go to your Vercel URL: `https://your-vercel-url.vercel.app`

### 12.2 Test Registration

1. Click **"Register"** or go to `/register/student`
2. Fill out the registration form:
   - **Email**: `test@example.com`
   - **Password**: `Test123!`
   - **First Name**: `Test`
   - **Last Name**: `User`
   - **Phone**: `09123456789`
   - **University**: `Test University`
3. Click **"Register"**

**Expected**:
- ✅ Success message
- ✅ Redirected to login page
- ✅ Or automatically logged in

### 12.3 Test Login

1. Go to `/login`
2. Enter credentials:
   - **Email**: `test@example.com`
   - **Password**: `Test123!`
3. Click **"Login"**

**Expected**:
- ✅ Logged in successfully
- ✅ Redirected to dashboard
- ✅ Can see your name/email in header

### 12.4 Check Browser Console (Optional)

Open DevTools (F12) → Console tab:

- ✅ No errors
- ✅ API requests going to Railway URL (not localhost)
- ✅ Successful responses (200 OK)

---

## Step 13: Verify Everything Works

### 13.1 Test All User Flows

Try these to make sure everything works:

**Student Registration & Login**:
- [ ] Register as student → Works ✅
- [ ] Login as student → Works ✅
- [ ] View dashboard → Works ✅
- [ ] Browse jobs → Works ✅

**Company Registration & Login**:
- [ ] Register as company → Works ✅
- [ ] Login as company → Works ✅
- [ ] Post a job → Works ✅

**Freelancer Registration & Login**:
- [ ] Register as freelancer → Works ✅
- [ ] Login as freelancer → Works ✅
- [ ] Browse projects → Works ✅

**University Registration & Login**:
- [ ] Register as university → Works ✅
- [ ] Login as university → Works ✅
- [ ] View students → Works ✅

### 13.2 Check Database

Go to **Supabase Dashboard**: https://supabase.com/dashboard

1. Select your project
2. Go to **Table Editor**
3. Look at **Users** table
4. You should see your test user ✅

---

# 🎉 DEPLOYMENT COMPLETE!

---

## ✅ **What You've Accomplished**

- ✅ **Frontend deployed** to Vercel
- ✅ **Backend deployed** to Railway
- ✅ **Database connected** (Supabase)
- ✅ **Frontend ↔ Backend** connected
- ✅ **Registration working**
- ✅ **Login working**
- ✅ **All features functional**

---

## 📊 **Your Deployment URLs**

### Frontend (Vercel)
- **URL**: `https://your-vercel-url.vercel.app`
- **Dashboard**: https://vercel.com/dashboard

### Backend (Railway)
- **URL**: `https://your-railway-url.up.railway.app`
- **Dashboard**: https://railway.app/dashboard
- **Health Check**: `https://your-railway-url.up.railway.app/api/health`

### Database (Supabase)
- **Dashboard**: https://supabase.com/dashboard

---

## 📝 **Quick Reference: All Settings**

### Vercel Settings
```
Project: PathForward-Myanmar
Root Directory: client
Framework: Next.js

Environment Variables:
- NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
- NEXT_PUBLIC_SERVER_URL=https://your-railway-url.up.railway.app
```

### Railway Settings
```
Project: PathForward-Myanmar
Root Directory: server
Start Command: node src/index.js

Environment Variables (13 total):
- DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
- DB_PORT=6543
- DB_NAME=postgres
- DB_USER=postgres.cgtnpglqjpedhjfcputl
- DB_PASSWORD=hacktivators5
- JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
- JWT_EXPIRE=7d
- NODE_ENV=production
- PORT=5000
- CLIENT_URL=https://your-vercel-url.vercel.app
- REQUIRE_COMPANY_VERIFICATION=false
- MAX_FILE_SIZE=5242880
- UPLOAD_PATH=/tmp/uploads
```

---

## 🔍 **Troubleshooting Guide**

### Problem 1: "Network Error" when registering/logging in

**Symptoms**:
- Registration fails
- Login fails
- Browser console shows "Network Error"

**Check**:
1. Open browser DevTools (F12) → Network tab
2. Try to register/login
3. Look at the API request URL

**If URL is `http://localhost:5000/api/...`**:
- ❌ Vercel environment variables not set correctly
- **Fix**: Go to Vercel → Settings → Environment Variables
- Make sure `NEXT_PUBLIC_API_URL` is set
- Redeploy Vercel

**If URL is your Railway URL but fails**:
- ❌ Backend might be down
- **Fix**: Check Railway logs for errors

---

### Problem 2: CORS Error

**Symptoms**:
Browser console shows:
```
Access to XMLHttpRequest at 'https://railway-url...'
from origin 'https://vercel-url...' has been blocked by CORS
```

**Fix**:
1. Go to Railway → Variables
2. Check `CLIENT_URL` matches your Vercel URL **exactly**
3. No trailing slash: `https://your-vercel-url.vercel.app` ✅
4. Not: `https://your-vercel-url.vercel.app/` ❌
5. Redeploy Railway

---

### Problem 3: "Cannot connect to database"

**Symptoms**:
- Railway logs show: `Failed to connect to database`
- API requests return 500 errors

**Fix**:
1. Check Railway Variables:
   - `DB_HOST` = `aws-1-ap-southeast-1.pooler.supabase.com`
   - `DB_PORT` = `6543` (not 5432!)
   - `DB_NAME` = `postgres`
   - `DB_USER` = correct username
   - `DB_PASSWORD` = correct password
2. Go to Supabase → Settings → Database
3. Verify connection pooler is enabled
4. Redeploy Railway

---

### Problem 4: Vercel build fails

**Symptoms**:
```
Error: No Next.js version detected
```

**Fix**:
1. Vercel → Settings → General
2. Root Directory must be: `client`
3. Save and redeploy

---

### Problem 5: Railway detects Python instead of Node.js

**Symptoms**:
Railway logs show:
```
Detected Python
No start command was found
```

**Fix**:
1. Railway → Settings
2. Root Directory must be: `server`
3. Start Command must be: `node src/index.js`
4. Redeploy

---

## 🚀 **Next Steps After Deployment**

### 1. Security (Important!)

**Change these in production**:
- [ ] `JWT_SECRET` - use a strong random string
- [ ] `DB_PASSWORD` - rotate Supabase password
- [ ] Enable 2FA on GitHub, Vercel, Railway

### 2. Custom Domain (Optional)

**Vercel**:
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Update `CLIENT_URL` in Railway

**Railway**:
1. Go to Settings → Domains
2. Add custom domain
3. Update `NEXT_PUBLIC_API_URL` in Vercel

### 3. Monitoring

**Set up alerts**:
- Vercel: Enable deployment notifications
- Railway: Enable deployment notifications
- Supabase: Set up usage alerts

### 4. Optimization

**Performance**:
- Add caching strategies
- Optimize images
- Add database indexes
- Enable compression

---

## 💰 **Cost Breakdown (Free Tier)**

### Vercel (Free)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ 1M function invocations
- **Your usage**: ~10-20 GB/month (MVP)

### Railway (Free Trial)
- ✅ $5 credit/month
- ✅ ~500 hours uptime
- **Your usage**: ~$2-3/month (MVP)

### Supabase (Free)
- ✅ 500 MB database
- ✅ 5 GB bandwidth/month
- **Your usage**: ~100-200 MB, 1-2 GB bandwidth

**Total Cost**: **$0/month** for MVP ✅

---

## 📞 **Support & Resources**

### Documentation
- **This Guide**: Complete deployment steps
- **Railway Guide**: RAILWAY_DEPLOYMENT_GUIDE.md
- **Vercel Guide**: VERCEL_PROJECT_SETTINGS.md

### Official Docs
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Next.js: https://nextjs.org/docs

### Community
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://vercel.com/discord

---

## ✅ **Final Checklist**

Before you're done, verify:

**Vercel**:
- [ ] Project deployed successfully
- [ ] Root directory set to `client`
- [ ] Environment variables added (2 variables)
- [ ] Site loads without errors

**Railway**:
- [ ] Project deployed successfully
- [ ] Root directory set to `server`
- [ ] Environment variables added (13 variables)
- [ ] Health check returns 200 OK
- [ ] Logs show "Server is running"

**Integration**:
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] No CORS errors
- [ ] API requests go to Railway (not localhost)

**Database**:
- [ ] Supabase connection working
- [ ] Users table populated
- [ ] Data persists after logout/login

---

## 🎊 **Congratulations!**

You've successfully deployed your full-stack application!

**Your app is now live and accessible to users worldwide!** 🌍

Share your URL:
```
https://your-vercel-url.vercel.app
```

---

**Created**: 2025-10-19
**Last Updated**: 2025-10-19
**Status**: Production Ready ✅
