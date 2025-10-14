const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const {
  getProfile,
  updateProfile,
  uploadCV,
  uploadProfilePicture,
  updateStatus,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  getMyFeedback,
  submitReview,
  getMyReviews,
  getJobsFromConnectedCompanies
} = require('../controllers/studentController');

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/status', updateStatus);

// File upload routes
router.post('/upload-cv', upload.single('cv'), uploadCV);
router.post('/upload-picture', upload.single('profilePicture'), uploadProfilePicture);

// Education routes
router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Experience routes
router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Certificate routes
router.post('/certificate', addCertificate);
router.put('/certificate/:id', updateCertificate);
router.delete('/certificate/:id', deleteCertificate);

// Job routes
router.get('/jobs', getJobsFromConnectedCompanies);

// Feedback & Review routes
router.get('/feedback', getMyFeedback);
router.post('/reviews', submitReview);
router.get('/reviews', getMyReviews);

module.exports = router;
