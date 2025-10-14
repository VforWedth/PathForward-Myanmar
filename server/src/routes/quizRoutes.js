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

// Public route - no auth required
router.get('/categories', getCategories);

// Protected routes - require student authentication
router.get('/', protect, authorize('student'), getQuizzes);
router.get('/my-attempts', protect, authorize('student'), getMyAttempts);
router.get('/attempts/:id', protect, authorize('student'), getAttempt);
router.get('/:id', protect, authorize('student'), getQuiz);
router.get('/:id/questions', protect, authorize('student'), getQuizQuestions);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;