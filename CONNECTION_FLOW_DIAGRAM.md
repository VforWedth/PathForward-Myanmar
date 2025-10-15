# Company-University Connection Flow Diagram

## Connection Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONNECTION LIFECYCLE FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: Company Browses Universities
┌──────────────┐
│   Company    │──► GET /api/company/universities
│   Dashboard  │    Returns: All universities with connection status
└──────────────┘    {connectionStatus: 'not_connected', 'pending', 'active'}

                    ↓

STEP 2: Company Initiates Connection Request
┌──────────────┐
│   Company    │──► POST /api/company/universities/:id/connect
│   Clicks     │    Creates: UniversityCompanyConnection {status: 'pending'}
│   "Connect"  │
└──────────────┘

                    ↓

STEP 3: University Receives Request
┌──────────────┐
│  University  │──► GET /api/university/connection-requests
│  Dashboard   │    Returns: Pending connection requests from companies
└──────────────┘

                    ↓

STEP 4a: University Approves           STEP 4b: University Rejects
┌──────────────┐                       ┌──────────────┐
│  University  │                       │  University  │
│  Clicks      │                       │  Clicks      │
│  "Approve"   │                       │  "Reject"    │
└──────┬───────┘                       └──────┬───────┘
       │                                      │
       │ PUT /api/university/                │ PUT /api/university/
       │ connection-requests/:id             │ connection-requests/:id
       │ {action: 'approve'}                 │ {action: 'reject'}
       │                                      │
       ↓                                      ↓
   status: 'active'                      status: 'rejected'
   connectedAt: now()                    
                                              
                    ↓

STEP 5: Data Sharing Enabled (Only if Active)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Company Can Access:                University Can Access:      │
│  ✓ Student list                     ✓ Job postings             │
│  ✓ Student profiles                 ✓ Company details          │
│  ✓ Filter by major/year             ✓ Share jobs with students │
│  ✓ Search students                  ✓ View job requirements    │
│                                                                 │
│  GET /api/company/universities/     GET /api/university/       │
│      :id/students                       job-posts              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                    ↓

STEP 6: Disconnect (Optional)
┌──────────────┐                       ┌──────────────┐
│   Company    │                       │  University  │
│   Can        │                       │  Can         │
│   Disconnect │                       │  Disconnect  │
└──────┬───────┘                       └──────┬───────┘
       │                                      │
       │ DELETE /api/company/                │ DELETE /api/university/
       │ universities/:id/disconnect         │ disconnect-company/:id
       │                                      │
       └──────────────┬───────────────────────┘
                      │
                      ↓
            Connection Removed/Deactivated
            status: 'inactive'
```

## Alternative Flow: University Initiates

```
STEP 1: University Initiates Connection
┌──────────────┐
│  University  │──► POST /api/university/connect-company/:id
│   Clicks     │    Creates: UniversityCompanyConnection {status: 'pending'}
│  "Connect"   │
└──────────────┘

                    ↓

STEP 2: Company Receives & Approves
┌──────────────┐
│   Company    │──► Company must implement approval flow
│   Dashboard  │    (Similar to university approval flow)
└──────────────┘
```

## Status Transitions

```
                ┌───────────────┐
                │ not_connected │ (No connection exists)
                └───────┬───────┘
                        │
                        │ Connection request sent
                        ↓
                ┌───────────────┐
         ┌──────┤    pending    │
         │      └───────┬───────┘
         │              │
         │ Rejected     │ Approved
         ↓              ↓
    ┌────────┐     ┌────────┐
    │rejected│     │ active │──┐
    └────────┘     └────┬───┘  │
                        │      │
                        │      │ Disconnect
                        │      ↓
                        │  ┌──────────┐
                        └─►│ inactive │
                           └──────────┘
```

## Database Schema

```sql
-- UniversityCompanyConnection Table
CREATE TABLE university_company_connections (
  id UUID PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  company_id UUID REFERENCES companies(id),
  status ENUM('pending', 'active', 'inactive') DEFAULT 'pending',
  connected_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_university_id ON university_company_connections(university_id);
CREATE INDEX idx_company_id ON university_company_connections(company_id);
CREATE INDEX idx_status ON university_company_connections(status);
```

## Frontend User Journey

### Company User Journey

```
1. Login as Company
   ↓
2. View Dashboard
   - See stats: Total Jobs, Active Jobs, Applicants
   - See pending university connections
   ↓
3. Navigate to "Universities" (Browse)
   ↓
4. View University Cards
   - See university details
   - See connection status badge
   ↓
5. Click "Send Connection Request"
   - Button disabled while processing
   - Toast notification on success
   - Status changes to "Pending"
   ↓
6. Navigate to "My Connections"
   - View all connections
   - Filter by status
   - See connection statistics
   ↓
7. Once Approved (status: active)
   - "View Students" button appears
   - Can browse university students
   - Can filter by major, year
   - Can apply students to jobs
   ↓
8. Disconnect (Optional)
   - Confirmation dialog
   - Connection removed
   - Cannot access students anymore
```

### University User Journey

```
1. Login as University
   ↓
2. View Dashboard
   - See stats: Students, Companies, Employment
   - See pending connection requests count
   ↓
3. Navigate to "Connections"
   ↓
4. View "Connection Requests" Tab
   - See pending company requests
   - View company details
   ↓
5. Review Company
   - View company info, industry, location
   - Click "Contact" to email
   - Click "Approve" or "Reject"
   ↓
6. Approve Connection
   - Button disabled while processing
   - Success notification banner
   - Request moves to "Connected Companies" tab
   ↓
7. Navigate to "Companies" Page
   - View "Companies" tab: See all connected companies
   - View "Jobs" tab: See jobs from connected companies
   ↓
8. Share Jobs with Students
   - Click "Share with Students"
   - Students can see job postings
   - Track applications
   ↓
9. View Employment Analytics
   - See which companies hired students
   - Track employment trends
   - Generate reports
```

## API Request/Response Examples

### Company Sends Connection Request
```http
POST /api/company/universities/123e4567-e89b-12d3-a456-426614174000/connect
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "message": "Request for partnership"
}

