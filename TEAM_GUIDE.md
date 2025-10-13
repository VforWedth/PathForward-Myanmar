# Team Guide - PathForward Myanmar

## 👥 Team Structure

### 3 Team Members Working in Parallel

**Member 1: Admin Module** 🔧
- Admin dashboard with analytics
- User management system
- Verification system for companies and universities
- Job post monitoring
- Platform activity tracking

**Member 2: Student & Company Modules** 👨‍🎓🏢
- Student profile and registration
- Job application system
- CV upload functionality
- Company job posting
- Applicant filtering
- Feedback and rating system

**Member 3: University & Freelancer Modules** 🎓💼
- University registration and verification
- Student verification by universities
- Company-university connections
- Employment tracking
- Freelancer profile and portfolio
- Freelancer job browsing


## 🚀 Quick Start for Each Team Member

### First Time Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd PathForwardMyanmar

# 2. Install server dependencies
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials

# 3. Create database
# Open PostgreSQL terminal
psql -U postgres
CREATE DATABASE pathforward_myanmar;
\q

# 4. Run database migration
npm run migrate

# 5. Start backend server (in server directory)
npm run dev

# 6. Open new terminal - Install client dependencies
cd ../client
npm install
cp .env.example .env.local

# 7. Start frontend (in client directory)
npm run dev
```

### Your Server Should Show:
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
```

### Your Frontend Should Show:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## 📂 File Structure You'll Work With

### Backend Structure (server/)
```
server/
├── src/
│   ├── controllers/        # 👈 Add your controller logic here
│   │   ├── authController.js (✅ Done)
│   │   ├── adminController.js (❌ Member 1)
│   │   ├── studentController.js (❌ Member 2)
│   │   ├── companyController.js (❌ Member 2)
│   │   ├── universityController.js (❌ Member 3)
│   │   └── freelancerController.js (❌ Member 3)
│   │
│   ├── routes/             # 👈 Add your routes here
│   │   ├── authRoutes.js (✅ Done)
│   │   ├── adminRoutes.js (❌ Member 1)
│   │   ├── studentRoutes.js (❌ Member 2)
│   │   ├── companyRoutes.js (❌ Member 2)
│   │   ├── universityRoutes.js (❌ Member 3)
│   │   └── freelancerRoutes.js (❌ Member 3)
│   │
│   ├── models/             # ✅ All models are done!
│   ├── middleware/         # ✅ Auth middleware done!
│   └── index.js           # Add your routes here
```

### Frontend Structure (client/)
```
client/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx (❌ Member 1 - Implement features)
│   │   │
│   │   ├── student/
│   │   │   └── dashboard/
│   │   │       └── page.tsx (❌ Member 2 - Implement features)
│   │   │
│   │   ├── company/
│   │   │   └── dashboard/
│   │   │       └── page.tsx (❌ Member 2 - Implement features)
│   │   │
│   │   ├── university/
│   │   │   └── dashboard/
│   │   │       └── page.tsx (❌ Member 3 - Implement features)
│   │   │
│   │   └── freelancer/
│   │       └── dashboard/
│   │           └── page.tsx (❌ Member 3 - Implement features)
│   │
│   ├── components/         # 👈 Create reusable components here
│   ├── lib/
│   │   └── api.ts         # ✅ API client ready to use
│   └── store/
│       └── authStore.ts   # ✅ Auth store ready to use
```

---

## 🔧 How to Add New Features

### Example: Adding Job Management (Member 2)

#### Step 1: Create Controller (Backend)

**File**: `server/src/controllers/companyController.js`

```javascript
const { Job, Company } = require('../models');

// Get all jobs for a company
exports.getMyJobs = async (req, res) => {
  try {
    // req.user contains authenticated user info
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    const jobs = await Job.findAll({
      where: { companyId: company.id }
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    const job = await Job.create({
      companyId: company.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
```

#### Step 2: Create Routes (Backend)

**File**: `server/src/routes/companyRoutes.js`

```javascript
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getMyJobs,
  createJob
} = require('../controllers/companyController');

const router = express.Router();

// All routes require authentication and company role
router.use(protect, authorize('company'));

router.get('/jobs', getMyJobs);
router.post('/jobs', createJob);

module.exports = router;
```

#### Step 3: Register Routes (Backend)

**File**: `server/src/index.js`

```javascript
// Add this line with other route imports
const companyRoutes = require('./routes/companyRoutes');

// Add this line with other route registrations
app.use('/api/companies', companyRoutes);
```

#### Step 4: Create API Functions (Frontend)

**File**: `client/src/lib/api.ts` (add these functions)

```typescript
// Job APIs
export const jobAPI = {
  getMyJobs: () => api.get('/companies/jobs'),
  createJob: (data: any) => api.post('/companies/jobs', data),
};
```

#### Step 5: Use in Dashboard (Frontend)

**File**: `client/src/app/company/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function CompanyDashboard() {
  const { user, logout } = useAuthStore();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/companies/jobs');
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  return (
    <div>
      <h1>My Jobs</h1>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

---

## 🌿 Git Workflow

### Daily Workflow

```bash
# 1. Start of day - get latest changes
git checkout main
git pull origin main

# 2. Create/switch to your feature branch
git checkout -b feature/your-feature-name

# 3. Work on your code...

# 4. Save your work regularly
git add .
git commit -m "Add: description of what you added"

