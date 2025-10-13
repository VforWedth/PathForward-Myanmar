# 🌐 Local Network Database Sharing Guide

**Complete Step-by-Step Guide for Sharing PostgreSQL Database on Local Network**

This guide allows one team member (HOST) to run the PostgreSQL database, and other team members (CLIENTS) to connect to it over WiFi/LAN.

---

## 📋 Prerequisites

### All Team Members Need:
- ✅ Windows 10/11
- ✅ Same WiFi network (or LAN connection)
- ✅ Node.js v18+ installed
- ✅ pnpm or npm installed
- ✅ Project repository cloned

### Host Machine Needs:
- ✅ PostgreSQL 14+ installed
- ✅ Strong/stable machine (will run database server)
- ✅ Good internet/network connection

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 HOST MACHINE                     │
│  ┌──────────────┐         ┌─────────────┐      │
│  │ PostgreSQL   │◄────────│ Node.js     │      │
│  │ Database     │         │ Backend     │      │
│  │ Port: 5432   │         │ Port: 5000  │      │
│  └──────────────┘         └─────────────┘      │
│         ▲                                        │
│         │ Network Connection                    │
└─────────┼────────────────────────────────────────┘
          │
          ├──────────────────────┐
          │                      │
┌─────────▼─────────┐   ┌───────▼──────────┐
│  TEAM MEMBER 1    │   │  TEAM MEMBER 2   │
│  ┌─────────────┐  │   │  ┌─────────────┐ │
│  │ Node.js     │  │   │  │ Node.js     │ │
│  │ Backend     │  │   │  │ Backend     │ │
│  └─────────────┘  │   │  └─────────────┘ │
│  Connects to      │   │  Connects to     │
│  Host's Database  │   │  Host's Database │
└───────────────────┘   └──────────────────┘
```

---

# 🖥️ PART 1: HOST MACHINE SETUP

## Step 1: Find Your Local IP Address

**Open Command Prompt:**
```cmd
ipconfig
```

**Look for your network adapter** (WiFi or Ethernet):
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**📝 Write down your IP address!**
Example: `192.168.1.100`

---

## Step 2: Configure PostgreSQL for Network Access

### 2.1 Edit postgresql.conf

**Open as Administrator:**
```powershell
# PowerShell as Administrator
notepad "C:\Program Files\PostgreSQL\16\data\postgresql.conf"
```

**Find and modify this line:**
```conf
# Before (around line 59):
#listen_addresses = 'localhost'

# After:
listen_addresses = '*'
```

**This allows PostgreSQL to accept connections from any IP address.**

**Save and close** (Ctrl + S)

---

### 2.2 Edit pg_hba.conf (Client Authentication)

**Open as Administrator:**
```powershell
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
```

**Scroll to the bottom** and add these lines **before the existing lines**:

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Allow connections from local network (192.168.x.x)
host    all             all             192.168.0.0/16          scram-sha-256

# Allow connections from 10.x.x.x networks (common in some routers)
host    all             all             10.0.0.0/8              scram-sha-256

# Keep existing localhost connection
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

**Important Notes:**
- `192.168.0.0/16` covers ALL addresses from 192.168.0.0 to 192.168.255.255
- `10.0.0.0/8` covers ALL addresses from 10.0.0.0 to 10.255.255.255
- `scram-sha-256` requires password authentication
- Place these **BEFORE** existing rules (order matters!)

**Your final pg_hba.conf should look like:**
```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local network access
host    all             all             192.168.0.0/16          scram-sha-256
host    all             all             10.0.0.0/8              scram-sha-256

# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256

# (other existing lines...)
```

**Save and close**

---

## Step 3: Configure Windows Firewall

### 3.1 Allow PostgreSQL Port Through Firewall

**Open PowerShell as Administrator:**
```powershell
# Create inbound firewall rule for PostgreSQL
New-NetFirewallRule -DisplayName "PostgreSQL Server" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow

