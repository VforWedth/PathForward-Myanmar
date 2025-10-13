# PostgreSQL Setup Guide for Windows

## 🔴 Error: "password authentication failed for user postgres"

This means the password in your `.env` file doesn't match your PostgreSQL password.

---

## 📋 Complete PostgreSQL Setup - Step by Step

### Step 1: Check if PostgreSQL is Installed

Open Command Prompt or PowerShell and run:
```powershell
psql --version
```

**If you see a version number**: PostgreSQL is installed ✅
**If you get an error**: You need to install PostgreSQL ❌

---

### Step 2: Install PostgreSQL (if not installed)

#### Download and Install:

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose the latest version (16.x recommended)
   - Download the Windows x86-64 installer

2. **Run the Installer:**
   - Double-click the downloaded `.exe` file
   - Click "Next" through the setup wizard

3. **Important Settings During Installation:**
   ```
   Installation Directory: C:\Program Files\PostgreSQL\16 (default)
   Select Components:
     ✅ PostgreSQL Server
     ✅ pgAdmin 4
     ✅ Stack Builder
     ✅ Command Line Tools

   Data Directory: C:\Program Files\PostgreSQL\16\data (default)

   Password: [Enter a password you'll remember]
   ⚠️ IMPORTANT: Remember this password! You'll need it.

   Port: 5432 (default)

   Locale: [Default locale]
   ```

4. **Complete Installation:**
   - Click "Next" and "Finish"
   - Uncheck "Stack Builder" when it asks (not needed now)

---

### Step 3: Verify PostgreSQL is Running

#### Method 1: Check Services (Recommended)

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for **"postgresql-x64-16"** (or your version)
4. Status should show **"Running"**

**If NOT running:**
- Right-click on the service
- Click "Start"

#### Method 2: Check from Command Line

```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Should show: Status = Running
```

---

### Step 4: Find Your PostgreSQL Password

#### Option A: You Remember the Password
Great! Skip to Step 5.

#### Option B: You Forgot the Password

You need to reset it:

1. **Open pgAdmin 4:**
   - Search for "pgAdmin 4" in Windows Start Menu
   - Open it

2. **It will ask for a Master Password:**
   - This is DIFFERENT from your PostgreSQL password
   - If first time, create one (you choose this password)
   - This password is just for pgAdmin, not for PostgreSQL

3. **Reset PostgreSQL Password:**

   Open PowerShell as Administrator and run:

   ```powershell
   # Stop PostgreSQL service
   Stop-Service -Name postgresql-x64-16

   # Find pg_hba.conf file
   cd "C:\Program Files\PostgreSQL\16\data"
   notepad pg_hba.conf
   ```

4. **Edit pg_hba.conf:**
   - Find these lines near the bottom:
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

   - Change `scram-sha-256` to `trust`:
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```

   - Save and close

5. **Restart PostgreSQL:**
   ```powershell
   Start-Service -Name postgresql-x64-16
   ```

6. **Connect without password and change it:**
   ```powershell
   # Navigate to PostgreSQL bin directory
   cd "C:\Program Files\PostgreSQL\16\bin"

   # Connect to PostgreSQL (no password needed now)
   .\psql.exe -U postgres

   # You should see: postgres=#

   # Change password (replace 'your_new_password' with your password)
   ALTER USER postgres PASSWORD 'your_new_password';

   # Exit
   \q
   ```

7. **Restore security in pg_hba.conf:**
   - Open `pg_hba.conf` again
   - Change `trust` back to `scram-sha-256`
   - Save and close

8. **Restart PostgreSQL:**
   ```powershell
   Restart-Service -Name postgresql-x64-16
   ```

---

### Step 5: Test PostgreSQL Connection

Open PowerShell and run:

```powershell
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# Enter your password when prompted
```

**If successful, you'll see:**
```
Password for user postgres:
psql (16.x)
Type "help" for help.

postgres=#
```

**Test with SQL:**
```sql
SELECT version();
```

**Exit:**
```sql
\q
```

---

### Step 6: Create the Database

#### Method 1: Using Command Line (Recommended)

```powershell
# Navigate to PostgreSQL bin
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# Enter password when prompted

# Create database
CREATE DATABASE pathforward_myanmar;

# Verify it was created
\l

# You should see pathforward_myanmar in the list

# Exit
\q
```

#### Method 2: Using pgAdmin 4

1. **Open pgAdmin 4**
2. **Connect to Server:**
   - Left sidebar: Expand "Servers"
   - Expand "PostgreSQL 16"
   - Enter your postgres password
3. **Create Database:**
   - Right-click on "Databases"
   - Click "Create" → "Database..."
   - Name: `pathforward_myanmar`
   - Owner: `postgres`
   - Click "Save"

---

### Step 7: Update Your .env File

1. **Open your `.env` file:**
   ```powershell
   cd C:\Projects\PathForwardMyanmar\server
   notepad .env
   ```

2. **Update with your PostgreSQL password:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pathforward_myanmar
   DB_USER=postgres
   DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE  # ⚠️ CHANGE THIS!

   # JWT Secret
   JWT_SECRET=pathforward_myanmar_secret_key_2024_change_this_in_production
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

3. **Save the file** (Ctrl + S)

---

### Step 8: Run the Migration

```powershell
cd C:\Projects\PathForwardMyanmar\server
pnpm migrate
```

**Expected Output:**
```
🔄 Starting database migration...
✅ Database connection established successfully.
✅ Database migration completed successfully!
📊 All models synchronized
```

---

### Step 9: Verify Database Tables

Check if tables were created:

```powershell
# Navigate to PostgreSQL bin
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect to the database
.\psql.exe -U postgres -d pathforward_myanmar

