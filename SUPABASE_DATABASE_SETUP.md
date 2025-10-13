# ☁️ Supabase Database Setup Guide

**Complete Guide to Using Supabase PostgreSQL for Team Collaboration**

Supabase provides a **free hosted PostgreSQL database** perfect for team development. No local network issues, no configuration headaches!

---

## 🎯 Why Supabase?

### ✅ Advantages:
- **Works from anywhere** - Team members can work from home, café, different cities
- **Always available** - No need for one person to host
- **Zero network configuration** - No firewall, no IP addresses, no port forwarding
- **Automatic backups** - Daily backups included
- **Built-in monitoring** - See database activity in real-time
- **SSL/TLS encryption** - Secure connections by default
- **Free tier generous** - 500MB database, 2GB bandwidth/month
- **Scalable** - Easy to upgrade if needed

### 📊 Free Tier Limits:
- **Database size:** 500MB
- **Bandwidth:** 2GB/month
- **Concurrent connections:** Unlimited
- **Projects:** 2 organizations
- **Paused after:** 1 week of inactivity (auto-resumes on access)

**Perfect for development!** 🎉

---

# 🚀 PART 1: SETUP SUPABASE (One Person - Usually Team Lead)

## Step 1: Create Supabase Account

1. **Go to:** https://supabase.com
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - **GitHub** (Recommended - fastest)
   - **Google**
   - **Email**

**✅ Completely free, no credit card required!**

---

## Step 2: Create New Project

After signing in:

1. Click **"New Project"**
2. Fill in details:
   - **Name:** `PathForward Myanmar` or `pathforward-myanmar`
   - **Database Password:** Generate a strong password
     - Click the generate button 🎲 OR
     - Use a strong password like: `PathForward2025!Secure`
   - **Region:** Choose closest to Myanmar:
     - **Southeast Asia (Singapore)** - Best for Myanmar
     - **South Asia (Mumbai)** - Also good
   - **Pricing Plan:** **Free** (already selected)

3. **📝 IMPORTANT: Copy and save the database password!**
   - You'll need it for `.env` configuration
   - Write it down somewhere safe
   - You won't be able to see it again!

4. Click **"Create new project"**

**⏱️ Wait 2-3 minutes** for project to be created (shows loading screen)

**✅ When done, you'll see your project dashboard!**

---

## Step 3: Get Database Connection Details

### Option A: Connection String (Easiest)

1. In your project dashboard, click **"Connect"** button (top right)
2. Or go to: **Settings** → **Database**
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. You'll see something like:

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Copy this entire string!**

### Option B: Individual Connection Details

If you prefer individual values, find these in **Settings → Database**:

```
Host: db.abcdefghijklmnop.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [your-password-from-step-2]
```

**📝 Copy all these values!**

---

## Step 4: Verify Database is Ready

1. In Supabase dashboard, click **"Table Editor"** (left sidebar)
2. You'll see an empty database (no tables yet)
3. This is normal - we'll create tables next!

**✅ Database is ready!**

---

## Step 5: Configure Local Project for Supabase

### Update server/.env file:

```powershell
cd C:\Projects\PathForwardMyanmar\server
notepad .env
```

**Edit .env with Supabase credentials:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL Database Configuration
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=PathForward2025!Secure

# JWT Secret (generate a strong one)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025
JWT_EXPIRE=7d

# Email Configuration (optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Key changes:**
- `DB_HOST` → Your Supabase host (from Step 3)
- `DB_NAME` → `postgres` (default Supabase database name)
- `DB_USER` → `postgres` (default Supabase user)
- `DB_PASSWORD` → Your project password from Step 2

**Save and close**

---

## Step 6: Update Backend Configuration (SSL Required)

Supabase requires SSL connections. Update database config:

