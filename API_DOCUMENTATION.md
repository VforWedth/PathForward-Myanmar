# PathForward Myanmar - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📍 Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Register a new user with role-specific profile

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "09123456789",
  "role": "student",
  "profileData": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Role-specific Profile Data**:

**Student**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "major": "Computer Science",
  "year": 3,
  "location": "Yangon"
}
```

**Company**:
```json
{
  "companyName": "Tech Corp Myanmar",
  "industry": "Information Technology",
  "location": "Yangon",
  "companySize": "51-200"
}
```

**University**:
```json
{
  "universityName": "University of Yangon",
  "location": "Yangon",
  "supportedMajors": ["Computer Science", "Engineering"]
}
```

**Freelancer**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "skills": ["Web Development", "Design"],
  "location": "Mandalay"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "student",
    "isVerified": false
  }
}
```

**Error Responses**:
- 400: User already exists
- 500: Server error

---

### 2. Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "student",
    "isVerified": false
  }
}
```

**Error Responses**:
- 400: Missing email or password
- 401: Invalid credentials or account deactivated
- 500: Server error

---

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Get current logged-in user profile

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "student",
    "isVerified": false,
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  },
  "profile": {
    "id": "uuid-here",
    "userId": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "major": "Computer Science",
    "year": 3,
    "location": "Yangon",
    "status": "available"
  }
}
```

**Error Responses**:
- 401: Not authorized or invalid token
- 500: Server error

---

## 📍 Future Endpoints (To Be Implemented by Team)

### Admin Routes
- `GET /admin/users` - Get all users (Admin only)
- `GET /admin/users/:id` - Get user by ID
- `PUT /admin/users/:id/verify` - Verify user account
- `PUT /admin/users/:id/deactivate` - Deactivate user
- `GET /admin/companies/pending` - Get pending company verifications
- `PUT /admin/companies/:id/verify` - Verify company
- `GET /admin/universities/pending` - Get pending university verifications
- `PUT /admin/universities/:id/verify` - Verify university
- `GET /admin/jobs` - Get all jobs
- `DELETE /admin/jobs/:id` - Remove inappropriate job
- `GET /admin/analytics` - Get platform analytics

### Student Routes
- `GET /students/profile` - Get student profile
- `PUT /students/profile` - Update student profile
- `POST /students/education` - Add education record
- `PUT /students/education/:id` - Update education record
- `DELETE /students/education/:id` - Delete education record
- `POST /students/experience` - Add experience record
- `PUT /students/experience/:id` - Update experience record
- `DELETE /students/experience/:id` - Delete experience record
- `POST /students/certificates` - Add certificate
- `DELETE /students/certificates/:id` - Delete certificate
- `POST /students/cv/upload` - Upload CV
- `GET /students/applications` - Get student's applications
- `POST /students/applications` - Apply for job
- `GET /students/feedbacks` - Get feedbacks from companies
- `POST /students/reviews` - Review a company
- `GET /jobs` - Browse available jobs
- `GET /jobs/:id` - Get job details

### Company Routes
- `GET /companies/profile` - Get company profile
- `PUT /companies/profile` - Update company profile
- `GET /companies/jobs` - Get company's job posts
- `POST /companies/jobs` - Create new job post
- `PUT /companies/jobs/:id` - Update job post
- `DELETE /companies/jobs/:id` - Delete job post
- `GET /companies/jobs/:id/applications` - Get applications for job
- `PUT /companies/applications/:id/status` - Update application status
- `POST /companies/feedbacks` - Give feedback to student
- `GET /companies/reviews` - Get company reviews
- `GET /companies/universities` - Get connected universities
- `POST /companies/universities/connect` - Request university connection

### University Routes
- `GET /universities/profile` - Get university profile
- `PUT /universities/profile` - Update university profile
- `GET /universities/students` - Get university students
- `PUT /universities/students/:id/verify` - Verify student
- `GET /universities/companies` - Get connected companies
- `PUT /universities/companies/:id/connection` - Approve/reject company connection
- `GET /universities/analytics` - Get student employment analytics

### Freelancer Routes
- `GET /freelancers/profile` - Get freelancer profile
- `PUT /freelancers/profile` - Update freelancer profile
- `PUT /freelancers/availability` - Update availability status
- `GET /freelancers/applications` - Get freelancer applications
- `POST /freelancers/applications` - Apply for project
- `GET /jobs` - Browse available jobs/projects
- `POST /freelancers/reviews` - Review a company
- `GET /freelancers/feedbacks` - Get feedbacks from companies

