# Vercel Project Settings Configuration

## How to Fix the "No Next.js version detected" Error

---

## Problem
Vercel can't find Next.js because your project is a monorepo with the Next.js app in the `client` folder.

## Solution
Configure Vercel project settings to point to the correct directory.

---

## Step-by-Step Configuration

### Step 1: Go to Project Settings

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project**: `path-forward-myanmar`
3. **Click "Settings"** tab
4. **Click "General"** in the left sidebar

### Step 2: Configure Root Directory

Scroll down to **"Root Directory"** section:

1. **Click "Edit"**
2. **Enter**: `client`
3. **Click "Save"**

This tells Vercel that your Next.js app is in the `client` folder.

### Step 3: Configure Build Settings

Scroll to **"Build & Development Settings"**:

**Framework Preset**:
- Select: **Next.js**

**Build Command**:
- Leave default or use: `pnpm run build`

**Output Directory**:
- Leave default: `.next`

**Install Command**:
- Leave default or use: `pnpm install`

**Development Command**:
- Leave default: `pnpm dev`

### Step 4: Add Environment Variables

Still in Settings, click **"Environment Variables"** in the left sidebar:

**Add these variables** (if not already added):

1. **NEXT_PUBLIC_API_URL**
   - Value: `https://your-railway-url.up.railway.app/api`
   - Environment: All (Production, Preview, Development)

2. **NEXT_PUBLIC_SERVER_URL**
   - Value: `https://your-railway-url.up.railway.app`
   - Environment: All (Production, Preview, Development)

**Note**: Replace `your-railway-url` with your actual Railway URL.

### Step 5: Redeploy

1. **Go to "Deployments"** tab
2. **Click the ⋯ (three dots)** on the latest deployment
3. **Click "Redeploy"**
4. **UNCHECK** "Use existing build cache"
5. **Click "Redeploy"**

---

## Expected Build Output

After redeployment, you should see:

```
✅ Detected Next.js version: 14.2.33
✅ Installing dependencies with pnpm
✅ Running "pnpm run build"
✅ Creating an optimized production build
✅ Compiled successfully
✅ Linting and checking validity of types
✅ Build completed in XXs
```

---

## Verification

After successful deployment:

1. **Test Homepage**: Visit `https://your-vercel-url.vercel.app`
   - Should load without errors

2. **Test API Connection**: Open browser DevTools (F12) → Console
   - Try to register/login
   - Check if API calls go to your Railway URL (not localhost)

3. **Test Registration**:
   - Go to `/register/student`
   - Fill out form and submit
   - Should create account successfully

---

## Troubleshooting

### Issue 1: Still getting "No Next.js version detected"

**Cause**: Root Directory not set correctly

**Fix**:
1. Go to Settings → General → Root Directory
2. Make sure it says `client` (not `./client` or `/client`)
3. Save and redeploy

---

### Issue 2: Build succeeds but site is blank

**Cause**: Output directory wrong

**Fix**:
1. Settings → Build & Development Settings
2. Output Directory should be `.next` (default)
3. Redeploy

---

### Issue 3: "Module not found" errors during build

**Cause**: Dependencies not installed

**Fix**:
1. Check that Install Command is set
2. Try: `pnpm install --no-frozen-lockfile`
3. Redeploy without cache

---

### Issue 4: Environment variables not working

**Symptoms**: API calls still going to `localhost:5000`

**Fix**:
1. Go to Settings → Environment Variables
2. Check `NEXT_PUBLIC_API_URL` is set correctly
3. Make sure it's enabled for "Production"
4. Redeploy (environment changes require redeploy)

---

## Complete Settings Checklist

Before redeploying, verify these settings:

- [ ] **Root Directory**: `client`
- [ ] **Framework Preset**: Next.js
- [ ] **Build Command**: `pnpm run build` (or default)
- [ ] **Output Directory**: `.next` (or default)
- [ ] **Install Command**: `pnpm install` (or default)
- [ ] **Environment Variables**:
  - [ ] NEXT_PUBLIC_API_URL (with Railway URL)
  - [ ] NEXT_PUBLIC_SERVER_URL (with Railway URL)

---

## Alternative: Use package.json in Root

If you prefer to keep the project structure as is, you can create a minimal `package.json` in the root:

**File**: `package.json` (in root directory)
```json
{
  "name": "pathforward-myanmar",
  "private": true,
  "scripts": {
    "build": "cd client && pnpm run build",
    "dev": "cd client && pnpm run dev",
    "start": "cd client && pnpm run start"
  }
}
```

Then in Vercel settings:
- **Root Directory**: Leave empty (or `.`)
- **Build Command**: `pnpm run build`

**Not recommended** because it's more complex than just setting Root Directory.

---

## Current Configuration Summary

**Your Setup**:
- **Monorepo Structure**: Frontend in `client/`, Backend in `server/`
- **Frontend**: Next.js 14 on Vercel
- **Backend**: Express.js on Railway
- **Database**: PostgreSQL on Supabase

**Vercel Configuration**:
- Root Directory: `client`
- Framework: Next.js
- Build: `pnpm run build`
- Environment Variables: Point to Railway backend

**Railway Configuration**:
- Root Directory: `server`
- Start Command: `node src/index.js`
- Environment Variables: Database + Vercel URL

---

## Quick Fix Summary

```
1. Vercel Dashboard → Your Project → Settings → General
2. Root Directory: client
3. Save
4. Settings → Environment Variables
5. Add NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SERVER_URL
6. Deployments → Latest → Redeploy (no cache)
```

**Time**: 2 minutes
**Difficulty**: Easy

---

**Last Updated**: 2025-10-19
**Status**: Frontend-only deployment to Vercel