**Edit:** `server/src/config/database.js`

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // SSL configuration for Supabase
    dialectOptions: {
      ssl: process.env.DB_HOST.includes('supabase.co') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
```

**What changed:**
- Added `dialectOptions` with SSL configuration
- Auto-detects Supabase and enables SSL
- Still works with local PostgreSQL (SSL disabled)

**Save the file**

---

## Step 7: Test Connection

```powershell
cd C:\Projects\PathForwardMyanmar\server

# Test connection to Supabase
pnpm check-db
```

**Expected output:**
```
🔍 PostgreSQL Connection Checker

📋 Current Configuration from .env:
Host: db.abcdefghijklmnop.supabase.co
Port: 5432
Database: postgres
User: postgres

🧪 Test 1: Connecting to default postgres database...
✅ Successfully connected to PostgreSQL!

📊 PostgreSQL Version:
PostgreSQL 15.x.x on x86_64-pc-linux-gnu, compiled by gcc...

✅ Diagnostics Complete!
```

**✅ If you see success, connection works!**

---

## Step 8: Create Database Tables

```powershell
# Run migration to create all tables
pnpm migrate
```

**Expected output:**
```
🔄 Starting database migration...
✅ Database connection established successfully.
✅ Database migration completed successfully!
📊 All models synchronized
```

---

## Step 9: Verify Tables Created

**Option A: Command Line**
```powershell
pnpm check-db
```

**Should show:**
```
📊 Found 13 tables:
   - applications
   - certificates
   - companies
   - education
   - experience
   - feedbacks
   - freelancers
   - jobs
   - reviews
   - students
   - universities
   - university_company_connections
   - users
✅ All 13 tables exist! Database is ready!
```

**Option B: Supabase Dashboard**
1. Go to Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. You should see all 13 tables listed!

**✅ Database is ready for team!**

---

## Step 10: Start Backend Server

```powershell
cd server
pnpm dev
```

**Expected output:**
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
📍 Environment: development
```

**✅ Success! Your backend is connected to Supabase!**

---

## Step 11: Test with Frontend

**Open new terminal:**
```powershell
cd client
pnpm install
pnpm dev
```

**Open browser:** `http://localhost:3000`

**Test registration:**
1. Click "Register"
2. Create test account
3. Should succeed!

**Verify in Supabase:**
1. Go to Supabase dashboard
2. Click **"Table Editor"** → **"users"**
3. You should see your test user!

**✅ Everything works!**

---

# 👥 PART 2: SHARE WITH TEAM MEMBERS

## Step 1: Prepare Team Configuration File

**Create a file:** `team-supabase-config.txt` (Don't commit to Git!)

```txt
🔐 PathForward Myanmar - Supabase Database Configuration
═══════════════════════════════════════════════════════

📊 Database Connection Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Host:     db.abcdefghijklmnop.supabase.co
Port:     5432
Database: postgres
User:     postgres
Password: PathForward2025!Secure

🔑 JWT Secret (must be same for everyone):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025

📋 Instructions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Clone repository
2. Copy these values to server/.env
3. Run: pnpm install
4. Run: pnpm check-db (to verify connection)
5. Run: pnpm dev (to start server)

⚠️ Important Notes:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- DO NOT run `pnpm setup` - Database is already set up!
- DO NOT run `pnpm migrate` - Tables already exist!
- Just run `pnpm install` and `pnpm dev`
- Everyone uses the SAME database
- All changes sync in real-time

🔒 Security:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Keep this file private (WhatsApp/Teams only)
- DO NOT commit .env to Git
- DO NOT share publicly
```

---

## Step 2: Share Configuration Securely

**Choose secure method:**

### Option A: Encrypted Sharing (Best)
1. Use **LastPass Notes**, **1Password Secure Notes**, or **Bitwarden Send**
2. Share link with team

### Option B: Private Team Chat
1. Send in **WhatsApp group** (private)
2. Or **Microsoft Teams** private chat
3. Or **Discord** private channel

### Option C: In-Person
1. USB drive
2. Show on screen (team members type)

**❌ NEVER share in:**
- Public Slack channels
- Public Discord
- Email (can be forwarded)
- GitHub repository
- Social media

---

# 🔧 PART 3: TEAM MEMBER SETUP

## Step 1: Clone Repository (if not done)

```powershell
git clone <repository-url>
cd PathForwardMyanmar
```

---

## Step 2: Configure .env File

```powershell
cd server
notepad .env
```

**Paste configuration from team lead:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL Database
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=PathForward2025!Secure

# JWT Secret (MUST BE SAME AS TEAM LEAD!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**✅ Make sure all values match team lead's config!**

**Save and close**

---

## Step 3: Update Database Config (SSL Support)

**Edit:** `server/src/config/database.js`

**The file should already have SSL support** (team lead updated it). Verify it looks like this:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // SSL configuration for cloud databases (Supabase, Heroku, etc.)
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
```

**✅ This enables SSL for Supabase while keeping local PostgreSQL working!**

---

## Step 4: Install Dependencies

```powershell
cd C:\Projects\PathForwardMyanmar\server

# Install all dependencies
pnpm install
```

---

## Step 5: Test Connection

```powershell
# Test connection to Supabase
pnpm check-db
```

**Expected output:**
```
🔍 PostgreSQL Connection Checker

📋 Current Configuration from .env:
Host: db.abcdefghijklmnop.supabase.co
Port: 5432
Database: postgres
User: postgres

🧪 Test 1: Connecting to default postgres database...
✅ Successfully connected to PostgreSQL!

🧪 Test 2: Checking if target database exists...
✅ Database 'postgres' exists!

🧪 Test 3: Connecting to 'postgres' database...
✅ Successfully connected to 'postgres'!

📊 Found 13 tables:
   - applications
   - certificates
   - companies
   - education
   - experience
   - feedbacks
   - freelancers
   - jobs
   - reviews
   - students
   - universities
   - university_company_connections
   - users
✅ All 13 tables exist! Database is ready!

✅ Diagnostics Complete!
🎉 Everything looks good!
You can now run: pnpm dev
```

**✅ If you see all 13 tables, you're connected!**

---

## Step 6: Start Backend Server

```powershell
cd server
pnpm dev
```

**Expected output:**
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
📍 Environment: development
```

---

## Step 7: Start Frontend

**Open new terminal:**
```powershell
cd client
pnpm install
pnpm dev
```

**Open browser:** `http://localhost:3000`

---

## Step 8: Test Real-Time Sync

**Team Member A:**
1. Go to http://localhost:3000
2. Register new account: `teamA@test.com`

**Team Member B (another person):**
1. Go to http://localhost:3000
2. Login with: `teamA@test.com` (using A's account)
3. **Should work!** 🎉

**✅ This proves everyone is sharing the same database!**

---

# 📊 MONITORING & MANAGEMENT

## View Database in Supabase Dashboard

**Anyone with Supabase access can:**

1. Go to: https://supabase.com
2. Login with account
3. Select project: **PathForward Myanmar**
4. View data:
   - **Table Editor** → See all tables and data
   - **SQL Editor** → Run custom queries
   - **Database** → View connections, size, performance

---

## Common Database Operations

### View All Users
1. Supabase Dashboard → **Table Editor**
2. Click **"users"** table
3. See all registered users

### View All Jobs
1. Click **"jobs"** table
2. See all job postings

### Run Custom Queries
1. Click **SQL Editor** (left sidebar)
2. Create new query
3. Example:

```sql
-- Count users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- View recent applications
SELECT * FROM applications
ORDER BY "createdAt" DESC
LIMIT 10;

-- Companies with most job posts
SELECT c."companyName", COUNT(j.id) as job_count
FROM companies c
LEFT JOIN jobs j ON c.id = j."companyId"
GROUP BY c.id, c."companyName"
ORDER BY job_count DESC;
```

---

## Database Backups

### Automatic Backups (Free Tier)
- Supabase automatically backs up your database daily
- Can restore from backup if needed
- Go to: **Settings** → **Database** → **Backups**

### Manual Export
```powershell
# Install pg_dump (if not installed)
# Then export:
pg_dump "postgresql://postgres:[PASSWORD]@db.xyz.supabase.co:5432/postgres" > backup.sql
```

### Manual Import
```powershell
psql "postgresql://postgres:[PASSWORD]@db.xyz.supabase.co:5432/postgres" < backup.sql
```

---

# 🔐 SECURITY BEST PRACTICES

## ✅ DO:
- ✅ Keep database password secure
- ✅ Share credentials via secure channels (LastPass, 1Password, private chat)
- ✅ Use strong JWT secret (long, random)
- ✅ Keep `.env` in `.gitignore` (already done)
- ✅ Regularly backup database
- ✅ Monitor database usage in Supabase dashboard
- ✅ Use different passwords for development vs production

## ❌ DON'T:
- ❌ Commit `.env` to Git
- ❌ Share credentials in public channels
- ❌ Use simple passwords like "password123"
- ❌ Share Supabase login credentials (only share connection details)
- ❌ Expose database credentials in client-side code
- ❌ Post credentials on social media, forums, Stack Overflow

---

# 🔧 TROUBLESHOOTING

## Problem 1: "self signed certificate" Error

### Symptom:
```
Error: self signed certificate in certificate chain
```

### Solution:
Make sure `database.js` has SSL configuration:

```javascript
dialectOptions: {
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co') ? {
    require: true,
    rejectUnauthorized: false  // ← This line is important!
  } : false
}
```

---

## Problem 2: "password authentication failed"

### Symptom:
```
error: password authentication failed for user "postgres"
```

### Solutions:

**A. Check password in .env**
- Make sure it matches Supabase project password
- No extra spaces
- No quotes around password in `.env`

**B. Reset password in Supabase**
1. Go to Supabase dashboard
2. **Settings** → **Database**
3. Scroll to **"Database Password"**
4. Click **"Reset Database Password"**
5. Copy new password
6. Update ALL team members' `.env` files

---

## Problem 3: "Connection Timeout"

### Symptom:
```
Error: Connection timeout
```

### Solutions:

**A. Check internet connection**
```powershell
ping db.abcdefghijklmnop.supabase.co
```

**B. Check Supabase project status**
- Go to Supabase dashboard
- Check if project is active (not paused)
- Free tier pauses after 1 week inactivity
- Click project to auto-resume

**C. Verify connection details**
- Host, port, database name correct in `.env`
- No typos

---

## Problem 4: Project Paused

### Symptom:
```
Error: Connection refused
```

### Explanation:
Free tier projects pause after 1 week of no activity.

### Solution:
1. Go to Supabase dashboard
2. Click on your project
3. It will automatically resume (takes 30 seconds)
4. Try connecting again

---

## Problem 5: "Too many connections"

### Symptom:
```
Error: remaining connection slots are reserved
```

### Solutions:

**A. Reduce connection pool**
Edit `database.js`:
```javascript
pool: {
  max: 3,  // Reduce from 5 to 3
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

**B. Close unused connections**
- Stop unused backend servers
- Each team member running `pnpm dev` uses connections

---

## Problem 6: Different Data on Different Machines

### Symptom:
Team members see different data

### Causes:
- Team member using local PostgreSQL instead of Supabase
- Different `.env` configurations

### Solution:
**Verify .env on ALL machines:**
```powershell
cd server
notepad .env
```

**Check DB_HOST:**
- ✅ Should be: `db.xyz.supabase.co` (Supabase)
- ❌ NOT: `localhost` (local database)

**Quick test:**
```powershell
pnpm check-db
```

Check the "Host:" in output - should be Supabase URL!

---

# 📈 MONITORING DATABASE USAGE

## Check Free Tier Limits

1. Go to Supabase dashboard
2. **Settings** → **Billing**
3. View current usage:
   - **Database size:** X / 500 MB
   - **Bandwidth:** X / 2 GB/month
   - **Active connections:** Current number

## Monitor Performance

1. **Settings** → **Database**
2. **Database** → **Reports**
3. View:
   - Queries per second
   - Connection count
   - Slow queries
   - Database size growth

---

# 🚀 DEPLOYMENT TO PRODUCTION

When ready to deploy:

## Option A: Keep Same Supabase Project
- ✅ Simple, no migration needed
- ⚠️ Development and production share database
- 🔄 Consider upgrading to Pro tier ($25/month)

## Option B: Create Production Project
1. Create new Supabase project (production)
2. Update production `.env` with new credentials
3. Run migration on production database
4. Export development data if needed

## Option C: Self-Host PostgreSQL
1. Deploy to VPS (DigitalOcean, Linode)
2. Install PostgreSQL
3. Configure SSL
4. Update production `.env`

---

# ✅ QUICK REFERENCE

## Team Lead (One-Time Setup):
```powershell
# 1. Create Supabase account at supabase.com
# 2. Create new project
# 3. Get connection details
# 4. Update server/src/config/database.js (add SSL)
# 5. Update server/.env
# 6. Run:
pnpm install
pnpm migrate
pnpm dev

# 7. Share config with team (securely!)
```

## Team Members:
```powershell
# 1. Clone repository
git clone <url>
cd PathForwardMyanmar

# 2. Update server/.env with Supabase credentials

# 3. Install and test:
cd server
pnpm install
pnpm check-db
pnpm dev

# 4. Start frontend:
cd client
pnpm install
pnpm dev
```

## Useful Commands:
```powershell
# Test connection
pnpm check-db

# Start backend
cd server && pnpm dev

# Start frontend
cd client && pnpm dev

# View logs
# Check Supabase dashboard → Database → Logs
```

---

# 🎯 ADVANTAGES OVER LOCAL NETWORK

| Feature | Local Network | Supabase |
|---------|--------------|----------|
| **Setup Time** | 30+ minutes | 5 minutes |
| **Network Config** | Firewall, ports, IP | None |
| **Host Availability** | Host must be running | Always available |
| **Remote Work** | Same WiFi only | Anywhere |
| **SSL Security** | Manual setup | Built-in |
| **Backups** | Manual | Automatic daily |
| **Monitoring** | Limited | Full dashboard |
| **Speed** | Fast (local) | Fast (cloud) |
| **Cost** | Free | Free (500MB) |
| **Scalability** | Limited | Easy upgrade |

**✅ Supabase wins in almost every category!**

---

# 🎉 SUCCESS CHECKLIST

After completing this guide:

### Team Lead:
- [ ] Supabase account created
- [ ] Project created and running
- [ ] Database password saved securely
- [ ] Connection details copied
- [ ] `database.js` updated with SSL config
- [ ] `.env` configured with Supabase details
- [ ] Migration completed (13 tables created)
- [ ] Backend server runs successfully
- [ ] Test user created
- [ ] Configuration shared with team securely

### Team Members:
- [ ] Repository cloned
- [ ] `.env` configured with Supabase details
- [ ] `database.js` has SSL configuration
- [ ] Dependencies installed (`pnpm install`)
- [ ] Connection test passed (`pnpm check-db`)
- [ ] Backend server starts (`pnpm dev`)
- [ ] Frontend runs (`pnpm dev`)
- [ ] Can see same data as team lead
- [ ] Real-time sync works

### Verification Tests:
- [ ] All team members can connect
- [ ] Data syncs in real-time
- [ ] Users can register and login
- [ ] Database visible in Supabase dashboard
- [ ] All 13 tables exist
- [ ] No connection errors

**✅ All checked? You're ready to build!** 🚀

---

# 📚 ADDITIONAL RESOURCES

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Sequelize Docs:** https://sequelize.org/docs/
- **Project Guides:**
  - [README.md](README.md) - Project overview
  - [TEAM_GUIDE.md](TEAM_GUIDE.md) - Development workflow
  - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

---

**Questions?**
- Check Supabase dashboard for errors
- Run `pnpm check-db` for diagnostics
- Check this guide's troubleshooting section

**Happy collaborative coding with Supabase!** ☁️🚀

<function_calls>
<invoke name="Read">
<parameter name="file_path">c:\Projects\PathForwardMyanmar\server\src\config\database.js