Response:
{
  "success": true,
  "message": "Connection request sent successfully",
  "data": {
    "id": "connection-uuid",
    "universityId": "123e4567-e89b-12d3-a456-426614174000",
    "companyId": "company-uuid",
    "status": "pending",
    "createdAt": "2025-10-15T10:30:00Z"
  }
}
```

### University Approves Request
```http
PUT /api/university/connection-requests/connection-uuid
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "action": "approve"
}

Response:
{
  "success": true,
  "message": "Connection request approved successfully",
  "connection": {
    "id": "connection-uuid",
    "universityId": "university-uuid",
    "companyId": "company-uuid",
    "status": "active",
    "connectedAt": "2025-10-15T10:35:00Z"
  }
}
```

### Company Fetches University Students
```http
GET /api/company/universities/university-uuid/students?major=Computer Science&year=4
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "student-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "major": "Computer Science",
      "year": 4,
      "skills": ["JavaScript", "React", "Node.js"],
      "User": {
        "email": "john@university.edu",
        "phone": "+95...",
        "isVerified": true
      }
    }
  ]
}
```

### University Fetches Job Posts
```http
GET /api/university/job-posts?status=active&page=1&limit=10
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "jobs": [
    {
      "id": "job-uuid",
      "title": "Software Engineer Intern",
      "jobType": "Internship",
      "location": "Yangon, Myanmar",
      "salaryRange": "300,000 - 500,000 MMK",
      "skillsRequired": ["JavaScript", "React"],
      "deadline": "2025-11-15",
      "status": "active",
      "Company": {
        "companyName": "Tech Company Ltd",
        "industry": "Technology"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

Layer 1: Authentication
  ↓ JWT Token required for all protected routes
  ↓ Token validated by middleware

Layer 2: Role Authorization
  ↓ User role checked (company/university)
  ↓ Wrong role = 403 Forbidden

Layer 3: Connection Verification
  ↓ Check if connection exists
  ↓ Check if connection is active
  ↓ Not connected = 403 Forbidden

Layer 4: Data Access
  ✓ Access granted
  ✓ Return requested data
```

## Error Handling Flow

```
Request → Validation → Authorization → Business Logic → Response
   ↓          ↓            ↓               ↓              ↓
 400         401          403             500           200
 Bad         Not      Forbidden        Server         OK
Request   Authorized                    Error
```

## Performance Considerations

### Optimizations Implemented
1. ✅ **Database Indexes**: On foreign keys and status fields
2. ✅ **Pagination**: Prevents loading large datasets
3. ✅ **Eager Loading**: Uses `include` to reduce N+1 queries
4. ✅ **Filtering**: Server-side filtering reduces data transfer
5. ✅ **Caching Opportunity**: Response data could be cached

### Query Examples
```javascript
// Optimized query with includes
const connections = await UniversityCompanyConnection.findAll({
  where: { universityId, status: 'active' },
  include: [{
    model: Company,
    include: [{
      model: User,
      attributes: ['email', 'isVerified'] // Only needed fields
    }]
  }],
  order: [['connectedAt', 'DESC']]
});
```

## Testing Scenarios

### Integration Tests Needed
1. ✅ Company sends connection request
2. ✅ University approves connection
3. ✅ Company can access students after approval
4. ✅ University can access jobs after approval
5. ✅ Rejected connections don't allow data access
6. ✅ Disconnection removes data access
7. ✅ Unauthorized access attempts fail
8. ✅ Invalid connection IDs handled properly

### Edge Cases Covered
1. ✅ Duplicate connection requests prevented
2. ✅ Non-existent universities/companies return 404
3. ✅ Approving already approved connections
4. ✅ Accessing students from non-connected university
5. ✅ Connection ownership verification

---

**This comprehensive flow diagram shows the complete integration between Company and University modules, including all API calls, status transitions, and user journeys.**
