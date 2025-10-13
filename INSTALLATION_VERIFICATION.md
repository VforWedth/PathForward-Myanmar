# Installation Verification Checklist

## ✅ Pre-Installation Checklist

Before you start, ensure you have:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL v14+ installed (`psql --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor (VS Code recommended)

---

## ✅ Installation Steps Verification

### Step 1: Project Files ✓
- [ ] Repository cloned
- [ ] Can see `client` and `server` folders
- [ ] Can see documentation files (README.md, etc.)

### Step 2: Backend Setup ✓
```bash
cd server
```
- [ ] `package.json` exists
- [ ] Run `npm install` successfully
- [ ] `node_modules` folder created
- [ ] `.env` file exists
- [ ] Database credentials updated in `.env`

### Step 3: Frontend Setup ✓
```bash
cd client
```
- [ ] `package.json` exists
- [ ] Run `npm install` successfully
- [ ] `node_modules` folder created
- [ ] `.env.local` file exists

### Step 4: Database Setup ✓
- [ ] PostgreSQL server is running
- [ ] Database `pathforward_myanmar` created
- [ ] Can connect: `psql -U postgres -d pathforward_myanmar`
- [ ] Run `npm run migrate` from server directory
- [ ] Migration completed successfully
- [ ] See 13 tables created

### Step 5: Start Backend ✓
```bash
cd server
npm run dev
```
- [ ] Server starts without errors
- [ ] See: "Server is running on port 5000"
- [ ] See: "Database connection established"
- [ ] Visit: http://localhost:5000/api/health
- [ ] Response: `{"success":true,...}`

### Step 6: Start Frontend ✓
```bash
cd client
npm run dev
```
- [ ] Next.js starts without errors
- [ ] See: "Local: http://localhost:3000"
- [ ] Visit: http://localhost:3000
- [ ] Landing page loads with Login/Register buttons

---

## ✅ Functional Testing

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"success":true,"message":"PathForward Myanmar API is running",...}`

- [ ] API is responding
- [ ] Returns success status

### Test 2: Registration
1. Go to http://localhost:3000
2. Click "Register"
3. Select "Student"
4. Fill in form:
   - Email: test@student.com
   - Password: password123
   - Phone: 09123456789
   - First Name: John
   - Last Name: Doe
5. Click "Register"

**Expected:**
- [ ] No errors in console
- [ ] Redirected to /student/dashboard
- [ ] Can see "Welcome, Student!" message

### Test 3: Check Database
```sql
psql -U postgres -d pathforward_myanmar

SELECT * FROM users;
SELECT * FROM students;
```

**Expected:**
- [ ] 1 user record exists
- [ ] 1 student record exists
- [ ] User has hashed password
- [ ] Student linked to user

### Test 4: Logout and Login
1. Click "Logout" (if logged in)
2. Click "Login"
3. Enter:
   - Email: test@student.com
   - Password: password123
4. Click "Login"

**Expected:**
- [ ] Login successful
- [ ] Redirected to /student/dashboard
- [ ] No errors

### Test 5: API Authentication
Using Postman or curl:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@test.com",
    "password": "password123",
    "role": "company",
    "profileData": {
      "companyName": "Test Company"
    }
  }'
```

**Expected:**
- [ ] Status 201
- [ ] Returns token
- [ ] Returns user object

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@test.com",
    "password": "password123"
  }'
```

**Expected:**
- [ ] Status 200
- [ ] Returns token
- [ ] Returns user object

**Get Profile (Protected Route):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected:**
- [ ] Status 200
- [ ] Returns user and profile data

**Without Token:**
```bash
curl http://localhost:5000/api/auth/me
```

**Expected:**
- [ ] Status 401
- [ ] Error: "Not authorized"

### Test 6: Role-Based Access
1. Register accounts with different roles:
   - Student: test@student.com
   - Company: test@company.com
   - University: test@university.com
   - Freelancer: test@freelancer.com

2. Login with each account

**Expected:**
- [ ] Student → /student/dashboard
- [ ] Company → /company/dashboard
- [ ] University → /university/dashboard
- [ ] Freelancer → /freelancer/dashboard