# Create outbound firewall rule (optional, for responses)
New-NetFirewallRule -DisplayName "PostgreSQL Server Out" -Direction Outbound -Protocol TCP -LocalPort 5432 -Action Allow
```

**✅ Success message should appear!**

### 3.2 Verify Firewall Rule (Optional)

1. Press **Win + R**
2. Type: `wf.msc`
3. Click **Inbound Rules**
4. Look for **"PostgreSQL Server"** - should be enabled (green checkmark)

---

## Step 4: Restart PostgreSQL Service

**PowerShell as Administrator:**
```powershell
# Restart PostgreSQL to apply changes
Restart-Service -Name postgresql-x64-16

# Verify it's running
Get-Service -Name postgresql-x64-16
```

**Expected output:**
```
Status   Name               DisplayName
------   ----               -----------
Running  postgresql-x64-16  postgresql-x64-16 - PostgreSQL Ser...
```

---

## Step 5: Set Up Database

### 5.1 Ensure PostgreSQL Password is Set

**Open psql:**
```powershell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres
```

**Inside psql, set a strong password:**
```sql
ALTER USER postgres PASSWORD 'TeamPassword123!';
\q
```

**📝 Remember this password! You'll share it with your team.**

---

### 5.2 Configure Server .env File

```powershell
cd C:\Projects\PathForwardMyanmar\server
notepad .env
```

**Edit .env:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (HOST uses localhost)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pathforward_myanmar
DB_USER=postgres
DB_PASSWORD=TeamPassword123!

# JWT Secret
JWT_SECRET=your_strong_jwt_secret_key_here
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

**Save and close**

---

### 5.3 Install Dependencies and Setup Database

```powershell
cd C:\Projects\PathForwardMyanmar\server

# Install dependencies
pnpm install

# Run automated setup
pnpm setup
```

**Wait for success message:**
```
🎉 Setup Complete!
✅ Database is ready!
```

---

## Step 6: Test Local Connection

**Start the backend server:**
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

**✅ If you see this, HOST setup is complete!**

---

## Step 7: Share Information with Team

**Create a team info document with:**

1. **Your IP Address:** `192.168.1.100` (your actual IP)
2. **Database Password:** `TeamPassword123!` (your actual password)
3. **Database Name:** `pathforward_myanmar`
4. **Database Port:** `5432`
5. **JWT Secret:** `your_strong_jwt_secret_key_here` (same for everyone)

**Share securely:** (WhatsApp, Teams, Slack - NOT in Git!)

**Example message to team:**
```
🔐 Database Connection Info:
━━━━━━━━━━━━━━━━━━━━━━━━
Host IP: 192.168.1.100
Database: pathforward_myanmar
Port: 5432
User: postgres
Password: TeamPassword123!
JWT Secret: your_strong_jwt_secret_key_here

⚠️ Make sure you're on the same WiFi network!
```

---

# 👥 PART 2: TEAM MEMBER (CLIENT) SETUP

## Step 1: Verify Network Connection

**Ensure you're on the SAME WiFi network as host!**

**Test connection to host:**
```powershell
# Replace 192.168.1.100 with your host's IP
ping 192.168.1.100
```

**Expected output:**
```
Reply from 192.168.1.100: bytes=32 time=2ms TTL=128
Reply from 192.168.1.100: bytes=32 time=1ms TTL=128
```

**✅ If you see "Reply", connection works!**
**❌ If you see "Request timed out", check WiFi/network!**

---

## Step 2: Clone Repository (If Not Done)

```powershell
git clone <repository-url>
cd PathForwardMyanmar
```

---

## Step 3: Configure Server .env File

```powershell
cd server
notepad .env
```

**Edit .env (using HOST's IP address):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - CONNECT TO HOST
DB_HOST=192.168.1.100          # ← HOST'S IP ADDRESS HERE!
DB_PORT=5432
DB_NAME=pathforward_myanmar
DB_USER=postgres
DB_PASSWORD=TeamPassword123!    # ← PASSWORD FROM HOST

# JWT Secret - MUST BE SAME AS HOST
JWT_SECRET=your_strong_jwt_secret_key_here

JWT_EXPIRE=7d

# Email Configuration (optional)
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

**Key changes from host config:**
- `DB_HOST=192.168.1.100` ← Use HOST's IP, not "localhost"
- Same `DB_PASSWORD` as host
- Same `JWT_SECRET` as host

**Save and close**

---

## Step 4: Install Dependencies

```powershell
cd C:\Projects\PathForwardMyanmar\server

