const express = require('express');
const {
  getDashboardStats,
  getDashboardCharts,
  getUsers,
  getUserById,
  updateUser,
  verifyUser,
  toggleUserActive,
  deleteUser,
  getPendingCompanies,
  verifyCompany,
  getPendingUniversities,
  verifyUniversity,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
  getActivityLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/charts', getDashboardCharts);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/toggle-active', toggleUserActive);
router.delete('/users/:id', deleteUser);

// Company verification routes
router.get('/companies/pending', getPendingCompanies);
router.put('/companies/:id/verify', verifyCompany);

// University verification routes
router.get('/universities/pending', getPendingUniversities);
router.put('/universities/:id/verify', verifyUniversity);

// Job moderation routes
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

// Activity logs routes
router.get('/activity', getActivityLogs);

module.exports = router;
