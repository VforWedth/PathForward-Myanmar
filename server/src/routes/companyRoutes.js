const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const companyController = require('../controllers/companyController');
const jobController = require('../controllers/jobController');
const applicantController = require('../controllers/applicantController');
const feedbackController = require('../controllers/feedbackController');
const universityConnectionController = require('../controllers/universityConnectionController');
const companyProjectController = require('../controllers/companyProjectController');
const projectController = require('../controllers/projectController');

// Public routes
router.post('/register', companyController.registerCompany);

// Protected company routes
router.use(protect);
router.use(authorize('company'));

// Company profile routes
router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);

// Dashboard routes
router.get('/dashboard/stats', companyController.getDashboardStats);
router.get('/dashboard/activity', companyController.getRecentActivity);
router.get('/analytics', companyController.getCompanyAnalytics);
router.get('/analytics/universities', companyController.getUniversityJobAnalytics);

// Job routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getCompanyJobs);
router.get('/jobs/:id', jobController.getJobById);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.put('/jobs/:id/close', jobController.closeJob);

// Company Project routes (for freelancer hiring)
router.post('/projects', companyProjectController.createCompanyProject);
router.get('/projects', companyProjectController.getCompanyProjects);
router.get('/projects/:id', companyProjectController.getCompanyProjectById);
router.put('/projects/:id', companyProjectController.updateCompanyProject);
router.delete('/projects/:id', companyProjectController.deleteCompanyProject);
router.put('/projects/:id/close', companyProjectController.closeCompanyProject);

// Freelancer project browsing routes (for companies to explore)
router.get('/freelancer-projects', projectController.getAllActiveFreelancerProjects);
router.get('/freelancer-projects/:id', projectController.getFreelancerProjectDetailsForCompany);

// Applicant routes
router.get('/applicants', applicantController.getApplicants);
router.get('/applicants/positions', applicantController.getPositions);
router.get('/applicants/:id', applicantController.getApplicantById);
router.put('/applicants/:id/status', applicantController.updateApplicationStatus);

// Feedback routes
router.post('/feedback', feedbackController.createFeedback);
router.get('/feedback', feedbackController.getCompanyFeedback);
router.get('/feedback/stats', feedbackController.getFeedbackStats);
router.get('/feedback/:id', feedbackController.getFeedbackById);
router.put('/feedback/:id', feedbackController.updateFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);

// University connection routes
router.get('/universities', universityConnectionController.getAvailableUniversities);
router.get('/universities/connected', universityConnectionController.getConnectedUniversities);
router.get('/universities/stats', universityConnectionController.getConnectionStats);
router.post('/universities/:id/connect', universityConnectionController.requestConnection);
router.delete('/universities/:id/disconnect', universityConnectionController.disconnectUniversity);
router.get('/universities/:id/students', universityConnectionController.getUniversityStudents);

module.exports = router;
