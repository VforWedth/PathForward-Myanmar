# Deployment Options for PathForward Myanmar

## Current Issue
Your frontend and backend can't communicate because they're deployed as a monorepo but the API routing isn't working properly.

---

## RECOMMENDED: Option 1 - Split Deployment (Easiest & Best)

Deploy frontend and backend separately:

### Frontend → Vercel
### Backend → Railway (Free tier)

**Why this is better:**
- ✅ Simpler configuration
- ✅ Backend runs continuously (no cold starts)
- ✅ File uploads work properly
- ✅ Easier to debug
- ✅ **FREE for MVP**

---

## How to Deploy (Option 1)

### Part A: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose** your PathForward-Myanmar repo
6. **Select** `server` directory as root
7. **Add Environment Variables**:
   ```
   DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
   DB_PORT=6543
   DB_NAME=postgres
   DB_USER=postgres.cgtnpglqjpedhjfcputl
   DB_PASSWORD=hacktivators5
   JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-vercel-url.vercel.app
   PORT=5000
   NODE_ENV=production
   REQUIRE_COMPANY_VERIFICATION=false
   ```

8. **Click Deploy**
9. **Copy the Railway URL** (e.g., `https://your-app.railway.app`)

### Part B: Update Vercel Frontend

1. **Go to Vercel** → Your Project → Settings → Environment Variables
2. **Add/Update**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
   NEXT_PUBLIC_SERVER_URL=https://your-railway-app.railway.app
   ```
3. **Redeploy** Vercel

### Part C: Update Railway Backend

1. Go back to **Railway** → Environment Variables
2. **Update**:
   ```
   CLIENT_URL=https://your-vercel-url.vercel.app
   ```
3. **Redeploy** Railway

**Done!** Your app should work now.

---

## Option 2 - Full Vercel (Requires More Setup)

Keep everything on Vercel but requires converting backend to serverless.

### What needs to change:

1. **Move backend into Next.js API routes** (`client/src/app/api/`)
2. **Rewrite all Express routes** as Next.js API routes
3. **Handle file uploads** with Vercel Blob Storage
4. **Manage database connections** for serverless

**Effort**: 4-8 hours of work
**Recommended**: Only if you prefer all-in-one platform

---

## Option 3 - Render (Alternative to Railway)

Same as Option 1, but use Render.com instead of Railway:

1. **Go to Render**: https://render.com/
2. **New Web Service**
3. **Connect GitHub repo**
4. **Root Directory**: `server`
5. **Build Command**: `pnpm install`
6. **Start Command**: `node src/index.js`
7. **Add environment variables** (same as Railway)
8. **Deploy**

**Free tier**: 750 hours/month (enough for MVP)

---

## Comparison

| Feature | Railway | Render | Vercel Only |
|---------|---------|--------|-------------|
| Setup Time | 10 min | 10 min | 4-8 hours |
| Cold Starts | No | Yes | Yes |
| File Uploads | ✅ Works | ✅ Works | ❌ Need cloud storage |
| Free Tier | ✅ Good | ✅ Good | ✅ Good |
| Maintenance | Easy | Easy | Medium |
| Best For | MVP | MVP | Long-term |

---

## My Strong Recommendation

**Use Option 1 (Railway + Vercel)**

**Reasons:**
1. ⏱️ **10 minutes setup** vs 4-8 hours
2. ✅ **Works with your current code** - no changes needed
3. 🚀 **No cold starts** - better user experience
4. 💰 **Free** for your MVP scale
5. 🔧 **Easier to debug** - separate logs for frontend/backend

---

## Quick Setup Commands

I can help you set this up! Just follow the Railway guide above, and I'll help you:
1. Update environment variables
2. Test the connection
3. Verify everything works

Let me know when you're ready!
