# Admin Module Development Plan

## 📋 Overview

Building the complete Admin Panel with:
1. Dashboard with analytics
2. User management system
3. Verification system (companies & universities)
4. Job post monitoring
5. Platform activity tracking

---

## 🗄️ Database Analysis

### ✅ Existing Models (Ready to Use):
- **User** - Has 'admin' role, isVerified, isActive fields
- **Company** - Has verificationStatus (pending/approved/rejected)
- **University** - Has verificationStatus (pending/approved/rejected)
- **Student** - All student data
- **Freelancer** - All freelancer data
- **Job** - All job postings with status field
- **Application** - Job applications
- **Review** - Company reviews
- **Feedback** - Performance feedback

### 🆕 New Model Needed:
- **ActivityLog** - Track admin actions for audit trail

---

## 🎯 Implementation Plan

### **Phase 1: Database**
1. Create ActivityLog model
2. Add admin helper methods
3. Run migration

### **Phase 2: Backend APIs**

#### **A. Admin Dashboard API** (`/api/admin/dashboard`)
- GET - Platform statistics
  - Total users (by role)
  - Pending verifications
  - Active jobs
  - Recent applications
  - User growth chart data

#### **B. User Management API** (`/api/admin/users`)
- GET `/users` - List all users with pagination/filters
- GET `/users/:id` - Get user details
- PUT `/users/:id` - Update user
- PUT `/users/:id/verify` - Verify user
- PUT `/users/:id/deactivate` - Deactivate user
- DELETE `/users/:id` - Delete user (soft delete)

#### **C. Verification API** (`/api/admin/verify`)
- GET `/verify/companies` - Pending companies
- PUT `/verify/companies/:id` - Approve/reject company
- GET `/verify/universities` - Pending universities
- PUT `/verify/universities/:id` - Approve/reject university

#### **D. Job Moderation API** (`/api/admin/jobs`)
- GET `/jobs` - All jobs with filters
- GET `/jobs/:id` - Job details
- PUT `/jobs/:id/status` - Update job status
- DELETE `/jobs/:id` - Remove inappropriate job

#### **E. Activity Logs API** (`/api/admin/activity`)
- GET `/activity` - Recent admin actions
- GET `/activity/:userId` - User-specific activity

### **Phase 3: Frontend Pages**

#### **Page 1: Admin Dashboard**
- Platform statistics cards
- Charts (user growth, job postings)
- Recent activity feed
- Quick actions

#### **Page 2: User Management**
- User list table with pagination
- Search and filters
- Bulk actions
- User detail modal

#### **Page 3: Company Verification**
- Pending companies list
- Company details view
- Approve/reject with feedback
- Document viewer

#### **Page 4: University Verification**
- Pending universities list
- University details view
- Approve/reject with feedback
- Document viewer

#### **Page 5: Job Moderation**
- All jobs list
- Inappropriate content filters
- Job details view
- Delete/close jobs

#### **Page 6: Activity Logs**
- Admin action history
- Filter by admin/date/action
- Export logs

---

## 📊 API Endpoints Summary

```
Admin Dashboard:
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/charts

User Management:
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
PUT    /api/admin/users/:id/verify
PUT    /api/admin/users/:id/toggle-active
DELETE /api/admin/users/:id

Verification:
GET    /api/admin/companies/pending
PUT    /api/admin/companies/:id/verify
GET    /api/admin/universities/pending
PUT    /api/admin/universities/:id/verify

Job Moderation:
GET    /api/admin/jobs
GET    /api/admin/jobs/:id
PUT    /api/admin/jobs/:id/status
DELETE /api/admin/jobs/:id

Activity Logs:
GET    /api/admin/activity
POST   /api/admin/activity (internal use)
```

---

## 🔐 Security

All admin routes will be protected with:
```javascript
router.use(protect, authorize('admin'));
```

Only users with `role: 'admin'` can access these endpoints.

---

## 📁 File Structure

```
server/src/
├── models/
│   └── ActivityLog.js              (NEW)
│
├── controllers/
│   └── adminController.js          (NEW)
│
├── routes/
│   └── adminRoutes.js              (NEW)
│
└── utils/
    └── activityLogger.js           (NEW - helper)

client/src/app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx               (UPDATE)
│   ├── users/
│   │   ├── page.tsx               (NEW)
│   │   └── [id]/page.tsx          (NEW)
│   ├── companies/
│   │   └── verify/page.tsx        (NEW)
│   ├── universities/
│   │   └── verify/page.tsx        (NEW)
│   ├── jobs/
│   │   └── page.tsx               (NEW)
│   └── activity/
│       └── page.tsx               (NEW)
```

---

## ✅ Checklist

### Backend:
- [ ] Create ActivityLog model
- [ ] Create adminController.js
- [ ] Implement dashboard stats API
- [ ] Implement user management APIs
- [ ] Implement verification APIs
- [ ] Implement job moderation APIs
- [ ] Implement activity logging
- [ ] Create adminRoutes.js
- [ ] Add routes to server/src/index.js
- [ ] Test all endpoints with Postman

### Frontend:
- [ ] Create shared admin layout
- [ ] Build dashboard page with charts
- [ ] Build user management page
- [ ] Build user details page
- [ ] Build company verification page
- [ ] Build university verification page
- [ ] Build job moderation page
- [ ] Build activity logs page
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all pages
- [ ] Mobile responsive

---

## 🚀 Let's Start!

**First, we'll create:**
1. ActivityLog model (database)
2. Admin controller (backend logic)
3. Admin routes (API endpoints)
4. Admin dashboard (frontend)

Then test everything before moving to next features.

Ready to begin? 🎯