# 5. Push to GitHub
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
# Go to GitHub and click "Create Pull Request"
```

### Branch Naming Convention

- **Member 1 (Admin)**: `feature/admin-dashboard`, `feature/admin-verification`
- **Member 2 (Student/Company)**: `feature/student-profile`, `feature/job-posting`
- **Member 3 (University/Freelancer)**: `feature/university-verification`, `feature/freelancer-portfolio`

### Commit Message Format

```
Add: New feature
Update: Existing feature improvement
Fix: Bug fix
Refactor: Code restructuring
Docs: Documentation changes
Style: Formatting changes
```

Examples:
```bash
git commit -m "Add: Admin user management page"
git commit -m "Update: Student profile form validation"
git commit -m "Fix: Job application submission error"
```

---

## 🔐 Using Authentication in Your Code

### Backend - Protect Routes

```javascript
const { protect, authorize } = require('../middleware/auth');

// Only authenticated users
router.get('/profile', protect, getProfile);

// Only specific roles
router.get('/admin-only', protect, authorize('admin'), adminFunction);
router.get('/company-only', protect, authorize('company'), companyFunction);

// Multiple roles allowed
router.get('/students-or-freelancers',
  protect,
  authorize('student', 'freelancer'),
  someFunction
);
```

### Frontend - Access User Info

```typescript
import { useAuthStore } from '@/store/authStore';

export default function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();

  // user.id - User ID
  // user.email - User email
  // user.role - User role
  // user.isVerified - Verification status

  return <div>Hello {user?.email}</div>;
}
```

### Frontend - Make API Calls

```typescript
import api from '@/lib/api';

// GET request
const response = await api.get('/companies/jobs');
const jobs = response.data.data;

// POST request
const response = await api.post('/companies/jobs', {
  title: 'Software Engineer',
  description: 'Job description...'
});

// PUT request
await api.put(`/companies/jobs/${jobId}`, updateData);

// DELETE request
await api.delete(`/companies/jobs/${jobId}`);
```

---

## 📊 Available Database Models

All models are ready to use! Import them in your controllers:

```javascript
const {
  User,
  Student,
  Company,
  University,
  Freelancer,
  Job,
  Application,
  Review,
  Feedback,
  UniversityCompanyConnection,
  Education,
  Experience,
  Certificate
} = require('../models');
```

### Common Sequelize Operations

```javascript
// Find one
const user = await User.findByPk(userId);
const student = await Student.findOne({ where: { userId } });

// Find all
const jobs = await Job.findAll({ where: { companyId } });

// Create
const job = await Job.create({ title: 'Engineer', companyId });

// Update
await job.update({ title: 'Senior Engineer' });

// Delete
await job.destroy();

// With relations
const student = await Student.findOne({
  where: { userId },
  include: [
    { model: University },
    { model: Education },
    { model: Experience }
  ]
});
```

---

## 🧪 Testing Your Work

### Test Backend API

Use Postman or Thunder Client:

1. First login to get token:
```
POST http://localhost:5000/api/auth/login
{
  "email": "test@test.com",
  "password": "password123"
}
```

2. Copy the token from response

3. Test your endpoint:
```
GET http://localhost:5000/api/companies/jobs
Authorization: Bearer <your_token>
```

### Test Frontend

1. Start both servers (backend and frontend)
2. Navigate to `http://localhost:3000`
3. Register/Login
4. Test your features

---

## 📞 Communication

### Before Starting Work
1. Announce in team chat which feature you're working on
2. Check if anyone else is working on related files
3. Pull latest changes from main branch

### During Work
1. Commit and push regularly (at least daily)
2. Ask for help if stuck for more than 1 hour
3. Update team on progress

### After Completing Feature
1. Test thoroughly
2. Create Pull Request
3. Request review from team members
4. Update documentation if needed

---

## 🐛 Common Issues & Solutions

### "Port already in use"
```bash
# Kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Database connection failed"
- Check PostgreSQL is running
- Verify .env credentials
- Ensure database exists

### "Token expired" or "Unauthorized"
- Login again to get new token
- Check token in Authorization header

---

## 📝 Checklist for Each Feature

- [ ] Backend controller created
- [ ] Backend routes created
- [ ] Routes registered in server/src/index.js
- [ ] Frontend API functions created
- [ ] Frontend UI implemented
- [ ] Error handling added
- [ ] Tested with Postman
- [ ] Tested in browser
- [ ] Code committed and pushed
- [ ] Pull request created

---

## 🎯 Your Assigned Tasks

### Member 1: Admin Module
- [ ] Admin dashboard with analytics
- [ ] User list with filters
- [ ] User verification (companies, universities)
- [ ] Job post moderation
- [ ] Platform statistics

### Member 2: Student & Company Modules
- [ ] Student profile management
- [ ] Job application system
- [ ] CV upload
- [ ] Company job posting
- [ ] Applicant management
- [ ] Feedback system

### Member 3: University & Freelancer Modules
- [ ] University profile management
- [ ] Student verification
- [ ] Company connections
- [ ] Employment tracking
- [ ] Freelancer profile
- [ ] Freelancer job browsing

---

## 📚 Resources

- [Sequelize Docs](https://sequelize.org/docs/v6/)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 💡 Tips for Success

1. **Read the code that's already there** - Follow the patterns in authController and authRoutes
2. **Test frequently** - Don't write too much code before testing
3. **Ask questions early** - Don't waste time being stuck
4. **Document as you go** - Add comments for complex logic
5. **Keep commits small** - Easier to review and debug
6. **Use console.log** - Debug your code step by step

---

**You've got this! 🚀**

The foundation is solid. Just follow the patterns and build your features step by step!
