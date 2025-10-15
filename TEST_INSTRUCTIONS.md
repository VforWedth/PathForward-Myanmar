# Company & University Module Testing Instructions

## 🎯 Quick Start Testing Guide

### Prerequisites
- ✅ PostgreSQL database running
- ✅ Node.js installed
- ✅ npm or pnpm installed

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install  # or pnpm install
```

### 2. Configure Environment Variables

**Server (.env):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/pathforward
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Client (.env.local):**
```bash
cd client
cp .env.example .env.local
```

Edit `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Setup Database

```bash
cd server
npm run setup     # Setup PostgreSQL
npm run migrate   # Run migrations
```

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
✅ Database connected successfully
✅ Database models synchronized
🚀 Server is running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- ready in XXXms
```

---

## 🧪 Manual Testing Scenarios

### Scenario 1: Company Registration & University Connection

#### Step 1: Register as Company
1. Navigate to: `http://localhost:3000/register`
2. Select "Company" role
3. Fill in details:
   - Company Name: "Tech Solutions Myanmar"
   - Email: "company@example.com"
   - Password: "SecurePass123!"
   - Industry: "Technology"
   - Location: "Yangon, Myanmar"
4. Click "Register"
5. ✅ **Expected:** Registration successful, redirected to dashboard

#### Step 2: Browse Universities
1. Navigate to: `http://localhost:3000/company/universities`
2. ✅ **Expected:** See list of universities with:
   - University name
   - Location
   - Supported majors
   - Connection status: "Not Connected"
   - "Send Connection Request" button

#### Step 3: Send Connection Request
1. Click "Send Connection Request" on any university
2. ✅ **Expected:**
   - Success toast notification
   - Button changes to "Request Pending"
   - Status badge shows "Pending"

#### Step 4: View My Connections
1. Click "My Connections" button
2. Navigate to: `http://localhost:3000/company/universities/connected`
3. ✅ **Expected:**
   - See statistics (Total: 1, Pending: 1, Active: 0)
   - See pending connection in list
   - Status: "Pending"

### Scenario 2: University Approval & Connection

#### Step 1: Register as University
1. Open incognito/new browser
2. Navigate to: `http://localhost:3000/register`
3. Select "University" role
4. Fill in details:
   - University Name: "Yangon University of Technology"
   - Email: "university@example.com"
   - Password: "SecurePass123!"
   - Location: "Yangon, Myanmar"
5. Click "Register"

#### Step 2: View Connection Requests
1. Navigate to: `http://localhost:3000/university/connections`
2. Click "Connection Requests" tab
3. ✅ **Expected:**
   - See connection request from "Tech Solutions Myanmar"
   - Company details displayed
   - "Approve" and "Reject" buttons visible

#### Step 3: Approve Connection
1. Click "Approve" button
2. ✅ **Expected:**
   - Success notification
   - Request moved to "Connected Companies" tab
   - Status: "Connected"

#### Step 4: View Connected Companies
1. Click "Connected Companies" tab
2. ✅ **Expected:**
   - See "Tech Solutions Myanmar" with "Active" status
   - Connection date shown
   - "View Jobs" button available

### Scenario 3: Company Access Students

#### Step 1: Login as Company
1. Return to company account
2. Navigate to: `http://localhost:3000/company/universities/connected`
3. ✅ **Expected:**
   - Statistics updated (Active: 1)
   - Connection status: "Active"
   - "View Students" button enabled

#### Step 2: View University Students
1. Click "View Students" button
2. ✅ **Expected:**
   - Navigate to students page
   - See list of students from connected university
   - Student details visible (name, major, year, skills)
   - Can filter by major, year
   - Search functionality works

### Scenario 4: University View Company Jobs

#### Step 1: Company Creates Job
1. As company, navigate to: `http://localhost:3000/company/jobs/post`
2. Create a new job posting
3. Fill in job details
4. Submit job

#### Step 2: University Views Jobs
1. As university, navigate to: `http://localhost:3000/university/companies`
2. Click "Available Jobs" tab
3. ✅ **Expected:**
   - See jobs from connected companies
   - Job details displayed
   - "Share with Students" button available

---

## 🔧 API Endpoint Testing (using curl)

### Company Endpoints

**1. Register Company**
```bash
curl -X POST http://localhost:5000/api/company/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tech Solutions",
    "email": "tech@example.com",
    "password": "Pass123!",
    "industry": "Technology",
    "location": "Yangon"
  }'
```

**2. Get All Universities**
```bash
curl -X GET http://localhost:5000/api/company/universities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Send Connection Request**
```bash
curl -X POST http://localhost:5000/api/company/universities/UNIVERSITY_ID/connect \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Request for partnership"}'
```

**4. Get Connected Universities**
```bash
curl -X GET http://localhost:5000/api/company/universities/connected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**5. Get University Students**
```bash
curl -X GET http://localhost:5000/api/company/universities/UNIVERSITY_ID/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### University Endpoints

**1. Get Connection Requests**
```bash
curl -X GET http://localhost:5000/api/university/connection-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**2. Approve Connection**
```bash
curl -X PUT http://localhost:5000/api/university/connection-requests/CONNECTION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'
```

**3. Get Connected Companies**
```bash
curl -X GET http://localhost:5000/api/university/connected-companies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Get Job Posts**
```bash
curl -X GET http://localhost:5000/api/university/job-posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ Verification Checklist

### Frontend Checks

#### Company Module
- [ ] Can access `/company/dashboard`
- [ ] Can view `/company/universities` (browse all universities)
- [ ] Can view `/company/universities/connected` (my connections)
- [ ] Can view `/company/jobs` (job management)
- [ ] Can view `/company/applicants` (applicant management)
- [ ] Can view `/company/feedback` (feedback system)
- [ ] Can view `/company/analytics` (analytics dashboard)
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Data loads dynamically