### Test 7: Database Relationships
Check in PostgreSQL:
```sql
-- Check all tables exist
\dt

-- Check relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

**Expected:**
- [ ] 13 tables visible
- [ ] Foreign key relationships exist
- [ ] No errors

---

## ✅ Common Issues Resolution

### Issue: "Database connection failed"
**Verify:**
```bash
# Check PostgreSQL is running
pg_ctl status

# Or on Windows
services.msc  # Look for postgresql service

# Try connecting
psql -U postgres
```

**Fix:**
- Start PostgreSQL service
- Check DB_PASSWORD in server/.env
- Verify database exists

### Issue: "Port already in use"
**Verify:**
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -ti:5000
lsof -ti:3000
```

**Fix:**
```bash
# Kill the process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### Issue: "Module not found"
**Fix:**
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find table"
**Fix:**
```bash
cd server
npm run migrate
```

### Issue: "CORS error"
**Verify:**
- CLIENT_URL in server/.env = http://localhost:3000
- Restart backend server after changing .env

---

## ✅ Final Verification

### Backend Health
- [ ] Server runs on port 5000
- [ ] No errors in terminal
- [ ] Health endpoint responds
- [ ] Can register users
- [ ] Can login users
- [ ] Protected routes work with token
- [ ] Protected routes fail without token

### Frontend Health
- [ ] App runs on port 3000
- [ ] Landing page loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard redirects work
- [ ] Logout works
- [ ] No console errors

### Database Health
- [ ] Can connect to database
- [ ] 13 tables exist
- [ ] Can insert data
- [ ] Can query data
- [ ] Relationships work

### Git Health
- [ ] Repository initialized
- [ ] Initial commits made
- [ ] Can push to remote (if remote added)

---

## ✅ Developer Tools Check

### Recommended VS Code Extensions
- [ ] ES7+ React/Redux/React-Native snippets
- [ ] Tailwind CSS IntelliSense
- [ ] Prettier - Code formatter
- [ ] ESLint
- [ ] PostgreSQL (for database management)

### Recommended Tools
- [ ] Postman or Thunder Client (API testing)
- [ ] pgAdmin or DBeaver (Database GUI)
- [ ] Git GUI (GitKraken, Sourcetree, or VS Code Git)

---

## 📊 System Status Summary

Once all checks pass, you should have:

✅ **Backend Status:**
- Node.js server running on port 5000
- PostgreSQL database connected
- 13 tables created and working
- JWT authentication functional
- RBAC middleware working
- 3 API endpoints operational (register, login, getMe)

✅ **Frontend Status:**
- Next.js app running on port 3000
- TypeScript compiling
- Tailwind CSS working
- Login page functional
- Register page with role selection functional
- 5 dashboard pages (placeholders) accessible
- State management (Zustand) working
- API client (Axios) configured

✅ **Integration Status:**
- Frontend can call backend APIs
- Registration creates user in database
- Login returns JWT token
- Protected routes enforce authentication
- Role-based routing works

---

## 🎉 Success Criteria

**You're ready to start development when:**

- [ ] ✅ All backend checks pass
- [ ] ✅ All frontend checks pass
- [ ] ✅ All database checks pass
- [ ] ✅ All functional tests pass
- [ ] ✅ No console errors
- [ ] ✅ Can register and login successfully
- [ ] ✅ Can access role-specific dashboards

---

## 🚀 Next Steps

1. **Read Documentation:**
   - [ ] Read TEAM_GUIDE.md
   - [ ] Read API_DOCUMENTATION.md
   - [ ] Understand your assigned module

2. **Setup Your Development Branch:**
   ```bash
   git checkout -b feature/your-name-module
   ```

3. **Start Building:**
   - Follow patterns in existing code
   - Test frequently
   - Commit regularly

4. **Stay Coordinated:**
   - Communicate with team
   - Update progress
   - Ask for help when stuck

---

## 📞 Support

If you're stuck after trying all troubleshooting steps:

1. Check all documentation files
2. Google the error message
3. Check Stack Overflow
4. Ask team members
5. Review the example code (authController, authRoutes)

---

**Last Updated:** 2024-01-01
**Verified On:** Node.js v18+, PostgreSQL v14+, Next.js 14

**Status:** ✅ Ready for Team Development
