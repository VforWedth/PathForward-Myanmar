const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getQuizzes, getQuiz, getQuizQuestions, submitQuiz, getMyAttempts, getAttempt, getCategories } = require('../controllers/quizController');

const router = express.Router();
router.get('/categories', getCategories);
router.use(protect);
router.use(authorize('student'));
router.get('/', getQuizzes);
router.get('/my-attempts', getMyAttempts);
router.get('/attempts/:id', getAttempt);
router.get('/:id', getQuiz);
router.get('/:id/questions', getQuizQuestions);
router.post('/:id/submit', submitQuiz);

module.exports = router;
