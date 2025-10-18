# Quick Fix Guide: API Connection Issue

## Problem

Your Vercel deployment is working, but login/registration fails with this error:
```
Registration error: SyntaxError: JSON.parse: unexpected end of data at line 1 column 1
```

**Root Cause**: Environment variables in Vercel are missing the `https://` protocol.

**Current (Wrong)**:
- `NEXT_PUBLIC_API_URL` = `pathforward-myanmar.up.railway.app/api`
- `NEXT_PUBLIC_SERVER_URL` = `pathforward-myanmar.up.railway.app`

**Should Be**:
- `NEXT_PUBLIC_API_URL` = `https://pathforward-myanmar.up.railway.app/api`
- `NEXT_PUBLIC_SERVER_URL` = `https://pathforward-myanmar.up.railway.app`

This causes malformed URLs like:
```
❌ https://path-forward-mm.vercel.app/pathforward-myanmar.up.railway.app/api/auth/login
✅ https://pathforward-myanmar.up.railway.app/api/auth/login
```

---

## Quick Fix (5 Minutes)

### Step 1: Get Your Railway URL

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your **PathForward Myanmar** project
3. Click on your **backend service**
4. Click on **Settings** tab
5. Scroll to **Domains** section
6. Copy the URL (should look like: `pathforward-myanmar.up.railway.app`)

### Step 2: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **path-forward-myanmar** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 3: Update NEXT_PUBLIC_API_URL

Find the `NEXT_PUBLIC_API_URL` variable:

1. Click the **⋯** (three dots) next to it
2. Click **Edit**
3. Change the value to: `https://pathforward-myanmar.up.railway.app/api`
   - **IMPORTANT**: Include `https://` at the start
   - **IMPORTANT**: Include `/api` at the end
4. Make sure it's enabled for **Production**, **Preview**, and **Development**
5. Click **Save**

### Step 4: Update NEXT_PUBLIC_SERVER_URL

Find the `NEXT_PUBLIC_SERVER_URL` variable:

1. Click the **⋯** (three dots) next to it
2. Click **Edit**
3. Change the value to: `https://pathforward-myanmar.up.railway.app`
   - **IMPORTANT**: Include `https://` at the start
   - **NO** `/api` at the end
4. Make sure it's enabled for **Production**, **Preview**, and **Development**
5. Click **Save**

### Step 5: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the **⋯** (three dots) on the **latest deployment**
3. Click **Redeploy**
4. **UNCHECK** "Use existing build cache"
5. Click **Redeploy**

Wait for the deployment to complete (usually 1-2 minutes).

---

## Verification Checklist

After redeployment, test these:

### Test 1: Check Environment Variables

Open your deployed site's browser console (F12 → Console):
- You should see: `✅ All environment variables are properly configured`
- If not, check for warnings/errors

### Test 2: Test Registration

1. Go to: `https://your-vercel-url.vercel.app/register/student`
2. Fill out the registration form
3. Submit
4. **Expected**: Success message and redirect to dashboard
5. **If it fails**: Open DevTools (F12) → Network tab → Check the request URL

### Test 3: Test Login

1. Go to: `https://your-vercel-url.vercel.app/login`
2. Enter credentials
3. Submit
4. **Expected**: Success and redirect to dashboard

### Test 4: Check Network Request

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to register or login
4. Find the `/register` or `/login` request
5. Check the **Request URL**

**Should Look Like**:
```
✅ https://pathforward-myanmar.up.railway.app/api/auth/register
```

**Should NOT Look Like**:
```
❌ https://path-forward-mm.vercel.app/pathforward-myanmar.up.railway.app/api/auth/register
```

---

## What Was Fixed in Code

The code now has automatic safeguards:

### 1. URL Normalization ([api.ts:7-30](client/src/lib/api.ts#L7-L30))
Automatically adds `https://` if missing from environment variables.

### 2. Environment Validation ([api.ts:35-60](client/src/lib/api.ts#L35-L60))
Checks environment variables and logs helpful warnings.

### 3. Production Checks
Ensures production URLs use HTTPS and don't point to localhost.

**This means**: Even if you forget the protocol next time, the code will automatically add it and warn you.

---

## Troubleshooting

### Issue 1: Still getting JSON parse error

**Check**:
1. Vercel environment variables have `https://` prefix
2. Railway backend is running (check Railway logs)
3. CORS is configured correctly in Railway

**Railway Environment Variables Should Have**:
```
CLIENT_URL=https://path-forward-mm.vercel.app
```
(No trailing slash!)

### Issue 2: "Failed to fetch" error

**Cause**: CORS issue or backend is down

**Fix**:
1. Check Railway logs for errors
2. Verify Railway `CLIENT_URL` matches your Vercel URL exactly
3. Test backend directly: `https://your-railway-url.up.railway.app/api/health`

### Issue 3: Environment variables not updating

**Cause**: Changes require redeployment

**Fix**:
1. After changing ANY environment variable in Vercel
2. You MUST redeploy (Settings → Deployments → Redeploy)
3. Make sure to uncheck "Use existing build cache"

### Issue 4: Console shows warnings about URLs

**If you see**: `⚠️ URL missing protocol`
- This is okay! The code automatically fixes it
- But you should still update Vercel env vars to remove the warning

**If you see**: `❌ Production API URL should start with "https://"`
- You MUST fix this - update the Vercel environment variable

---

## Expected Console Output

After fixing, you should see in browser console:

**Development**:
```
✅ All environment variables are properly configured
🔧 Current Environment Configuration:
  API URL: https://pathforward-myanmar.up.railway.app/api
  Server URL: https://pathforward-myanmar.up.railway.app
  Environment: production
```

**No Errors or Warnings** = Everything is working correctly!

---

## Before and After

### Before (Broken)

**Vercel Environment Variables**:
```
NEXT_PUBLIC_API_URL=pathforward-myanmar.up.railway.app/api
NEXT_PUBLIC_SERVER_URL=pathforward-myanmar.up.railway.app
```

**Result**:
```
❌ URL: https://path-forward-mm.vercel.app/pathforward-myanmar.up.railway.app/api/auth/login
❌ Status: 405 Method Not Allowed
❌ Response: (empty)
```

### After (Fixed)

**Vercel Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://pathforward-myanmar.up.railway.app/api
NEXT_PUBLIC_SERVER_URL=https://pathforward-myanmar.up.railway.app
```

**Result**:
```
✅ URL: https://pathforward-myanmar.up.railway.app/api/auth/login
✅ Status: 200 OK
✅ Response: {"success": true, "token": "...", ...}
```

---

## Summary

**What You Need to Do**:
1. Add `https://` to both environment variables in Vercel
2. Redeploy without cache
3. Test registration and login

**Time Required**: 5 minutes

**Difficulty**: Easy - just copy/paste the correct URLs

---

## Still Having Issues?

If you still get errors after following this guide:

1. **Check Railway Logs**:
   - Railway Dashboard → Your Project → Backend Service → Logs
   - Try to register while watching the logs
   - Copy any errors you see

2. **Check Browser Console**:
   - F12 → Console tab
   - Copy any errors or warnings

3. **Check Browser Network Tab**:
   - F12 → Network tab
   - Try to register
   - Click on the failed request
   - Screenshot the Headers and Response

Share these details so we can diagnose the issue!

---

**Last Updated**: 2025-10-19
**Status**: Ready to deploy
