# PathForward Myanmar - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing the Application](#testing-the-application)
6. [Team Collaboration](#team-collaboration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Code Editor** (Recommended: VS Code)
   - Download from: https://code.visualstudio.com/

---

## Initial Setup

### 1. Clone the Repository

```bash
# If you haven't initialized git yet
cd PathForwardMyanmar
git init
git add .
git commit -m "Initial commit: Project setup with authentication"

# Create a new repository on GitHub and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 2. Project Structure Overview

```
PathForwardMyanmar/
├── client/          # Frontend (Next.js)
├── server/          # Backend (Node.js + Express)
├── README.md
└── SETUP_GUIDE.md
```

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pathforward_myanmar
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
JWT_SECRET=your_very_secure_secret_key_here_change_this
JWT_EXPIRE=7d

# Email Configuration (for future use)
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

### Step 3: Create PostgreSQL Database

Open PostgreSQL terminal (psql) or pgAdmin and run:

```sql
CREATE DATABASE pathforward_myanmar;
```

Or use command line:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pathforward_myanmar;

# Exit
\q
```

### Step 4: Run Database Migration

```bash
npm run migrate
```

You should see:
```
✅ Database connection established successfully.
✅ Database migration completed successfully!
📊 All models synchronized
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized
🚀 Server is running on port 5000
📍 Environment: development
```

### Step 6: Test Backend API

Open your browser or use curl:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "PathForward Myanmar API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Frontend Setup

### Step 1: Install Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### Step 2: Configure Environment Variables

Create `.env.local` file in the `client` directory:

```bash
cp .env.example .env.local
```

The default settings should work:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Start the Frontend

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Step 4: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Testing the Application

### 1. Register a New Account

1. Click "Register" button
2. Select a role (Student, Company, University, or Freelancer)
3. Fill in the registration form
4. Click "Register"

### 2. Login

1. Use the email and password you registered with
2. Click "Login"
3. You should be redirected to your role-specific dashboard

### 3. Test Different Roles

Register accounts with different roles to test:
- Student Dashboard
- Company Dashboard
- University Dashboard
- Freelancer Dashboard
- Admin Dashboard (manually set role to 'admin' in database)

### 4. API Testing with Postman/Thunder Client

#### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123",
  "phone": "09123456789",
  "role": "student",
  "profileData": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123"
}
```

#### Get Current User (Protected Route)
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

---

## Team Collaboration

### Git Workflow for 3 Team Members

#### Initial Setup for Each Team Member

```bash
# Clone the repository
git clone <repository-url>
cd PathForwardMyanmar

# Install dependencies
cd server && npm install
cd ../client && npm install

# Setup environment files
cd server && cp .env.example .env
cd ../client && cp .env.example .env.local

# Create database and run migration
npm run migrate (from server directory)
```

#### Feature Development Workflow

**Team Member 1: Admin Module**
```bash
git checkout -b feature/admin-panel
# Work on admin features
git add .
git commit -m "Add: Admin dashboard with user management"
git push origin feature/admin-panel
# Create Pull Request on GitHub
```

**Team Member 2: Student/Company Modules**
```bash
git checkout -b feature/student-company-module
# Work on student and company features
git add .
git commit -m "Add: Student profile and job application features"
git push origin feature/student-company-module
# Create Pull Request on GitHub
```

**Team Member 3: University/Freelancer Modules**
```bash
git checkout -b feature/university-freelancer-module
# Work on university and freelancer features
git add .
git commit -m "Add: University verification and freelancer portfolio"
git push origin feature/university-freelancer-module
# Create Pull Request on GitHub
```

#### Keeping Your Branch Updated

```bash
# Get latest changes from main
git checkout main
git pull origin main

# Update your feature branch
git checkout feature/your-feature
git merge main

# Resolve conflicts if any
# Then continue working
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error

**Error**: `Unable to connect to the database`

**Solution**:
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`
- Create database if missing: `CREATE DATABASE pathforward_myanmar;`

#### 2. Port Already in Use

**Error**: `Port 5000 (or 3000) is already in use`

**Solution**:
```bash
# Find and kill the process (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and kill the process (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

Or change the port in `.env` or `.env.local`

#### 3. JWT Secret Error

**Error**: `secretOrPrivateKey must have a value`

**Solution**:
- Ensure `JWT_SECRET` is set in `server/.env`
- Use a long, random string

#### 4. Module Not Found

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 5. Database Migration Issues

**Error**: Various database errors during migration

**Solution**:
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE pathforward_myanmar;
CREATE DATABASE pathforward_myanmar;
\q

# Run migration again
npm run migrate
```

#### 6. CORS Errors in Frontend

**Error**: CORS policy blocked

**Solution**:
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Restart backend server after changing `.env`

---

## Development Tips

### VS Code Extensions (Recommended)

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**
5. **PostgreSQL** (for database management)

### Database Management Tools

1. **pgAdmin** (GUI for PostgreSQL)
2. **DBeaver** (Universal database tool)
3. **TablePlus** (Modern database GUI)

### API Testing Tools

1. **Postman**
2. **Thunder Client** (VS Code extension)
3. **REST Client** (VS Code extension)

---

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test authentication
3. 📝 Implement your assigned module:
   - **Member 1**: Admin Panel
   - **Member 2**: Student & Company Modules
   - **Member 3**: University & Freelancer Modules
4. 🔄 Regular commits and pull requests
5. 🧪 Test thoroughly
6. 📚 Document new features

---

## Support

If you encounter any issues:

1. Check this guide first
2. Search for the error message
3. Check the console logs (both frontend and backend)
4. Ask team members for help
5. Create an issue on GitHub

---

**Happy Coding! 🚀**

Built with ❤️ for Myanmar's Future
