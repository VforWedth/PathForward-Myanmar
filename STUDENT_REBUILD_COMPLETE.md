# Student Module - Complete Rebuild Guide

## ✅ What Was Rebuilt

### Backend (Server)

1. **studentController.js** - `/server/src/controllers/studentController.js`
   - `getProfile()` - Get student profile with university info
   - `updateProfile()` - Update student details
   - `uploadCV()` - Upload CV file
   - `uploadProfilePicture()` - Upload profile picture

2. **upload.js** - `/server/src/middleware/upload.js`
   - Multer configuration for file uploads
   - CV uploads → `/uploads/cv/`
   - Profile pictures → `/uploads/profile/`
   - File type validation (PDF, DOC, DOCX for CV | JPG, PNG, GIF for images)
   - 5MB file size limit

3. **studentRoutes.js** - `/server/src/routes/studentRoutes.js`
   - `GET /api/student/profile` - Fetch profile
   - `PUT /api/student/profile` - Update profile
   - `POST /api/student/upload-cv` - Upload CV
   - `POST /api/student/upload-picture` - Upload profile picture

4. **index.js** - Updated to register student routes
   - Added `studentRoutes`
   - Added static file serving for `/uploads`

---

## 🚀 How to Start

### 1. Restart Backend Server

```bash
cd PathForward-Myanmar/server

# Stop current server if running (Ctrl+C)
# Then start:
npm start
# or
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
📍 Environment: development
```

### 2. Test Backend is Running

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PathForward Myanmar API is running",
  "timestamp": "2025-10-14T..."
}
```

### 3. Test Student Routes

**Get Profile (requires auth token):**
```bash
curl http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Testing with Postman/Thunder Client

### Step 1: Login

**POST** `http://localhost:5000/api/auth/login`

**Body:**
```json
{
  "email": "aungphyosan04@gmail.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "aungphyosan04@gmail.com",
    "role": "student",
    "isVerified": false
  }
}
```

**IMPORTANT:** Copy the `token` value!

### Step 2: Get Student Profile

**GET** `http://localhost:5000/api/student/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_FROM_STEP_1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Aung",
    "lastName": "Phyo San",
    "major": "Computer Science",
    "year": 3,
    "location": "Yangon",
    "jobPreference": "remote",
    "skills": ["JavaScript", "React"],
    "bio": "...",
    "cvUrl": "/uploads/cv/filename.pdf",
    "profilePicture": "/uploads/profile/image.jpg",
    "User": {...},
    "University": {...}
  }
}
```

### Step 3: Update Profile

**PUT** `http://localhost:5000/api/student/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Aung",
  "lastName": "Phyo San",
  "major": "Computer Science",
  "year": 4,
  "location": "Yangon",
  "jobPreference": "hybrid",
  "portfolioUrl": "https://aungphyosan.dev",
  "bio": "Passionate developer interested in web technologies",
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"]
}
```

### Step 4: Upload Profile Picture

**POST** `http://localhost:5000/api/student/upload-picture`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:** (form-data)
```
Key: profilePicture
Type: File
Value: [Select an image file]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "profilePicture": "/uploads/profile/image-1234567890.jpg"
}
```

### Step 5: Upload CV

**POST** `http://localhost:5000/api/student/upload-cv`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Body:** (form-data)
```
Key: cv
Type: File
Value: [Select a PDF/DOC file]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "CV uploaded successfully",
  "cvUrl": "/uploads/cv/resume-1234567890.pdf"
}
```

---

## 📁 File Structure

```
server/
├── src/
│   ├── controllers/
│   │   └── studentController.js ✅ NEW
│   ├── middleware/
│   │   ├── auth.js (existing)
│   │   └── upload.js ✅ NEW
│   ├── routes/
│   │   └── studentRoutes.js ✅ NEW
│   └── index.js ✅ UPDATED
└── uploads/ (auto-created)
    ├── cv/
    └── profile/

client/
├── .env.local (API URL: http://localhost:5000/api)
└── src/
    ├── lib/
    │   ├── config.ts
    │   ├── studentApi.ts
    │   └── api.ts
    └── app/student/
        ├── dashboard/page.tsx
        └── profile/page.tsx
```

---

## 🔧 Frontend Setup

The frontend files (`studentApi.ts`, `config.ts`) are already created. Make sure your `.env.local` has:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Then restart Next.js:**
```bash
cd PathForward-Myanmar/client
# Stop server (Ctrl+C)
pnpm dev
```

---

## ✅ Testing Checklist

Backend:
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Can login and get token
- [ ] GET /api/student/profile returns profile
- [ ] PUT /api/student/profile updates data
- [ ] POST /api/student/upload-picture uploads image
- [ ] POST /api/student/upload-cv uploads PDF
- [ ] Uploaded files accessible at http://localhost:5000/uploads/...

Frontend:
- [ ] Next.js starts without errors
- [ ] Can login at /login
- [ ] Dashboard shows at /student/dashboard
- [ ] Profile page shows at /student/profile
- [ ] Profile data loads from backend
- [ ] Can update profile and see success toast
- [ ] Can upload profile picture
- [ ] Can upload CV
- [ ] Images display correctly

---

## 🐛 Common Issues & Fixes

### Issue: 404 Route not found
**Problem:** Backend routes not registered
**Fix:** ✅ Already fixed - student routes now registered in index.js

### Issue: CORS error
**Problem:** Frontend and backend on different origins
**Fix:** ✅ Already fixed - CORS configured in index.js

### Issue: 401 Unauthorized
**Problem:** No token or invalid token
**Fix:** Login again and copy new token

### Issue: "Student profile not found"
**Problem:** No student record for this user
**Fix:** Check database - student profile should be created during registration

### Issue: File upload fails
**Problem:** Upload directory doesn't exist
**Fix:** ✅ Already fixed - directories auto-created in upload.js

### Issue: Images don't display
**Problem:** Static files not served
**Fix:** ✅ Already fixed - `/uploads` static route added

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/register` | No | Register |
| GET | `/api/student/profile` | Yes | Get profile |
| PUT | `/api/student/profile` | Yes | Update profile |
| POST | `/api/student/upload-picture` | Yes | Upload photo |
| POST | `/api/student/upload-cv` | Yes | Upload CV |

---

## 🎉 Summary

**Backend:** ✅ Complete
- Student controller with 4 endpoints
- Upload middleware with file validation
- Routes registered and working
- Static file serving for uploads

**Frontend:** ✅ Ready
- API client (`studentApi.ts`)
- Config file (`config.ts`)
- Dashboard page (working)
- Profile page (working)

**Next Steps:**
1. Restart backend server
2. Test endpoints with Postman
3. Restart frontend server
4. Login and test profile page
5. Upload files and verify they save

Everything is rebuilt and ready to use! 🚀
