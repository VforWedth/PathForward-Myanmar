# Fix API Connection Issue on Vercel

## Problem
Your frontend is trying to connect to `http://localhost:5000/api` which doesn't exist in production. The frontend and backend need to communicate through Vercel's deployment URL.

---

## Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click on your project: **path-forward-myanmar**
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add/Update Environment Variables

You need to add these environment variables. Click **Add New** for each:

#### Frontend Environment Variables

**Variable 1:**
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app/api`
- **Environment**: Select all (Production, Preview, Development)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SERVER_URL`
- **Value**: `https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app`
- **Environment**: Select all (Production, Preview, Development)

#### Backend Environment Variables (Copy from your .env file)

**Variable 3:**
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production only

**Variable 4:**
- **Name**: `DB_HOST`
- **Value**: `aws-1-ap-southeast-1.pooler.supabase.com`
- **Environment**: All

**Variable 5:**
- **Name**: `DB_PORT`
- **Value**: `6543`
- **Environment**: All

**Variable 6:**
- **Name**: `DB_NAME`
- **Value**: `postgres`
- **Environment**: All

**Variable 7:**
- **Name**: `DB_USER`
- **Value**: `postgres.cgtnpglqjpedhjfcputl`
- **Environment**: All

**Variable 8:**
- **Name**: `DB_PASSWORD`
- **Value**: `hacktivators5`
- **Environment**: All
- **⚠️ IMPORTANT**: You should change this password after testing!

**Variable 9:**
- **Name**: `JWT_SECRET`
- **Value**: `pathforward_myanmar_secret_key_2024_change_this_in_production`
- **Environment**: All

**Variable 10:**
- **Name**: `JWT_EXPIRE`
- **Value**: `7d`
- **Environment**: All

**Variable 11:**
- **Name**: `CLIENT_URL`
- **Value**: `https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app`
- **Environment**: All

**Variable 12:**
- **Name**: `REQUIRE_COMPANY_VERIFICATION`
- **Value**: `false`
- **Environment**: All

**Variable 13:**
- **Name**: `UPLOAD_PATH`
- **Value**: `/tmp/uploads`
- **Environment**: All

**Variable 14:**
- **Name**: `MAX_FILE_SIZE`
- **Value**: `5242880`
- **Environment**: All

### Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. ✅ **UNCHECK** "Use existing build cache"
6. Click **Redeploy**

Wait 2-5 minutes for the deployment to complete.

---

## Alternative: Use Custom Domain (Recommended for Production)

If you plan to use a custom domain, update these variables:

1. Set up your custom domain in Vercel (Settings → Domains)
2. Update these environment variables:
   - `NEXT_PUBLIC_API_URL` → `https://yourdomain.com/api`
   - `NEXT_PUBLIC_SERVER_URL` → `https://yourdomain.com`
   - `CLIENT_URL` → `https://yourdomain.com`
3. Redeploy

---

## Quick Copy-Paste Guide

Here's a quick reference for environment variables:

```env
# Frontend
NEXT_PUBLIC_API_URL=https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app/api
NEXT_PUBLIC_SERVER_URL=https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app

# Backend
NODE_ENV=production
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.cgtnpglqjpedhjfcputl
DB_PASSWORD=hacktivators5
JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app
REQUIRE_COMPANY_VERIFICATION=false
UPLOAD_PATH=/tmp/uploads
MAX_FILE_SIZE=5242880
```

---

## Testing After Fix

Once redeployed, test these:

1. **API Health Check**:
   Visit: `https://your-vercel-url.vercel.app/api/health`
   Should return: `{"success": true, "message": "PathForward Myanmar API is running"}`

2. **Register**: Try creating a student account

3. **Login**: Try logging in with the created account

---

## Common Issues & Solutions

### Issue 1: "Network Error" when registering/logging in
- **Cause**: Environment variables not set
- **Fix**: Complete Step 2 above and redeploy

### Issue 2: "Cannot connect to database"
- **Cause**: Database credentials incorrect
- **Fix**: Double-check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in Vercel

### Issue 3: CORS errors in browser console
- **Cause**: CLIENT_URL not matching your Vercel URL
- **Fix**: Update CLIENT_URL environment variable and redeploy

### Issue 4: 404 on API endpoints
- **Cause**: Vercel routing not configured properly
- **Fix**: Our vercel.json should handle this, but if it persists, check the Routes section

---

## Verification Checklist

- [ ] Added all 14 environment variables in Vercel
- [ ] Selected correct environments (Production/Preview/Development)
- [ ] Redeployed without cache
- [ ] Tested `/api/health` endpoint
- [ ] Tested user registration
- [ ] Tested user login

---

## Need Help?

If you're still having issues after following this guide:

1. Check Vercel Function Logs:
   - Go to your deployment
   - Click "View Function Logs"
   - Look for error messages

2. Check browser console:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for network errors

3. Common error messages and what they mean:
   - "Network Error" → API URL not set correctly
   - "401 Unauthorized" → CORS issue or AUTH issue
   - "500 Internal Server Error" → Database connection issue

---

**Last Updated**: 2025-10-19
**Your Vercel URL**: https://path-forward-myanmar-5qtvifmmj-phone-moe-htets-projects.vercel.app
