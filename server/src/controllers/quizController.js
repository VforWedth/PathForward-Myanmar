const { Quiz, Question, QuizAttempt, Student } = require('../models');
const { Op } = require('sequelize');

const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, type, search } = req.query;
    const whereClause = { isActive: true };
    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;
    if (type) whereClause.type = type;
    if (search) whereClause[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }];

    const quizzes = await Quiz.findAll({ 
      where: whereClause, 
      attributes: ['id', 'title', 'description', 'category', 'difficulty', 'duration', 'passingScore', 'type', 'totalQuestions', 'createdAt'], 
      order: [['createdAt', 'DESC']] 
    });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, { 
      attributes: ['id', 'title', 'description', 'category', 'difficulty', 'duration', 'passingScore', 'type', 'totalQuestions'] 
    });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getQuizQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const questions = await Question.findAll({ 
      where: { quizId: req.params.id }, 
      attributes: ['id', 'questionText', 'questionType', 'options', 'starterCode', 'language', 'points', 'orderNumber'], 
      order: [['orderNumber', 'ASC']] 
    });
    res.json({ 
      success: true, 
      data: { 
        quiz: { id: quiz.id, title: quiz.title, duration: quiz.duration, totalQuestions: quiz.totalQuestions }, 
        questions 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const questions = await Question.findAll({ where: { quizId: req.params.id } });

    let earnedPoints = 0, totalPoints = 0;
    const gradedAnswers = [];
    for (const question of questions) {
      totalPoints += question.points;
      const studentAnswer = answers.find(a => a.questionId === question.id);
      if (studentAnswer) {
        let isCorrect = false;
        if (question.questionType === 'multiple_choice') isCorrect = studentAnswer.answer === question.correctAnswer;
        else if (question.questionType === 'coding') isCorrect = studentAnswer.answer.trim() === question.correctAnswer.trim();
        if (isCorrect) earnedPoints += question.points;
        gradedAnswers.push({ 
          questionId: question.id, 
          answer: studentAnswer.answer, 
          isCorrect, 
          points: isCorrect ? question.points : 0, 
          correctAnswer: question.correctAnswer, 
          explanation: question.explanation 
        });
      } else {
        gradedAnswers.push({ 
          questionId: question.id, 
          answer: null, 
          isCorrect: false, 
          points: 0, 
          correctAnswer: question.correctAnswer, 
          explanation: question.explanation 
        });
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    
    // Issue certificate if score >= 85%
    const certificateIssued = score >= 85;
    const certificateUrl = certificateIssued ? `/certificates/${student.id}/${req.params.id}` : null;
    
    const attempt = await QuizAttempt.create({ 
      quizId: quiz.id, 
      studentId: student.id, 
      answers: gradedAnswers, 
      score, 
      totalPoints, 
      earnedPoints, 
      passed, 
      completedAt: new Date(), 
      timeSpent: timeSpent || 0, 
      certificateIssued,
      certificateUrl
    });

    // Log activity if certificate issued
    if (certificateIssued) {
      const { Activity } = require('../models');
      await Activity.create({
        studentId: student.id,
        type: 'certificate_earned',
        title: `Earned ${quiz.category} Certificate`,
        description: `Passed ${quiz.title} with ${score}% score`
      });
    }

    res.json({ 
      success: true, 
      data: { 
        attemptId: attempt.id, 
        score, 
        earnedPoints, 
        totalPoints, 
        passed, 
        certificateIssued,
        certificateUrl,
        answers: gradedAnswers 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getMyAttempts = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const attempts = await QuizAttempt.findAll({ 
      where: { studentId: student.id }, 
      include: [{ 
        model: Quiz, 
        attributes: ['id', 'title', 'category', 'difficulty', 'type', 'passingScore'] 
      }], 
      order: [['createdAt', 'DESC']] 
    });
    res.json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getAttempt = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const attempt = await QuizAttempt.findOne({ 
      where: { id: req.params.id, studentId: student.id }, 
      include: [{ 
        model: Quiz, 
        attributes: ['id', 'title', 'category', 'difficulty', 'type', 'passingScore', 'totalQuestions'] 
      }] 
    });
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    res.json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Quiz.findAll({ 
      attributes: [[Quiz.sequelize.fn('DISTINCT', Quiz.sequelize.col('category')), 'category']], 
      where: { isActive: true }, 
      raw: true 
    });
    res.json({ success: true, data: categories.map(c => c.category) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getQuizzes, getQuiz, getQuizQuestions, submitQuiz, getMyAttempts, getAttempt, getCategories };