# List all tables
\dt

# You should see 13 tables:
# - users
# - students
# - companies
# - universities
# - freelancers
# - jobs
# - applications
# - reviews
# - feedbacks
# - university_company_connections
# - education
# - experience
# - certificates

# Exit
\q
```

---

### Step 10: Start Your Server

```powershell
cd C:\Projects\PathForwardMyanmar\server
pnpm dev
```

**Expected Output:**
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
📍 Environment: development
```

---

## 🔧 Common Issues and Solutions

### Issue 1: "psql is not recognized"

**Problem:** PostgreSQL bin directory is not in PATH

**Solution:**
```powershell
# Use full path
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres

# OR add to PATH permanently:
# 1. Press Win + X, select "System"
# 2. Click "Advanced system settings"
# 3. Click "Environment Variables"
# 4. Under "System variables", find "Path"
# 5. Click "Edit"
# 6. Click "New"
# 7. Add: C:\Program Files\PostgreSQL\16\bin
# 8. Click OK on all windows
# 9. Restart PowerShell
```

---

### Issue 2: "database 'pathforward_myanmar' does not exist"

**Solution:**
```powershell
# Connect to postgres default database
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres

# Create the database
CREATE DATABASE pathforward_myanmar;

# Exit
\q
```

---

### Issue 3: "port 5432 is already in use"

**Problem:** Another PostgreSQL instance or service is running

**Solution:**
```powershell
# Find what's using port 5432
netstat -ano | findstr :5432

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Restart PostgreSQL service
Restart-Service -Name postgresql-x64-16
```

---

### Issue 4: "connection refused"

**Problem:** PostgreSQL service not running

**Solution:**
```powershell
# Start the service
Start-Service -Name postgresql-x64-16

# Check status
Get-Service -Name postgresql-x64-16
```

---

### Issue 5: "role 'postgres' does not exist"

**Problem:** PostgreSQL installation issue

**Solution:** Reinstall PostgreSQL and make sure to create the postgres superuser during installation.

---

## 📊 Using pgAdmin 4

### Opening pgAdmin 4:

1. **Launch pgAdmin:**
   - Search "pgAdmin 4" in Windows Start Menu
   - Open it

2. **Set Master Password:**
   - First time only
   - Choose any password (this is for pgAdmin only)

3. **Connect to PostgreSQL:**
   - Left sidebar: Servers → PostgreSQL 16
   - Enter your postgres password

### Viewing Your Database:

```
Servers
  └── PostgreSQL 16
      └── Databases
          └── pathforward_myanmar
              ├── Schemas
              │   └── public
              │       └── Tables
              │           ├── users
              │           ├── students
              │           ├── companies
              │           └── ... (all 13 tables)
```

### Running SQL Queries:

1. Click on "pathforward_myanmar" database
2. Click "Tools" → "Query Tool"
3. Type SQL and press F5 to run

Example:
```sql
-- See all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count users
SELECT COUNT(*) FROM users;

-- View all users
SELECT * FROM users;
```

---

## ✅ Verification Checklist

After completing all steps:

- [ ] PostgreSQL is installed
- [ ] PostgreSQL service is running
- [ ] You can connect with: `psql -U postgres`
- [ ] Database `pathforward_myanmar` exists
- [ ] `.env` file has correct password
- [ ] Migration runs successfully (`pnpm migrate`)
- [ ] 13 tables exist in database
- [ ] Server starts without errors (`pnpm dev`)

---

## 🆘 Still Having Issues?

### Get PostgreSQL Info:

```powershell
# Check PostgreSQL version
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe --version

# Check service status
Get-Service -Name postgresql*

# Check if port 5432 is listening
netstat -ano | findstr :5432

# Test connection without database
.\psql.exe -U postgres -d postgres
```

### Get Your Current Settings:

```powershell
cd C:\Projects\PathForwardMyanmar\server
type .env
```

---

## 📞 Quick Commands Reference

```powershell
# Navigate to PostgreSQL
cd "C:\Program Files\PostgreSQL\16\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# Connect to specific database
.\psql.exe -U postgres -d pathforward_myanmar

# Create database
CREATE DATABASE pathforward_myanmar;

# List databases
\l

# List tables
\dt

# Exit psql
\q

# Check service
Get-Service -Name postgresql*

# Start service
Start-Service -Name postgresql-x64-16

# Restart service
Restart-Service -Name postgresql-x64-16

# Stop service
Stop-Service -Name postgresql-x64-16
```

---

## 🎯 Summary

The error "password authentication failed" means:

1. ❌ Wrong password in `.env` file
2. ❌ PostgreSQL not installed properly
3. ❌ PostgreSQL service not running

**Fix it by:**

1. ✅ Make sure PostgreSQL is installed and running
2. ✅ Know your postgres user password
3. ✅ Update `.env` with correct password
4. ✅ Create the database
5. ✅ Run migration

---

**After following this guide, your database should be working! 🚀**

If you're still stuck, share the error message and I'll help you debug further.