### Search & Filter Routes
- `GET /search/jobs` - Search jobs with filters
- `GET /search/students` - Search students (company/university only)
- `GET /search/companies` - Search companies
- `GET /search/freelancers` - Search freelancers

### Notification Routes
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

---

## 🔐 Role-Based Access Control

### Public Routes
- `POST /auth/register`
- `POST /auth/login`
- `GET /api/health`

### Protected Routes (All Authenticated Users)
- `GET /auth/me`
- `GET /notifications`

### Admin Only Routes
- All routes under `/admin/*`

### Student Only Routes
- Routes under `/students/*`

### Company Only Routes
- Routes under `/companies/*`

### University Only Routes
- Routes under `/universities/*`

### Freelancer Only Routes
- Routes under `/freelancers/*`

---

## 📊 Database Models Reference

### User Model
```javascript
{
  id: UUID,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['admin', 'student', 'company', 'university', 'freelancer'],
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date
}
```

### Student Model
```javascript
{
  id: UUID,
  userId: UUID (FK),
  universityId: UUID (FK),
  firstName: String,
  lastName: String,
  major: String,
  year: Integer (1-6),
  location: String,
  jobPreference: Enum ['onsite', 'remote', 'ojt', 'hybrid'],
  cvUrl: String,
  portfolioUrl: String,
  bio: Text,
  skills: Array[String],
  status: Enum ['available', 'on_job', 'internship_completed'],
  profilePicture: String
}
```

### Company Model
```javascript
{
  id: UUID,
  userId: UUID (FK),
  companyName: String,
  industry: String,
  location: String,
  description: Text,
  website: String,
  logo: String,
  companySize: Enum ['1-10', '11-50', '51-200', '201-500', '501+'],
  verificationStatus: Enum ['pending', 'approved', 'rejected'],
  verificationDocument: String
}
```

### University Model
```javascript
{
  id: UUID,
  userId: UUID (FK),
  universityName: String (unique),
  location: String,
  description: Text,
  website: String,
  logo: String,
  supportedMajors: Array[String],
  verificationStatus: Enum ['pending', 'approved', 'rejected'],
  verificationDocument: String
}
```

### Job Model
```javascript
{
  id: UUID,
  companyId: UUID (FK),
  title: String,
  description: Text,
  requirements: Text,
  responsibilities: Text,
  location: String,
  workMode: Enum ['onsite', 'remote', 'ojt', 'hybrid'],
  jobType: Enum ['internship', 'full-time', 'part-time', 'contract', 'freelance'],
  salaryRange: String,
  skillsRequired: Array[String],
  majorsPreferred: Array[String],
  experienceLevel: Enum ['entry', 'mid', 'senior'],
  status: Enum ['active', 'closed', 'draft'],
  deadline: Date,
  numberOfPositions: Integer
}
```

### Application Model
```javascript
{
  id: UUID,
  jobId: UUID (FK),
  applicantId: UUID,
  applicantType: Enum ['student', 'freelancer'],
  coverLetter: Text,
  status: Enum ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
  appliedAt: Date
}
```

---

## 🛠️ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes for Team

### Implementing New Routes

1. Create controller in `server/src/controllers/`
2. Create route file in `server/src/routes/`
3. Add route to `server/src/index.js`
4. Use `protect` middleware for authentication
5. Use `authorize('role1', 'role2')` for role-based access
6. Document the endpoint in this file

### Example Route Implementation

```javascript
// controllers/studentController.js
const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id }
    });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// routes/studentRoutes.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getProfile } = require('../controllers/studentController');

const router = express.Router();

router.get('/profile', protect, authorize('student'), getProfile);

module.exports = router;

// index.js
app.use('/api/students', studentRoutes);
```

---

## 🧪 Testing with Postman

### Import this collection to test APIs

Save as `PathForward.postman_collection.json`:

```json
{
  "info": {
    "name": "PathForward Myanmar API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"student@test.com\",\n  \"password\": \"password123\",\n  \"role\": \"student\",\n  \"profileData\": {\n    \"firstName\": \"John\",\n    \"lastName\": \"Doe\"\n  }\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"student@test.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/auth/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": "your_token_here"
    }
  ]
}
```

---

**Last Updated**: January 2024
**Maintained By**: PathForward Myanmar Development Team
