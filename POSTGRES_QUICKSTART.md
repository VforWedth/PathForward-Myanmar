# PostgreSQL Quick Start - 3 Steps

## 🚀 Get Running in 10 Minutes!

This is the **fastest way** to fix your PostgreSQL setup and get coding.

---

## ✅ Step 1: Set PostgreSQL Password (5 minutes)

### Option A: You Know Your Password
- ✅ Skip to Step 2
- Use the password you set during PostgreSQL installation

### Option B: Reset Password (Quick Method)

**Open PowerShell as Administrator:**
```powershell
# Stop PostgreSQL
Stop-Service -Name postgresql-x64-16

# Edit config
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
```

**In Notepad:**
- Find: `host    all             all             127.0.0.1/32            scram-sha-256`
- Change to: `host    all             all             127.0.0.1/32            trust`
- Save and close

**Continue in PowerShell:**
```powershell
# Start PostgreSQL
Start-Service -Name postgresql-x64-16

# Connect without password
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres

# Change password (inside psql)
ALTER USER postgres PASSWORD 'mypassword123';

# Exit
\q

# Restore security
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
```

**In Notepad:**
- Change `trust` back to `scram-sha-256`
- Save and close

**Final step:**
```powershell
# Restart PostgreSQL
Restart-Service -Name postgresql-x64-16
```

✅ **Done!** Your password is now: `mypassword123` (or whatever you chose)

---

## ✅ Step 2: Update .env File (30 seconds)

```powershell
cd C:\Projects\PathForwardMyanmar\server
notepad .env
```

**Update this line:**
```env
DB_PASSWORD=mypassword123
```

**Replace `mypassword123` with your actual password!**

Save and close (Ctrl + S).

---

## ✅ Step 3: Run Automated Setup (2 minutes)

```powershell
cd C:\Projects\PathForwardMyanmar\server

# Install dependencies (if not done yet)
pnpm install

# Run automated setup
pnpm setup
```

**The setup script will automatically:**
- ✅ Test connection to PostgreSQL
- ✅ Create `pathforward_myanmar` database
- ✅ Run all migrations
- ✅ Create all 13 tables
- ✅ Verify everything works

**Expected output:**
```
🚀 PathForward Myanmar - PostgreSQL Setup
==========================================================

ℹ️  PostgreSQL Setup Configuration
Host:     localhost
Port:     5432
Database: pathforward_myanmar
User:     postgres
Password: ************

🔄 Testing PostgreSQL connection...
✅ Connected to PostgreSQL!

🔄 Checking if database 'pathforward_myanmar' exists...
⚠️  Database 'pathforward_myanmar' does not exist.

🔄 Creating database 'pathforward_myanmar'...
✅ Database 'pathforward_myanmar' created successfully!

🔄 Running database migrations...
✅ Database connection established successfully.
✅ Database models synchronized

🔄 Verifying tables...
ℹ️  Found 13 tables:
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
✅ All 13 tables created successfully!

==========================================================
🎉 Setup Complete!
==========================================================

✅ Database is ready!

Next steps:
   1. Start the server: pnpm dev
   2. Open frontend: cd ../client && pnpm dev
   3. Visit: http://localhost:3000
```

---

## 🎉 Step 4: Start Your Server

```powershell
# Start backend
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

**In another terminal, start frontend:**
```powershell
# Start frontend
cd client
pnpm dev
```

**Open browser:**
```
http://localhost:3000
```

---

## ✅ Success!

You should now be able to:
- ✅ Register a new account
- ✅ Login successfully
- ✅ Access your role-specific dashboard
- ✅ Start developing features!

---

## 🔧 Useful Commands

### Check database connection:
```powershell
cd server
pnpm check-db
```

### Reset database (delete all data):
```powershell
cd server
pnpm reset-db
```

### Start development:
```powershell
# Terminal 1 - Backend
cd server
pnpm dev

# Terminal 2 - Frontend
cd client
pnpm dev
```

---

## 🆘 Troubleshooting

### Error: "password authentication failed"
- ❌ Wrong password in `.env` file
- ✅ Check Step 1 - make sure you set/know your password
- ✅ Check Step 2 - make sure `.env` has correct password

### Error: "could not connect to server"
- ❌ PostgreSQL service not running
- ✅ Solution:
  ```powershell
  Start-Service -Name postgresql-x64-16
  ```

### Error: "database does not exist"
- ❌ Database wasn't created
- ✅ Solution: Run `pnpm setup` again

### Need detailed help?
- 📖 **pgAdmin Guide:** See `PGADMIN_GUIDE.md` for visual step-by-step
- 📖 **Full PostgreSQL Setup:** See `POSTGRESQL_SETUP_WINDOWS.md`
- 🔍 **Diagnostics:** Run `pnpm check-db`

---

## 📋 Quick Checklist

After completing the 3 steps:

- [ ] PostgreSQL password is set
- [ ] `.env` file has correct password
- [ ] `pnpm setup` completed successfully
- [ ] Database `pathforward_myanmar` exists
- [ ] 13 tables were created
- [ ] `pnpm dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register and login

✅ **All checked?** You're ready to code! 🚀

---

## 🎯 What Happens Behind the Scenes

When you run `pnpm setup`, the script:

1. **Tests Connection**
   - Connects to PostgreSQL default database
   - Verifies credentials work
   - Shows PostgreSQL version

2. **Creates Database**
   - Checks if `pathforward_myanmar` exists
   - Creates it if missing
   - Uses your postgres user credentials

3. **Runs Migrations**
   - Reads all model definitions
   - Creates tables with proper relationships
   - Sets up foreign keys and constraints
   - Creates indexes for performance

4. **Verifies Setup**
   - Counts tables (should be 13)
   - Lists all table names
   - Confirms everything is ready

**All automatic!** You just wait for ✅ messages.

---

## 💡 Tips

### Tip 1: Save Your Password
Write down your PostgreSQL password somewhere safe! You'll need it:
- Every time you run `pnpm setup`
- When team members set up their environment
- For production deployment

### Tip 2: Use pgAdmin
If you want to see your data visually:
1. Open pgAdmin 4
2. Connect with your password
3. Browse tables and data
4. See `PGADMIN_GUIDE.md` for full guide

### Tip 3: Share with Team
Your teammates will do the same steps:
1. Set their PostgreSQL password
2. Update their `.env` file
3. Run `pnpm setup`

Everyone uses the same database structure!

### Tip 4: Reset When Needed
During development, you might want fresh data:
```powershell
pnpm reset-db
```
This drops everything and recreates from scratch.

---

## 🚀 Ready to Build!

Now that your database is set up:
- ✅ Backend runs without errors
- ✅ Frontend can register/login users
- ✅ All 13 database tables ready
- ✅ Team can start building features

**Start coding the MVP features!** 💪

See `TEAM_GUIDE.md` for development workflow.

---

**That's it! 3 simple steps and you're running!** 🎉

**Questions?** Check the full guides:
- `PGADMIN_GUIDE.md` - Visual pgAdmin guide
- `POSTGRESQL_SETUP_WINDOWS.md` - Complete PostgreSQL setup
- `INSTALLATION_VERIFICATION.md` - Testing checklist
