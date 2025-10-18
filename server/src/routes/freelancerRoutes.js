const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const freelancerController = require('../controllers/freelancerController');
const projectController = require('../controllers/projectController');
const teammateController = require('../controllers/teammateController');
const companyProjectController = require('../controllers/companyProjectController');

// Protected freelancer routes
router.use(protect);
router.use(authorize('freelancer'));

// Dashboard routes
router.get('/dashboard/stats', freelancerController.getDashboardStats);
router.get('/dashboard/recent-activities', freelancerController.getRecentActivities);

// Job browsing routes
router.get('/jobs', freelancerController.getPublicJobs);
router.get('/jobs/:id', freelancerController.getJobById);
router.get('/recommendations', freelancerController.getRecommendedJobs);

// Application routes
router.post('/jobs/:id/apply', freelancerController.applyForJob);
router.get('/applications', freelancerController.getMyApplications);
router.get('/applications/:id', freelancerController.getApplicationById);
router.delete('/applications/:id', freelancerController.withdrawApplication);

// Project routes
router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getMyProjects);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Teammate routes
router.get('/teammates', teammateController.getAllTeammates);
router.get('/teammates/:type/:id', teammateController.getTeammateById);

// Company project browsing routes (for freelancers)
router.get('/company-projects', companyProjectController.getAllActiveProjects);
router.get('/company-projects/:id', companyProjectController.getProjectDetailsForFreelancer);

module.exports = router;
