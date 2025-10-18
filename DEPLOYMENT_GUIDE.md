# PathForward Myanmar - Vercel Deployment Guide

## Overview
This guide covers deploying your full-stack application (Next.js frontend + Express backend) to Vercel with Supabase PostgreSQL database.

## Architecture
- **Frontend**: Next.js 14 (deployed to Vercel)
- **Backend**: Express.js API (deployed as Vercel Serverless Functions)
- **Database**: Supabase PostgreSQL (already configured)
- **File Storage**: Local uploads (will need migration to cloud storage for production)

---

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** (free tier available at https://vercel.com)
3. **Supabase Account** (already set up)
4. **Git** installed locally

---

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit for deployment"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "PathForwardMyanmar")
   - Don't initialize with README (you already have code)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/PathForwardMyanmar.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended for Beginners)

1. **Go to Vercel**:
   - Visit https://vercel.com/new
   - Sign in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository "PathForwardMyanmar"
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: Leave default or use: `cd client && npm install && npm run build`
   - **Output Directory**: `client/.next`
   - **Install Command**: Leave default

4. **Add Environment Variables**:
   Click "Environment Variables" and add these:

   **For Frontend (Client)**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_PROJECT_NAME.vercel.app/api
   ```

   **For Backend (Server)**:
   ```
   NODE_ENV=production
   PORT=5000

   DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
   DB_PORT=6543
   DB_NAME=postgres
   DB_USER=postgres.cgtnpglqjpedhjfcputl
   DB_PASSWORD=hacktivators5

   JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
   JWT_EXPIRE=7d

   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password

   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=/tmp/uploads

   CLIENT_URL=https://YOUR_PROJECT_NAME.vercel.app

   REQUIRE_COMPANY_VERIFICATION=false
   ```

   **IMPORTANT**: Replace `YOUR_PROJECT_NAME` with your actual Vercel project URL (you'll get this after first deployment)

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-5 minutes for build to complete
   - You'll get a URL like: `https://your-project-name.vercel.app`

6. **Update Environment Variables with Actual URL**:
   - After first deployment, copy your Vercel URL
   - Go to Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` and `CLIENT_URL` with your actual URL
   - Redeploy (Settings → Deployments → ... → Redeploy)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd c:\Projects\PathForwardMyanmar
vercel
```

4. **Follow Prompts**:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? PathForwardMyanmar (or your choice)
   - Directory with code? `./`
   - Override settings? No

5. **Add Environment Variables**:
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add DB_HOST
# ... (add all variables from Step 2, Option A)
```

6. **Deploy to Production**:
```bash
vercel --prod
```

---

## Step 3: Configure Vercel Project Settings

1. **Go to Project Settings**:
   - Visit https://vercel.com/dashboard
   - Select your project
   - Go to "Settings"

2. **Root Directory Configuration**:
   - Set root directory to `client` if deploying frontend only
   - Or leave as `./` for monorepo setup

3. **Build Settings**:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/.next`
   - **Install Command**: `npm install`

4. **Functions Configuration**:
   - Region: Select closest to your users (Singapore for Myanmar)
   - Max Duration: 10s (Hobby) or 60s (Pro)

---

## Step 4: Verify Deployment

1. **Test Frontend**:
   - Visit `https://your-project-name.vercel.app`
   - Check if homepage loads

2. **Test Backend API**:
   - Visit `https://your-project-name.vercel.app/api/health`
   - Should return: `{"success": true, "message": "PathForward Myanmar API is running"}`

3. **Test Database Connection**:
   - Try logging in or registering a user
   - Check if data is saved to Supabase

4. **Check Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → "View Function Logs"
   - Check for any errors

---

## Step 5: Configure Custom Domain (Optional)

1. **Go to Project Settings → Domains**
2. **Add Domain**:
   - Enter your domain (e.g., `pathforward-myanmar.com`)
   - Follow DNS configuration instructions
3. **Update Environment Variables**:
   - Update `CLIENT_URL` and `NEXT_PUBLIC_API_URL` with new domain

---

## Important Considerations for Production

### 1. File Uploads Issue
Your current backend uses local file storage (`./uploads`), which **won't work on Vercel** (serverless is stateless).

**Solutions**:
- **Option A**: Use **Vercel Blob Storage** (paid)
- **Option B**: Use **Cloudinary** (free tier available)
- **Option C**: Use **AWS S3** or **Supabase Storage** (free tier available)

**Recommended**: Supabase Storage (since you're already using Supabase)
- 1GB free storage
- CDN included
- Easy integration

### 2. Database Connection Pooling
Serverless functions create new connections frequently. Configure Supabase:
- Use connection pooler (you're already using port 6543 - correct!)
- Set `max_connections` appropriately
- Consider using `pg-pool` or Sequelize connection pool

### 3. Cold Starts
First request after inactivity may be slow (2-5 seconds). Solutions:
- Use Vercel Pro (reduces cold starts)
- Implement caching strategies
- Use Vercel Edge Functions for critical endpoints

### 4. Environment Variables Security
**NEVER** commit `.env` files to Git. Current status:
- ✅ `.env` files are in `.gitignore`
- ⚠️ Change `JWT_SECRET` and database password before sharing repo
- ⚠️ Use different credentials for production vs development

### 5. CORS Configuration
Your backend CORS is configured for single origin. For production:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```
This is already correct in your code.

---

## Continuous Deployment

After initial setup, Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request
- **Development**: Every push to other branches

To deploy manually:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically build and deploy within 2-5 minutes.

---

## Monitoring & Debugging

### View Logs
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments"
3. Click on latest deployment
4. Click "View Function Logs"

### Common Issues

**Issue 1: "Cannot connect to database"**
- Check Supabase credentials in Vercel env variables
- Ensure you're using the connection pooler (port 6543)
- Check Supabase dashboard for connection limits

**Issue 2: "API endpoint not found"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check `vercel.json` routing configuration
- Test API endpoint directly: `https://your-url.vercel.app/api/health`

**Issue 3: "Build failed"**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Issue 4: "File upload failed"**
- Serverless functions can't persist files locally
- Implement cloud storage (Supabase Storage, Cloudinary, etc.)

---

## Cost Estimation for MVP

### Vercel (Hobby - Free Tier)
- ✅ **Bandwidth**: 100 GB/month
- ✅ **Deployments**: Unlimited
- ✅ **Serverless Function Execution**: 100 GB-hours
- ✅ **Invocations**: 1 million/month
- ✅ **Custom domains**: Included
- ⚠️ **Limitations**:
  - 10s function timeout
  - 50MB function size
  - Commercial use allowed

**Estimated Traffic Support**: 5,000-10,000 monthly active users

### Supabase (Free Tier)
- ✅ **Database**: 500MB storage
- ✅ **Bandwidth**: 5GB/month
- ✅ **Storage**: 1GB (if using Supabase Storage)
- ⚠️ **Paused after 7 days inactivity** (can be reactivated)

### Total Cost: $0/month for MVP
**Can scale to Pro plans when needed**:
- Vercel Pro: $20/month (60s timeouts, better performance)
- Supabase Pro: $25/month (8GB database, no pause)

---

## Performance Optimization Tips

1. **Enable Caching**:
   - Use Next.js built-in caching
   - Implement Redis for session management (Upstash free tier)

2. **Image Optimization**:
   - Use Next.js `<Image>` component
   - Enable automatic image optimization

3. **Code Splitting**:
   - Next.js does this automatically
   - Use dynamic imports for large components

4. **Database Optimization**:
   - Add proper indexes to Supabase tables
   - Use query optimization
   - Implement pagination for large datasets

5. **API Response Caching**:
   - Cache static data (job listings, etc.)
   - Use `stale-while-revalidate` strategy

---

## Recommendation for MVP

### ✅ **YES, Use Vercel for MVP!**

**Reasons**:
1. **Free tier is generous** - supports 5k-10k users
2. **Already using Supabase** - perfect combo
3. **Zero DevOps** - focus on features, not infrastructure
4. **Excellent DX** - automatic deployments, preview URLs
5. **Fast globally** - CDN included
6. **Easy scaling** - upgrade when needed

**Timeline to Deploy**: 30-60 minutes

**When to Migrate**:
- When hitting free tier limits (>10k MAU)
- Need longer function timeouts (>10s)
- Need dedicated infrastructure

**User Experience**:
- ✅ Fast page loads (Next.js optimization)
- ✅ Good for Myanmar users (Singapore region)
- ⚠️ First API call may be slow (cold start)
- ✅ Subsequent calls fast

---

## Post-Deployment Checklist

- [ ] Test all user flows (login, registration, job posting, applications)
- [ ] Verify database connections work
- [ ] Test API endpoints
- [ ] Check error handling and logging
- [ ] Set up monitoring (Vercel Analytics - free)
- [ ] Configure custom domain (optional)
- [ ] Implement file upload solution (Supabase Storage)
- [ ] Set up email service (SendGrid, Mailgun, or Resend)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Create backup strategy for database
- [ ] Document API endpoints
- [ ] Set up status page (optional)

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/support

---

## Quick Commands Reference

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel list

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull

# Remove deployment
vercel remove
```

---

**Good luck with your deployment! 🚀**

For questions or issues, check Vercel logs and Supabase dashboard first.