#### University Module
- [ ] Can access `/university/dashboard`
- [ ] Can view `/university/students` (student management)
- [ ] Can view `/university/connections` (connection management)
- [ ] Can view `/university/companies` (partner companies & jobs)
- [ ] Can view `/university/analytics` (analytics)
- [ ] Can view `/university/employment` (employment tracking)
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Data loads dynamically

### Backend Checks

#### Company API
- [ ] `POST /api/company/register` works
- [ ] `GET /api/company/profile` returns data
- [ ] `PUT /api/company/profile` updates data
- [ ] `GET /api/company/universities` returns all universities
- [ ] `POST /api/company/universities/:id/connect` creates connection
- [ ] `GET /api/company/universities/connected` returns connections
- [ ] `GET /api/company/universities/:id/students` returns students (only if active)
- [ ] `DELETE /api/company/universities/:id/disconnect` removes connection

#### University API
- [ ] `GET /api/university/profile` returns data
- [ ] `PUT /api/university/profile` updates data
- [ ] `GET /api/university/students` returns students
- [ ] `GET /api/university/connection-requests` returns pending requests
- [ ] `PUT /api/university/connection-requests/:id` approves/rejects
- [ ] `GET /api/university/connected-companies` returns connections
- [ ] `GET /api/university/job-posts` returns jobs from connected companies

### Integration Checks

#### Connection Flow
- [ ] Company can send connection request
- [ ] University receives connection request
- [ ] University can approve request
- [ ] Connection status changes to "active"
- [ ] Company can see "View Students" button
- [ ] Company can access students after approval
- [ ] University can see company jobs after approval
- [ ] Either party can disconnect

#### Data Flow
- [ ] Connection status syncs in real-time
- [ ] Students only visible to connected companies
- [ ] Jobs only visible to connected universities
- [ ] Statistics update correctly
- [ ] Filters work properly

#### Security
- [ ] Cannot access students without active connection
- [ ] Cannot access APIs without authentication
- [ ] Cannot access other company/university data
- [ ] Connection approval required for data access

---

## 🐛 Troubleshooting

### Issue: Server won't start
**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Check environment variables
cat server/.env

# Install dependencies
cd server && npm install
```

### Issue: Database connection error
**Solution:**
```bash
# Verify DATABASE_URL in server/.env
# Run setup script
cd server
npm run setup
```

### Issue: Frontend API calls fail
**Solution:**
```bash
# Check NEXT_PUBLIC_API_URL in client/.env.local
# Verify server is running on correct port
# Check CORS configuration in server/src/index.js
```

### Issue: "Connection not found" when viewing students
**Solution:**
- Verify connection status is "active"
- Check database for connection record
- Ensure university approved the request

### Issue: Students not showing
**Solution:**
- Verify university has students in database
- Check if connection is active
- Verify API endpoint returns data
- Check browser console for errors

---

## 📊 Expected Test Results

### Successful Connection Flow

```
1. Company Registration ✅
   → Company profile created
   → JWT token received
   
2. Browse Universities ✅
   → List of universities displayed
   → Status: "Not Connected"
   
3. Send Connection Request ✅
   → API returns success
   → Status changes to "Pending"
   → Connection record created in DB
   
4. University Login ✅
   → University dashboard loads
   → Connection request visible
   
5. Approve Request ✅
   → Status changes to "Active"
   → Connection timestamp updated
   → Company notified
   
6. Access Students ✅
   → "View Students" button enabled
   → Student list loads
   → Can filter/search students
   
7. View Jobs ✅
   → University can see company jobs
   → Job details displayed
   → Can share with students
```

### Database Verification

After successful connection:

```sql
-- Check connection exists
SELECT * FROM university_company_connections 
WHERE status = 'active';

-- Verify relationships
SELECT 
  c.companyName,
  u.universityName,
  ucc.status,
  ucc.connectedAt
FROM university_company_connections ucc
JOIN companies c ON ucc.companyId = c.id
JOIN universities u ON ucc.universityId = u.id;
```

---

## 📝 Test Report Template

Use this template to document your test results:

```markdown
## Test Session Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** Development

### Test Results

#### Company Module
- [ ] Registration: PASS/FAIL
- [ ] Browse Universities: PASS/FAIL
- [ ] Send Connection: PASS/FAIL
- [ ] View Connections: PASS/FAIL
- [ ] View Students: PASS/FAIL

#### University Module
- [ ] View Requests: PASS/FAIL
- [ ] Approve Connection: PASS/FAIL
- [ ] View Companies: PASS/FAIL
- [ ] View Jobs: PASS/FAIL

#### Integration
- [ ] Connection Flow: PASS/FAIL
- [ ] Data Access: PASS/FAIL
- [ ] Security: PASS/FAIL

### Issues Found
1. [Issue description]
2. [Issue description]

### Notes
[Additional observations]
```

---

## 🎉 Success Criteria

Your implementation is verified if:

✅ All frontend pages load without errors  
✅ All API endpoints return expected data  
✅ Connection workflow completes successfully  
✅ Companies can access students after approval  
✅ Universities can see company jobs  
✅ No unauthorized access to protected data  
✅ UI updates reflect database changes  
✅ Forms validate and submit correctly  
✅ Error messages are clear and helpful  
✅ Navigation works smoothly  

---

**For additional help, refer to:**
- `VERIFICATION_REPORT.md` - Complete verification analysis
- `API_DOCUMENTATION.md` - API reference
- `COMPANY_UNIVERSITY_CONNECTION_ANALYSIS.md` - Connection feature details
