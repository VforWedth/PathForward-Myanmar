const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
  getQuizzes, 
  getQuiz, 
  getQuizQuestions, 
  submitQuiz, 
  getMyAttempts, 
  getAttempt, 
  getCategories 
} = require('../controllers/quizController');

const router = express.Router();

// Public route - no auth required (MUST be before /:id)
router.get('/categories', getCategories);

// Protected routes - require student authentication
router.get('/', protect, authorize('student'), getQuizzes);

// My attempts routes (MUST be before /:id)
router.get('/my-attempts', protect, authorize('student'), getMyAttempts);
router.get('/attempts/:id', protect, authorize('student'), getAttempt);

// Specific quiz routes (MUST be after /my-attempts)
router.get('/:id/questions', protect, authorize('student'), getQuizQuestions);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id', protect, authorize('student'), getQuiz);

module.exports = router;