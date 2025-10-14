# 🔧 Supabase Connection Troubleshooting

## Problem: ENOTFOUND Error

Your Supabase database (`db.cgtnpglqjpedhjfcputl.supabase.co`) only resolves to an **IPv6 address**, but your system may not have proper IPv6 connectivity with Node.js.

---

## ✅ SOLUTION 1: Use Connection Pooler (Recommended)

Supabase provides a **connection pooler** that works better with IPv4 networks.

### Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com
   - Select your project

2. **Get Connection Pooler Details**
   - Click **Settings** (left sidebar)
   - Click **Database**
   - Scroll to **Connection string**
   - Select **Connection pooling** tab
   - Copy the **Transaction mode** connection string

3. **Update .env with Pooler**

Instead of direct connection, use the pooler (note the different port):

```env
# Connection Pooler (Port 6543 instead of 5432)
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.cgtnpglqjpedhjfcputl
DB_PASSWORD=hacktivators5
```

**Key differences:**
- Host: `aws-0-ap-southeast-1.pooler.supabase.com` (not `db.xxx.supabase.co`)
- Port: `6543` (not `5432`)
- User: `postgres.cgtnpglqjpedhjfcputl` (includes project reference)

4. **Test connection:**
```powershell
cd server
node test-supabase-connection.js
```

---

## ✅ SOLUTION 2: Enable IPv6 on Your System

### Windows 10/11:

1. **Open PowerShell as Administrator**

2. **Check IPv6 status:**
```powershell
Get-NetAdapterBinding -ComponentID ms_tcpip6
```

3. **Enable IPv6:**
```powershell
Enable-NetAdapterBinding -Name "*" -ComponentID ms_tcpip6
```

4. **Restart network adapter:**
```powershell
Restart-NetAdapter -Name "Wi-Fi"
# Or for Ethernet:
Restart-NetAdapter -Name "Ethernet"
```

5. **Test connection:**
```powershell
ping -6 db.cgtnpglqjpedhjfcputl.supabase.co
```

---

## ✅ SOLUTION 3: Change DNS Servers

Sometimes DNS servers don't properly resolve IPv6 addresses.

### Steps:

1. **Open PowerShell as Administrator**

2. **Set Google DNS:**
```powershell
# For Wi-Fi adapter
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses ("8.8.8.8","8.8.4.4")

# For Ethernet adapter
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8","8.8.4.4")
```

3. **Flush DNS cache:**
```powershell
Clear-DnsClientCache
ipconfig /flushdns
```

4. **Test:**
```powershell
nslookup db.cgtnpglqjpedhjfcputl.supabase.co 8.8.8.8
```

5. **Try connection again:**
```powershell
cd server
node test-supabase-connection.js
```

---

## ✅ SOLUTION 4: Use Mobile Hotspot

If corporate network/firewall is blocking:

1. **Enable mobile hotspot** on your phone
2. **Connect computer** to mobile hotspot
3. **Try connection again**

This bypasses any corporate firewall/proxy restrictions.

---

## ✅ SOLUTION 5: Check Supabase Project Status

1. Go to Supabase dashboard
2. Check if project is **active** (not paused)
3. Free tier projects pause after 1 week inactivity
4. Click on project to resume (takes 30 seconds)

---

## ✅ SOLUTION 6: Update Node.js DNS Settings

Force Node.js to prefer IPv4:

**Create or edit:** `server/.npmrc`

```
# Force IPv4
dns-lookup-order=ipv4first
```

Or set environment variable:

**PowerShell:**
```powershell
$env:NODE_OPTIONS="--dns-result-order=ipv4first"
node test-supabase-connection.js
```

**CMD:**
```cmd
set NODE_OPTIONS=--dns-result-order=ipv4first
node test-supabase-connection.js
```

---

## ✅ SOLUTION 7: Alternative Cloud Databases

If Supabase continues to have issues, consider:

### A. Neon.tech (PostgreSQL)
- Free tier: 512MB database
- Better IPv4 support
- Very fast
- https://neon.tech

### B. Render PostgreSQL
- Free tier: 90 days, then $7/month
- Reliable connectivity
- https://render.com

### C. Railway.app
- $5 free credit (trial)
- Good for development
- https://railway.app

---

## 🧪 Testing Commands

### Test DNS Resolution:
```powershell
nslookup db.cgtnpglqjpedhjfcputl.supabase.co
nslookup db.cgtnpglqjpedhjfcputl.supabase.co 8.8.8.8
```

### Test IPv6 Connectivity:
```powershell
ping -6 db.cgtnpglqjpedhjfcputl.supabase.co
```

### Test Connection:
```powershell
cd server
node test-supabase-connection.js
```

### Test with Database Tools:
```powershell
# Using psql (if installed)
psql "postgresql://postgres.cgtnpglqjpedhjfcputl:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

---

## 📋 Recommended Solution Order

Try in this order:

1. ✅ **Solution 1: Connection Pooler** (Easiest, most reliable)
2. ✅ **Solution 3: Change DNS** (Quick to try)
3. ✅ **Solution 4: Mobile Hotspot** (Test if network issue)
4. ✅ **Solution 2: Enable IPv6** (System-level fix)
5. ✅ **Solution 6: Node.js DNS Settings** (Force IPv4)
6. ✅ **Solution 5: Check Project Status** (Supabase side)
7. ✅ **Solution 7: Alternative Database** (Last resort)

---

## 🎯 Most Likely Solution

**Use Supabase Connection Pooler** (Solution 1)

Update your `server/.env`:
```env
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.cgtnpglqjpedhjfcputl
DB_PASSWORD=hacktivators5
```

This should work immediately with no system changes!

---

## 💡 How to Get Pooler Connection String

1. Supabase Dashboard → **Settings** → **Database**
2. Scroll to **Connection string** section
3. Click **Connection pooling** tab
4. Mode: **Transaction**
5. Copy the URI, it looks like:
   ```
   postgresql://postgres.cgtnpglqjpedhjfcputl:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
6. Parse the values:
   - Host: `aws-0-ap-southeast-1.pooler.supabase.com`
   - Port: `6543`
   - User: `postgres.cgtnpglqjpedhjfcputl`
   - Password: Your password
   - Database: `postgres`

---

## ✅ After Connection Works

Once you can connect:

1. **Run migration:**
```powershell
cd server
pnpm migrate
```

2. **Verify tables:**
```powershell
node test-supabase-connection.js
```

3. **Start server:**
```powershell
pnpm dev
```

4. **Share config with team** (using the pooler settings)

---

## 🆘 Still Not Working?

If none of these work:

1. **Check your exact error:**
```powershell
cd server
node test-supabase-connection.js
```

2. **Verify internet:** Can you access https://supabase.com?

3. **Check firewall:** Is port 5432 or 6543 blocked?

4. **Try from different location:** Coffee shop WiFi, mobile hotspot

5. **Contact Supabase support:** They can check server-side issues

---

**Try Solution 1 (Connection Pooler) first - it's the most likely to work!**