# Install dependencies
pnpm install
```

---

## Step 5: Test Database Connection

```powershell
# Test connection to host's database
pnpm check-db
```

**Expected output:**
```
🔍 PostgreSQL Connection Checker

📋 Current Configuration from .env:
Host: 192.168.1.100
Port: 5432
Database: pathforward_myanmar
User: postgres

🧪 Test 1: Connecting to default postgres database...
✅ Successfully connected to PostgreSQL!

🧪 Test 2: Checking if target database exists...
✅ Database 'pathforward_myanmar' exists!

🧪 Test 3: Connecting to 'pathforward_myanmar' database...
✅ Successfully connected to 'pathforward_myanmar'!

📊 Found 13 tables:
   - applications
   - certificates
   - companies
   ...
   ✅ All 13 tables exist! Database is ready!

✅ Everything looks good!
You can now run: pnpm dev
```

---

## Step 6: Start Your Backend Server

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

**✅ Success! You're connected to the host's database!**

---

## Step 7: Start Frontend (Optional)

**In a new terminal:**
```powershell
cd client
pnpm install
pnpm dev
```

**Access at:** `http://localhost:3000`

---

# 🧪 TESTING & VERIFICATION

## Test 1: Host Creates User Account

**On HOST machine:**
1. Open `http://localhost:3000`
2. Click "Register"
3. Create account: `host@test.com` / password / select role
4. Submit registration

**✅ Should see success message**

---

## Test 2: Team Member Sees Same Data

**On TEAM MEMBER machine:**
1. Open `http://localhost:3000`
2. Click "Login"
3. Login with: `host@test.com` / password
4. Should successfully login!

**✅ This proves both are connected to same database!**

---

## Test 3: Real-Time Data Sync

**HOST creates a job posting:**
1. Login as company
2. Create job post

**TEAM MEMBER should see it:**
1. Refresh jobs page
2. Should see host's job post

**✅ Database sharing is working perfectly!**

---

# 🔧 TROUBLESHOOTING

## Problem 1: "Could not connect to server" (Team Member)

### Symptom:
```
❌ Unable to connect to the database
Error: connect ETIMEDOUT
```

### Solutions:

**A. Check Network Connection**
```powershell
# Ping host's IP
ping 192.168.1.100
```
- ✅ If "Reply" → Network OK
- ❌ If "Request timed out" → Network issue

**B. Verify Same WiFi Network**
- Both machines must be on SAME WiFi
- Check WiFi name on both machines
- If using mobile hotspot, ensure both connected to it

**C. Check Host's Firewall Rule**
```powershell
# On HOST machine (PowerShell as Admin)
Get-NetFirewallRule -DisplayName "PostgreSQL Server"
```
Should show `Enabled : True`

**D. Temporarily Disable Firewall (Testing Only)**
```powershell
# On HOST machine (PowerShell as Admin)
# WARNING: Only for testing!
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Test connection...

# Re-enable afterwards!
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

## Problem 2: "Password authentication failed"

### Symptom:
```
❌ Failed to connect to PostgreSQL
Code: 28P01
```

### Solutions:

**A. Verify Password Match**
- Host's password in HOST's `.env`
- Same password in TEAM's `.env`
- Check for typos!

**B. Test PostgreSQL Password on Host**
```powershell
# On HOST machine
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -d pathforward_myanmar

# Enter password when prompted
# If fails, password is wrong
```

**C. Reset Password (Host Only)**
```sql
-- Inside psql on HOST
ALTER USER postgres PASSWORD 'NewPassword123!';
\q
```
Then update `.env` on all machines!

---

## Problem 3: "Database does not exist" (Team Member)

### Symptom:
```
❌ Database 'pathforward_myanmar' does NOT exist!
```

### Solutions:

**The team member should NOT run `pnpm setup`!**
- ❌ Don't create database on team member machines
- ✅ Only HOST runs `pnpm setup`
- ✅ Team members only need `pnpm install` and `pnpm dev`

**If team member accidentally created local database:**
```powershell
# On TEAM MEMBER machine
cd server

