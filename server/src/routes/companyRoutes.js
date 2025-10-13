const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const companyController = require('../controllers/companyController');
const jobController = require('../controllers/jobController');
const applicantController = require('../controllers/applicantController');
const feedbackController = require('../controllers/feedbackController');

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

// Job routes
router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getCompanyJobs);
router.get('/jobs/:id', jobController.getJobById);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.put('/jobs/:id/close', jobController.closeJob);

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

module.exports = router;
