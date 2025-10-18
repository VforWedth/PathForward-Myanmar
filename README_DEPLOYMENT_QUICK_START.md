# Quick Start: Deploy to Vercel in 15 Minutes

## Fast Track Deployment Steps

### 1. Push to GitHub (5 minutes)
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/PathForwardMyanmar.git
git push -u origin main
```

### 2. Deploy on Vercel (5 minutes)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy" (don't change any settings yet)
4. Wait for deployment to complete

### 3. Add Environment Variables (5 minutes)
After first deployment:
1. Go to Project Settings → Environment Variables
2. Copy-paste these (replace YOUR_VERCEL_URL with your actual URL):

```env
NEXT_PUBLIC_API_URL=https://YOUR_VERCEL_URL.vercel.app/api
NODE_ENV=production
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.cgtnpglqjpedhjfcputl
DB_PASSWORD=hacktivators5
JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=https://YOUR_VERCEL_URL.vercel.app
REQUIRE_COMPANY_VERIFICATION=false
UPLOAD_PATH=/tmp/uploads
MAX_FILE_SIZE=5242880
```

3. Go to Deployments → Latest Deployment → ⋯ → Redeploy
4. Done!

### 4. Test Your Site
- Frontend: `https://YOUR_VERCEL_URL.vercel.app`
- API Health: `https://YOUR_VERCEL_URL.vercel.app/api/health`

## Important Notes

⚠️ **File Uploads**: Current file upload won't work on Vercel. You need to implement Supabase Storage or Cloudinary.

✅ **Database**: Already configured with Supabase - no changes needed!

✅ **Free Tier**: Supports 5,000-10,000 monthly active users

📖 **Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions

## Next Steps After Deployment

1. Test all features (login, register, job posting)
2. Implement cloud storage for file uploads (Supabase Storage recommended)
3. Set up email service (optional)
4. Add custom domain (optional)
5. Monitor usage in Vercel dashboard

**Questions?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for troubleshooting and detailed explanations.