# Check .env - should have HOST's IP
notepad .env

# Verify DB_HOST is NOT localhost
# Should be: DB_HOST=192.168.1.100 (host's IP)
```

---

## Problem 4: "Port 5432 already in use"

### Symptom:
```
Error: Port 5432 is already in use
```

### Solutions:

**A. If Team Member Installed PostgreSQL:**
- Team members don't need PostgreSQL installed!
- Only HOST needs it

**B. Stop Local PostgreSQL (Team Member)**
```powershell
# Stop your local PostgreSQL
Stop-Service -Name postgresql-x64-16

# Disable auto-start
Set-Service -Name postgresql-x64-16 -StartupType Disabled
```

---

## Problem 5: Host IP Address Changed

### Symptom:
Worked yesterday, doesn't work today

### Explanation:
WiFi routers assign dynamic IP addresses. Host's IP might change after:
- Router restart
- Host machine restart
- DHCP lease expiration

### Solutions:

**A. Find New IP Address (Host)**
```powershell
ipconfig
```
Look for new IPv4 address

**B. Update Team Members' .env**
All team members update `DB_HOST` with new IP

**C. Set Static IP Address (Recommended - Host)**

**Windows Settings:**
1. Press Win + I
2. Network & Internet → WiFi → Properties
3. IP assignment → Edit
4. Manual → IPv4 On
5. Set:
   - IP address: `192.168.1.100` (pick unused address)
   - Subnet mask: `255.255.255.0`
   - Gateway: `192.168.1.1` (your router)
   - DNS: `8.8.8.8` (Google DNS)
6. Save

**Now IP won't change!**

---

## Problem 6: Slow Database Queries

### Symptom:
- API requests take long time
- Database queries slow

### Solutions:

**A. Check Host Machine Performance**
- Host needs decent CPU/RAM
- Close unnecessary programs
- Check Task Manager

**B. Check Network Speed**
```powershell
# Test network speed to host
ping -n 20 192.168.1.100
```
Should be < 10ms typically

**C. Use 5GHz WiFi (if available)**
- Faster than 2.4GHz
- Less interference
- Better for database traffic

**D. Use Ethernet Cable**
- Host connected via Ethernet = fastest
- Team members can use WiFi

---

## Problem 7: CORS Errors (Frontend)

### Symptom:
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

### Solutions:

**Check backend CORS config** ([server/src/index.js:14](server/src/index.js:14)):
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Ensure .env has:**
```env
CLIENT_URL=http://localhost:3000
```

---

# 📊 MONITORING & MAINTENANCE

## Check Connected Clients (Host)

**On HOST machine, open psql:**
```sql
-- View active connections
SELECT pid, usename, application_name, client_addr, state
FROM pg_stat_activity
WHERE datname = 'pathforward_myanmar';
```

**Example output:**
```
 pid  | usename  | application_name | client_addr   | state
------+----------+------------------+---------------+--------
 1234 | postgres | psql            | 127.0.0.1     | active
 5678 | postgres | node-postgres   | 192.168.1.50  | idle
 9012 | postgres | node-postgres   | 192.168.1.75  | idle
```

**Shows:**
- HOST (127.0.0.1)
- Team Member 1 (192.168.1.50)
- Team Member 2 (192.168.1.75)

---

## Database Backup (Host)

**Export database regularly:**
```powershell
cd "C:\Program Files\PostgreSQL\16\bin"

# Create backup
.\pg_dump.exe -U postgres -d pathforward_myanmar -f "C:\Backups\pathforward_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql"
```

**Restore from backup:**
```powershell
.\psql.exe -U postgres -d pathforward_myanmar -f "C:\Backups\pathforward_backup_20250113.sql"
```

---

## Performance Monitoring

**Check database size:**
```sql
SELECT pg_size_pretty(pg_database_size('pathforward_myanmar'));
```

**Check table sizes:**
```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

