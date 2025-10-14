const express = require('express');
const {
  getProfile,
  updateProfile,
  getStudents,
  verifyStudent,
  connectCompany,
  getConnectedCompanies,
  getEmploymentStats,
  generateReport,
  disconnectCompany
} = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and university role
router.use(protect);
router.use(authorize('university'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Student management routes
router.get('/students', getStudents);
router.post('/verify-student/:studentId', verifyStudent);

// Company connection routes
router.post('/connect-company/:companyId', connectCompany);
router.get('/connected-companies', getConnectedCompanies);
router.delete('/disconnect-company/:companyId', disconnectCompany);

// Analytics and reporting routes
router.get('/employment-stats', getEmploymentStats);
router.get('/generate-report', generateReport);

module.exports = router;
