# PathForward Myanmar

**Connecting Myanmar's Youth to Their Future**

A university-integrated career network that connects verified students and freelancers with targeted company roles.

---

## 📚 Documentation Quick Links

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation instructions
- **[TEAM_GUIDE.md](TEAM_GUIDE.md)** - Development guide for team collaboration
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and status
- **[INSTALLATION_VERIFICATION.md](INSTALLATION_VERIFICATION.md)** - Testing checklist

---

## 🎯 Problem Statement

In Myanmar, a gap in verified experience and industry connections prevents qualified students from launching their careers and prevents companies from reliably hiring entry-level talent. Most job seekers lack verified academic records and real work experience, making recruitment risky and time-consuming.

## 💡 Solution

PathForward Myanmar is a dynamic talent platform that connects companies with Myanmar's untapped student talent through both formal internships and collaborative, company-sponsored projects. This gives students the verified, real-world experience they need, and gives companies a flexible, low-commitment way to discover and evaluate future hires.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Zustand

## 📁 Project Structure

```
PathForwardMyanmar/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities (API client)
│   │   └── store/         # State management (Zustand)
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utilities (JWT)
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PathForwardMyanmar
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE pathforward_myanmar;
```

### 3. Backend Setup

```bash
cd server
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials and JWT secret
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pathforward_myanmar
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_secret_key

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local if needed
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Key Features (MVP - Core)

### 1. Admin Panel
- Dashboard with analytics
- User management (students, companies, universities, freelancers)
- Role management
- Approve/verify universities and company accounts
- Monitor job posts
- Track platform activity

### 2. Student Module
- Registration & profile management
- Education, experience, and certificate tracking
- Job application system with CV upload
- Company reviews and feedback viewing
- Job preference settings (Onsite/Remote/OJT)

### 3. University Module
- Registration and verification
- Student profile verification
- Company connections
- Job post viewing
- Student employment tracking

### 4. Company Module
- Registration and verification
- Job/internship posting
- Applicant filtering and viewing
- Feedback and rating system for students

### 5. Freelancer Module
- Registration with portfolio
- Job browsing and application
- Availability status management

### 6. Authentication & Authorization
- Role-based access control (RBAC)
- JWT authentication
- Secure password hashing

## 🗄️ Database Schema

### Core Tables
- `users` - Base user authentication
- `students` - Student profiles
- `companies` - Company profiles
- `universities` - University profiles
- `freelancers` - Freelancer profiles
- `jobs` - Job/internship postings
- `applications` - Job applications
- `reviews` - Company reviews by students/freelancers
- `feedbacks` - Company feedback for students/freelancers
- `university_company_connections` - University-company partnerships
- `education` - Student education records
- `experience` - Student work experience
- `certificates` - Student certificates

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Additional endpoints will be implemented by the team for:
- Job management
- Application management
- Profile management
- Admin operations
- University-company connections

## 👥 User Roles

1. **Admin** - Platform management and oversight
2. **Student** - Job seeker from universities
3. **Company** - Job poster and employer
4. **University** - Student verification and management
5. **Freelancer** - Independent job seeker

## 🚧 Development Roadmap

### ✅ Phase 1 (Completed)
- [x] Project setup and structure
- [x] Database schema design
- [x] Authentication system with RBAC
- [x] Basic frontend structure
- [x] Login/Register pages
- [x] Dashboard placeholders for all roles

### 📋 Phase 2 (Team Implementation)
- [ ] Admin Panel features
- [ ] Student Module features
- [ ] Company Module features
- [ ] University Module features
- [ ] Freelancer Module features
- [ ] Search and filter system
- [ ] Notification system
- [ ] File upload functionality
- [ ] Multi-language support (English/Burmese)

### 🚀 Phase 3 (Future)
- [ ] Testing and bug fixes
- [ ] Production deployment
- [ ] Performance optimization

## 🤝 Contributing

This project is being developed by a team of 3 members. Each member should:

1. Create a feature branch for their module
2. Follow the existing code structure
3. Test their features thoroughly
4. Create pull requests for review
5. Document any new API endpoints

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/module-name

# Make changes and commit
git add .
git commit -m "Add: feature description"

# Push to remote
git push origin feature/module-name

# Create pull request on GitHub
```

## 📝 License

MIT License

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for Myanmar's Future**