# ✅ TEAM SETUP CHECKLIST

## Host Checklist:
- [ ] PostgreSQL installed and running
- [ ] IP address identified (e.g., 192.168.1.100)
- [ ] `postgresql.conf` edited (listen_addresses = '*')
- [ ] `pg_hba.conf` edited (allow 192.168.0.0/16)
- [ ] Firewall rule created (port 5432)
- [ ] PostgreSQL service restarted
- [ ] Database password set
- [ ] `.env` file configured (DB_HOST=localhost)
- [ ] `pnpm install` completed
- [ ] `pnpm setup` completed successfully
- [ ] Backend server starts (`pnpm dev`)
- [ ] Connection info shared with team
- [ ] Test account created

## Team Member Checklist:
- [ ] Same WiFi network as host
- [ ] Can ping host's IP successfully
- [ ] Repository cloned
- [ ] `.env` file configured (DB_HOST=host_ip)
- [ ] Same password as host in `.env`
- [ ] Same JWT_SECRET as host
- [ ] `pnpm install` completed
- [ ] `pnpm check-db` succeeds
- [ ] Backend server starts (`pnpm dev`)
- [ ] Can login with host's test account
- [ ] Frontend connects successfully

---

# 🎯 BEST PRACTICES

## For Host Machine:

1. **Keep Machine Running**
   - Database only works when host machine is on
   - Plan development sessions together

2. **Use Strong Password**
   - Don't use `postgres` or `123456`
   - Use: `Team2025PathForward!`

3. **Regular Backups**
   - Export database daily
   - Store backups in Git LFS or cloud

4. **Monitor Performance**
   - Close unnecessary programs
   - Check Task Manager
   - Restart PostgreSQL if slow

5. **Static IP (Recommended)**
   - Set static IP to avoid changes
   - Document IP in team chat

## For All Team Members:

1. **Same JWT Secret**
   - Must match across all machines
   - Tokens won't work otherwise

2. **Coordinate Updates**
   - Don't run migrations simultaneously
   - Host should handle database changes

3. **Communication**
   - Let host know if database seems slow
   - Report any connection issues immediately

4. **Backup .env Files**
   - Keep .env backup somewhere safe
   - Don't commit to Git!

---

# 🚀 QUICK REFERENCE

## Host Commands:
```powershell
# Find IP
ipconfig

# Restart PostgreSQL
Restart-Service -Name postgresql-x64-16

# Check service status
Get-Service -Name postgresql-x64-16

# Start backend
cd server && pnpm dev

# Database backup
cd "C:\Program Files\PostgreSQL\16\bin"
.\pg_dump.exe -U postgres -d pathforward_myanmar -f backup.sql
```

## Team Member Commands:
```powershell
# Test connection to host
ping 192.168.1.100

# Check database connection
cd server && pnpm check-db

# Start backend
cd server && pnpm dev

# Start frontend
cd client && pnpm dev
```

## Common IP Ranges:
- `192.168.0.x` - Common home routers
- `192.168.1.x` - Common home routers
- `192.168.100.x` - Some routers
- `10.0.0.x` - Some routers/corporate

---

# 🎉 SUCCESS!

When everything works:
- ✅ Host runs PostgreSQL and backend
- ✅ Team members connect to host's database
- ✅ All see same data in real-time
- ✅ Changes sync instantly
- ✅ One source of truth for development

**You're now ready for collaborative development!**

---

# 📖 Additional Resources

- **pgAdmin Guide:** See [PGADMIN_GUIDE.md](PGADMIN_GUIDE.md)
- **PostgreSQL Setup:** See [POSTGRESQL_SETUP_WINDOWS.md](POSTGRESQL_SETUP_WINDOWS.md)
- **Quick Start:** See [POSTGRES_QUICKSTART.md](POSTGRES_QUICKSTART.md)
- **Team Workflow:** See [TEAM_GUIDE.md](TEAM_GUIDE.md)

---

**Questions or issues?** Check troubleshooting section above or run diagnostics:
```powershell
pnpm check-db
```

**Happy collaborative coding!** 🚀
