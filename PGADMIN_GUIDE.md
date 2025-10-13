# pgAdmin 4 - Complete Visual Guide

## 📖 Table of Contents

1. [Opening pgAdmin 4](#1-opening-pgadmin-4)
2. [First-Time Setup](#2-first-time-setup)
3. [Setting PostgreSQL Password](#3-setting-postgresql-password)
4. [Creating Database Manually](#4-creating-database-manually-alternative)
5. [Viewing Tables](#5-viewing-tables)
6. [Running SQL Queries](#6-running-sql-queries)
7. [Common Tasks](#7-common-tasks)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Opening pgAdmin 4

### Step 1.1: Launch pgAdmin

**Windows:**
1. Press `Win` key
2. Type `pgAdmin 4`
3. Click on "pgAdmin 4"

**Alternative:**
- Check your Start Menu under PostgreSQL folder
- Look in: `C:\Program Files\PostgreSQL\16\pgAdmin 4\bin\pgAdmin4.exe`

### Step 1.2: Wait for Loading

- pgAdmin will open in your default web browser
- URL will be: `http://127.0.0.1:PORT/browser/`
- Wait for the interface to load (5-10 seconds)

---

## 2. First-Time Setup

### Step 2.1: Master Password (First Time Only)

When you open pgAdmin for the first time, you'll see:

```
┌─────────────────────────────────────────────┐
│   Set Master Password                       │
├─────────────────────────────────────────────┤
│                                             │
│   Please set a master password for         │
│   pgAdmin. This will be used to            │
│   protect saved passwords and other        │
│   information.                              │
│                                             │
│   Password:      [____________]             │
│   Confirm:       [____________]             │
│                                             │
│            [Set Master Password]            │
└─────────────────────────────────────────────┘
```

**Important Notes:**
- ⚠️ This is **NOT** your PostgreSQL password
- ⚠️ This is **ONLY** for pgAdmin access
- ✅ Choose any password you'll remember
- ✅ You can use something simple like: `admin123`

**What to do:**
1. Enter a password (e.g., `admin123`)
2. Confirm the same password
3. Click "Set Master Password"

---

## 3. Setting PostgreSQL Password

### Option A: You Know Your Password
If you remember your PostgreSQL password from installation:
- Skip to [Step 3.3](#step-33-test-connection)

### Option B: You Forgot Your Password
Follow Steps 3.1 and 3.2 below.

---

### Step 3.1: Connect to PostgreSQL Server

**In the left sidebar, you'll see:**

```
pgAdmin 4
└── Servers
    └── PostgreSQL 16
```

**Click on "PostgreSQL 16"**

You'll see a dialog:

```
┌─────────────────────────────────────────────┐
│   Connect to Server                         │
├─────────────────────────────────────────────┤
│                                             │
│   Please enter the password for the        │
│   user 'postgres' to connect to            │
│   server "PostgreSQL 16"                    │
│                                             │
│   Password: [________________________]      │
│                                             │
│   [ ] Save Password                         │
│                                             │
│   [Cancel]            [OK]                  │
└─────────────────────────────────────────────┘
```

**If you know the password:**
1. Enter your PostgreSQL password
2. ✅ Check "Save Password" (optional but convenient)
3. Click "OK"
4. ✅ Skip to [Viewing Tables](#5-viewing-tables)

**If you don't know the password:**
1. Click "Cancel"
2. Continue to Step 3.2

---

### Step 3.2: Reset PostgreSQL Password (If Forgotten)

#### Method 1: Using Command Line (Easier)

**Open PowerShell as Administrator:**
1. Press `Win` key
2. Type `PowerShell`
3. Right-click "Windows PowerShell"
4. Select "Run as administrator"

**Run these commands:**

```powershell
# 1. Stop PostgreSQL service
Stop-Service -Name postgresql-x64-16

# 2. Edit security config
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
```

**In Notepad:**

Find this section (near the bottom):
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
```

Change `scram-sha-256` to `trust`:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
```

**Save and close** (Ctrl + S, then close Notepad)

**Continue in PowerShell:**

```powershell
# 3. Start PostgreSQL service
Start-Service -Name postgresql-x64-16

# 4. Connect without password
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres

# You should now see: postgres=#

# 5. Change password (replace 'your_new_password' with your choice)
ALTER USER postgres PASSWORD 'your_new_password';

# You should see: ALTER ROLE

# 6. Exit
\q
```

**Restore Security:**

```powershell
# 7. Edit security config again
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
```

Change `trust` back to `scram-sha-256`:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
```

**Save and close**

```powershell
# 8. Restart PostgreSQL
Restart-Service -Name postgresql-x64-16
```

✅ **Done!** Your new password is set.

---

#### Method 2: Using pgAdmin (If Already Connected)

**If you can connect to pgAdmin:**

1. **Navigate to Login/Group Roles:**
   ```
   Servers
   └── PostgreSQL 16
       └── Login/Group Roles
           └── postgres
   ```

2. **Right-click on "postgres"**
3. **Select "Properties..."**
4. **Click "Definition" tab**
5. **Enter new password in "Password" field**
6. **Click "Save"**

✅ **Done!**

---

### Step 3.3: Test Connection

1. **In pgAdmin, click on "PostgreSQL 16" in left sidebar**
2. **Enter your password**
3. **Check "Save Password"** (optional)
4. **Click "OK"**

**If successful:**
- ✅ Server will expand showing "Databases", "Login/Group Roles", etc.
- ✅ Green icon appears next to "PostgreSQL 16"

**If failed:**
- ❌ Error: "password authentication failed"
- → Retry Method 1 above, ensure you followed all steps

---

### Step 3.4: Update .env File

**Very Important:** Update your project's `.env` file!

```powershell
cd C:\Projects\PathForwardMyanmar\server
notepad .env
```

**Update this line:**
```env
DB_PASSWORD=your_new_password_here
```

**Replace `your_new_password_here` with the password you just set!**

**Save and close** (Ctrl + S)

---

## 4. Creating Database Manually (Alternative)

**Note:** If you use `pnpm setup`, the database is created automatically. This section is for manual creation only.

### Step 4.1: Navigate to Databases

In pgAdmin left sidebar:
```
Servers
└── PostgreSQL 16
    └── Databases   ← Right-click here
```

### Step 4.2: Create Database

1. **Right-click on "Databases"**
2. **Select "Create" → "Database..."**

You'll see a dialog:

```
┌─────────────────────────────────────────────┐
│   Create - Database                         │
├─────────────────────────────────────────────┤
│   General  |  Definition  |  ...            │
├─────────────────────────────────────────────┤
│                                             │
│   Database: [pathforward_myanmar]           │
│   Owner:    [postgres]                      │
│   Comment:  [PathForward Myanmar Database]  │
│                                             │
│   [Cancel]            [Save]                │
└─────────────────────────────────────────────┘
```

3. **Fill in:**
   - **Database:** `pathforward_myanmar`
   - **Owner:** `postgres` (should be default)
   - **Comment:** (optional) "PathForward Myanmar Database"

4. **Click "Save"**

✅ Database created!

---

## 5. Viewing Tables

### Step 5.1: Navigate to Tables

**After running `pnpm setup` or `pnpm migrate`:**

```
Servers
└── PostgreSQL 16
    └── Databases
        └── pathforward_myanmar   ← Click here
            └── Schemas
                └── public
                    └── Tables   ← Click here
```

### Step 5.2: See Your Tables

You should see **13 tables:**

```
Tables
├── applications
├── certificates
├── companies
├── education
├── experience
├── feedbacks
├── freelancers
├── jobs
├── reviews
├── students
├── universities
├── university_company_connections
└── users
```

### Step 5.3: View Table Data

**To see data in a table:**

1. **Right-click on a table** (e.g., "users")
2. **Select "View/Edit Data" → "All Rows"**

A grid will open showing all data in that table.

**Initially, all tables will be empty** (no rows) until you:
- Register users on the website
- Create test data
- Insert data via SQL

---

## 6. Running SQL Queries

### Step 6.1: Open Query Tool

1. **Click on "pathforward_myanmar" database** in left sidebar
2. **Click "Tools" menu** (top menu bar)
3. **Select "Query Tool"**

OR:

1. **Right-click "pathforward_myanmar"**
2. **Select "Query Tool"**

### Step 6.2: Write and Run SQL

**Example: View all users**

```sql
SELECT * FROM users;
```

**To run:**
- Press `F5`, or
- Click the "Execute" button (▶ icon), or
- Press `Ctrl + E`

**Results** appear in the bottom panel.

### Step 6.3: Useful Queries

**View all tables:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

**Count users:**
```sql
SELECT COUNT(*) FROM users;
```

**View students with their universities:**
```sql
SELECT
  s.firstName,
  s.lastName,
  u.universityName
FROM students s
LEFT JOIN universities u ON s.universityId = u.id;
```

**View all jobs with company names:**
```sql
SELECT
  j.title,
  j.workMode,
  c.companyName
FROM jobs j
JOIN companies c ON j.companyId = c.id;
```

**Insert test user (example):**
```sql
INSERT INTO users (id, email, password, role)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'hashed_password_here',
  'student'
);
```

---

## 7. Common Tasks

### 7.1: Delete All Data from a Table

⚠️ **Warning:** This deletes ALL rows!

```sql
DELETE FROM applications;
```

### 7.2: Delete Specific Rows

```sql
DELETE FROM users WHERE email = 'test@example.com';
```

### 7.3: Update Data

```sql
UPDATE users SET isVerified = true WHERE email = 'user@example.com';
```

### 7.4: View Table Structure

**Right-click table → "Properties"**

Or use SQL:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';
```

### 7.5: Export Data

1. **Right-click table**
2. **Select "Import/Export Data..."**
3. **Select "Export"**
4. **Choose format:** CSV, Text, Binary
5. **Choose location**
6. **Click "OK"**

### 7.6: Import Data

1. **Right-click table**
2. **Select "Import/Export Data..."**
3. **Select "Import"**
4. **Choose file**
5. **Click "OK"**

---

## 8. Troubleshooting

### Issue 8.1: "Server doesn't exist"

**Symptoms:**
- PostgreSQL 16 server not showing in left sidebar

**Solution:**
1. **Click "Add New Server"** (icon in toolbar)
2. **General tab:**
   - Name: `PostgreSQL 16`
3. **Connection tab:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (your password)
4. **Click "Save"**

---

### Issue 8.2: "password authentication failed"

**Solutions:**
- See [Step 3.2: Reset PostgreSQL Password](#step-32-reset-postgresql-password-if-forgotten)

---

### Issue 8.3: "could not connect to server"

**Symptoms:**
```
could not connect to server: Connection refused
Is the server running on host "localhost" and accepting TCP/IP connections on port 5432?
```

**Solution:**

PostgreSQL service is not running.

**Fix:**
1. Press `Win + R`
2. Type: `services.msc`
3. Find: `postgresql-x64-16`
4. Right-click → "Start"

---

### Issue 8.4: "database does not exist"

**Solution:**
- Use `pnpm setup` to create database automatically, OR
- Follow [Step 4: Creating Database Manually](#4-creating-database-manually-alternative)

---

### Issue 8.5: "permission denied"

**Symptoms:**
```
ERROR: permission denied for table users
```

**Solution:**

You're not logged in as `postgres` or don't have permissions.

**Make sure:**
- Connected as user `postgres` (superuser)
- Check connection settings in pgAdmin

---

### Issue 8.6: Can't find pgAdmin 4

**Locations to check:**

```
C:\Program Files\PostgreSQL\16\pgAdmin 4\bin\pgAdmin4.exe
C:\Program Files (x86)\PostgreSQL\16\pgAdmin 4\bin\pgAdmin4.exe
```

**If not found:**
- Reinstall PostgreSQL
- During installation, select "pgAdmin 4" component

---

## 9. Quick Reference

### Connection Details:
```
Host:     localhost
Port:     5432
Database: pathforward_myanmar (or postgres for admin)
User:     postgres
Password: [your password]
```

### Common Shortcuts:
```
F5              - Execute query
Ctrl + E        - Execute query
Ctrl + Shift + C - Clear query
Ctrl + Space    - Autocomplete
```

### Useful SQL Commands:
```sql
-- List all databases
\l  (in psql command line)

-- List all tables
\dt  (in psql command line)

-- List tables (SQL)
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- View table structure
\d users  (in psql command line)

-- Count rows
SELECT COUNT(*) FROM users;

-- View first 10 rows
SELECT * FROM users LIMIT 10;
```

---

## 10. Tips & Best Practices

### Tip 1: Save Your Password
✅ Check "Save Password" when connecting to avoid entering it every time.

### Tip 2: Use Query Tool for Testing
✅ Test SQL queries in Query Tool before adding them to your code.

### Tip 3: Backup Before Deleting
✅ Export data before running DELETE or DROP commands.

### Tip 4: Use Transactions for Safety
```sql
BEGIN;
DELETE FROM users WHERE email = 'test@example.com';
-- Check results
SELECT * FROM users WHERE email = 'test@example.com';
-- If good:
COMMIT;
-- If bad:
-- ROLLBACK;
```

### Tip 5: Format Your SQL
✅ Use proper formatting for readable queries:
```sql
SELECT
  u.email,
  s.firstName,
  s.lastName
FROM users u
JOIN students s ON u.id = s.userId
WHERE u.role = 'student'
ORDER BY s.lastName;
```

---

## 11. Next Steps

After setting up pgAdmin:

1. ✅ **Update `.env` file** with your PostgreSQL password
2. ✅ **Run setup:** `pnpm setup`
3. ✅ **Verify tables** in pgAdmin
4. ✅ **Start server:** `pnpm dev`
5. ✅ **Register test user** on website
6. ✅ **Check data** in pgAdmin

---

## 📚 Additional Resources

- **pgAdmin Documentation:** https://www.pgadmin.org/docs/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **SQL Tutorial:** https://www.postgresql.org/docs/current/tutorial.html

---

## 🆘 Still Need Help?

1. **Run diagnostics:** `pnpm check-db`
2. **Check full PostgreSQL guide:** `POSTGRESQL_SETUP_WINDOWS.md`
3. **Quick start:** `POSTGRES_QUICKSTART.md`

---

**Last Updated:** 2024-01-01
**For:** PathForward Myanmar Project
**PostgreSQL Version:** 16+
**pgAdmin Version:** 4+
