# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install PostgreSQL (if not installed)
Download and install: https://www.postgresql.org/download/

### Step 2: Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd PathForwardMyanmar

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Setup Database
```bash
# Open PostgreSQL terminal
psql -U postgres

# Create database
CREATE DATABASE pathforward_myanmar;

# Exit
\q
```

### Step 4: Configure Environment
Backend `.env` is already created with default settings.
Frontend `.env.local` is already created.

**IMPORTANT**: Update `DB_PASSWORD` in `server/.env` to match your PostgreSQL password.

### Step 5: Run Database Migration
```bash
# From server directory
cd server
npm run migrate
```

You should see:
```
✅ Database connection established successfully.
✅ Database migration completed successfully!
```

### Step 6: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 7: Open Browser
Navigate to: http://localhost:3000

---

## ✅ Verify Everything Works

### Test Registration:
1. Click "Register"
2. Select "Student"
3. Fill in:
   - Email: test@student.com
   - Password: password123
   - Phone: 09123456789
   - First Name: John
   - Last Name: Doe
4. Click "Register"
5. You should be redirected to Student Dashboard

### Test Login:
1. Logout (if logged in)
2. Click "Login"
3. Enter credentials
4. Should redirect to appropriate dashboard

### Test API Directly:
```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"PathForward Myanmar API is running","timestamp":"..."}
```

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running: `pg_ctl status`
- Verify password in `server/.env`
- Ensure database exists: `psql -U postgres -l`

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📁 Project Structure Overview

```
PathForwardMyanmar/
├── 📚 Documentation/
│   ├── README.md              ← Project overview
│   ├── SETUP_GUIDE.md         ← Detailed setup
│   ├── TEAM_GUIDE.md          ← Development guide
│   ├── API_DOCUMENTATION.md   ← API reference
│   ├── PROJECT_SUMMARY.md     ← Complete summary
│   └── QUICKSTART.md          ← This file
│
├── 🖥️ client/                 ← Frontend (Next.js)
│   ├── src/app/               ← Pages
│   ├── src/lib/               ← API client
│   └── src/store/             ← State management
│
└── ⚙️ server/                 ← Backend (Node.js)
    ├── src/models/            ← Database models
    ├── src/controllers/       ← Business logic
    ├── src/routes/            ← API routes
    └── src/middleware/        ← Auth middleware
```

---

## 🎯 What to Do Next

### For Team Member 1 (Admin):
Read `TEAM_GUIDE.md` → Section "Member 1: Admin Module"

### For Team Member 2 (Student/Company):
Read `TEAM_GUIDE.md` → Section "Member 2: Student & Company Modules"

### For Team Member 3 (University/Freelancer):
Read `TEAM_GUIDE.md` → Section "Member 3: University & Freelancer Modules"

---

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `TEAM_GUIDE.md` for development help
3. Check `API_DOCUMENTATION.md` for API details
4. Ask team members
5. Check console logs (both frontend and backend)

---

## ✨ You're All Set!

Backend: http://localhost:5000
Frontend: http://localhost:3000

**Happy Coding! 🚀**
