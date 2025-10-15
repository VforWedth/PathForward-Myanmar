# Quiz Submission Fix - Quick Reference

## 🔧 Changes Made

### 1. Frontend Quiz Page (`client/src/app/student/quiz/[id]/page.tsx`)

#### Line 75 - Console Log URL Fix
```typescript
// BEFORE
console.log('API URL:', `${API_BASE_URL}/api/quiz/${quizId}/questions`);

// AFTER
console.log('API URL:', `${API_BASE_URL}/api/quizzes/${quizId}/questions`);
```

#### Line 78 - API Endpoint Fix
```typescript
// BEFORE
const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/questions`, {

// AFTER
const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/questions`, {
```

#### Lines 112-152 - Enhanced Submit Handler
```typescript
// BEFORE
const handleSubmit = async () => {
  if (submitting) return;
  setSubmitting(true);
  try {
    const API_BASE_URL = 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const startTime = quizData ? quizData.quiz.duration * 60 : 0;
    const timeSpent = startTime - timeLeft;
    const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: formattedAnswers,
        timeSpent,
      }),
    });
    const data = await response.json();
    if (data.success) {
      router.push(`/student/quiz/result/${data.data.attemptId}`);
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    alert('Failed to submit quiz. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

// AFTER
const handleSubmit = async () => {
  if (submitting) return;
  setSubmitting(true);
  try {
    const API_BASE_URL = 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const startTime = quizData ? quizData.quiz.duration * 60 : 0;
    const timeSpent = startTime - timeLeft;

    // ADDED: Debug logging
    console.log('Submitting quiz with data:', {
      quizId,
      answersCount: formattedAnswers.length,
      timeSpent,
      formattedAnswers
    });

    // FIXED: Changed /api/quiz/ to /api/quizzes/
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: formattedAnswers,
        timeSpent,
      }),
    });

    // ADDED: More detailed logging
    console.log('Submit response status:', response.status);
    const data = await response.json();
    console.log('Submit response data:', data);

    if (data.success) {
      router.push(`/student/quiz/result/${data.data.attemptId}`);
    } else {
      // ADDED: Better error feedback
      alert(`Failed to submit: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    // IMPROVED: More detailed error message
    alert(`Failed to submit quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setSubmitting(false);
  }
};
```

---

### 2. Frontend Result Page (`client/src/app/student/quiz/result/[id]/page.tsx`)

#### Line 62 - API Endpoint Fix
```typescript
// BEFORE
const response = await fetch(`${API_BASE_URL}/api/quiz/attempts/${attemptId}`, {

// AFTER
const response = await fetch(`${API_BASE_URL}/api/quizzes/attempts/${attemptId}`, {
```

#### Lines 57-78 - Enhanced Fetch Function
```typescript
// ADDED: Logging and error handling
const fetchAttemptData = async () => {
  try {
    const API_BASE_URL = 'http://localhost:5000';
    const token = localStorage.getItem('token');

    console.log('Fetching quiz attempt:', attemptId);  // ADDED

    const response = await fetch(`${API_BASE_URL}/api/quizzes/attempts/${attemptId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Attempt response status:', response.status);  // ADDED
    const data = await response.json();
    console.log('Attempt data:', data);  // ADDED

    if (data.success) {
      setAttemptData(data.data);
    } else {
      console.error('Failed to fetch attempt:', data.message);  // ADDED
      alert(`Error loading results: ${data.message}`);  // ADDED
    }
  } catch (error) {
    console.error('Error fetching attempt:', error);
    alert('Failed to load quiz results. Please try again.');  // ADDED
  } finally {
    setLoading(false);
  }
};
```

---

### 3. Backend Quiz Controller (`server/src/controllers/quizController.js`)

#### Lines 57-94 - Enhanced submitQuiz Function (Part 1)
```javascript
// BEFORE
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
        gradedAnswers.push({ ... });
      } else {
        gradedAnswers.push({ ... });
      }
    }

// AFTER
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    
    // ADDED: Debug logging
    console.log('📝 Quiz submission received:', {
      quizId: req.params.id,
      userId: req.user?.id,
      answersCount: answers?.length,
      timeSpent
    });

    // ADDED: Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid answers format' });
    }

    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      console.error('❌ Student profile not found for userId:', req.user.id);  // ADDED
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      console.error('❌ Quiz not found:', req.params.id);  // ADDED
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await Question.findAll({ where: { quizId: req.params.id } });
    console.log(`📋 Found ${questions.length} questions for quiz`);  // ADDED

    let earnedPoints = 0, totalPoints = 0;
    const gradedAnswers = [];
    
    for (const question of questions) {
      totalPoints += question.points;
      // FIXED: Type-safe comparison
      const studentAnswer = answers.find(a => String(a.questionId) === String(question.id));
      
      if (studentAnswer) {
        let isCorrect = false;
        if (question.questionType === 'multiple_choice') {
          // FIXED: Type-safe comparison
          isCorrect = String(studentAnswer.answer) === String(question.correctAnswer);
          // ADDED: Debug logging
          console.log(`✓ Q${question.orderNumber}: Student=${studentAnswer.answer}, Correct=${question.correctAnswer}, Match=${isCorrect}`);
        } else if (question.questionType === 'coding') {
          isCorrect = studentAnswer.answer.trim() === question.correctAnswer.trim();
        }
        
        if (isCorrect) earnedPoints += question.points;
        
        gradedAnswers.push({ ... });
      } else {
        console.log(`⚠️ No answer found for question ${question.id}`);  // ADDED
        gradedAnswers.push({ ... });
      }
    }
```

#### Lines 96-140 - Enhanced submitQuiz Function (Part 2)
```javascript
// ADDED: Score calculation logging
const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
const passed = score >= quiz.passingScore;

console.log(`🎯 Quiz graded: ${earnedPoints}/${totalPoints} points = ${score}% (Pass: ${quiz.passingScore}%)`);

const certificateIssued = score >= 85;
const certificateUrl = certificateIssued ? `/certificates/${student.id}/${req.params.id}` : null;

const attempt = await QuizAttempt.create({ ... });

console.log(`✅ Attempt saved with ID: ${attempt.id}`);  // ADDED

if (certificateIssued) {
  const { Activity } = require('../models');
  await Activity.create({ ... });
  console.log('🏆 Certificate issued!');  // ADDED
}

res.json({ ... });
```

#### Lines 142-144 - Enhanced Error Handling
```javascript
// ADDED: Better error logging
} catch (error) {
  console.error('❌ Error in submitQuiz:', error);
  res.status(500).json({ success: false, message: 'Server error', error: error.message });
}
```

#### Lines 201-218 - Enhanced getAttempt Function
```javascript
// BEFORE
const getAttempt = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const attempt = await QuizAttempt.findOne({ ... });
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    res.json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// AFTER
const getAttempt = async (req, res) => {
  try {
    console.log('📊 Fetching attempt:', req.params.id, 'for user:', req.user?.id);  // ADDED
    
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      console.error('❌ Student profile not found for userId:', req.user.id);  // ADDED
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    
    const attempt = await QuizAttempt.findOne({ ... });
    
    if (!attempt) {
      console.error('❌ Attempt not found:', req.params.id, 'for student:', student.id);  // ADDED
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    
    console.log('✅ Attempt found:', { id: attempt.id, score: attempt.score, passed: attempt.passed });  // ADDED
    res.json({ success: true, data: attempt });
  } catch (error) {
    console.error('❌ Error in getAttempt:', error);  // ADDED
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
```

---

## 🔑 Key Changes Summary

1. **Route Fix**: `/api/quiz/` → `/api/quizzes/` (3 locations)
2. **Type Safety**: Added `String()` conversion for answer comparison
3. **Validation**: Added request validation for answers array
4. **Logging**: Added comprehensive console logging throughout
5. **Error Handling**: Enhanced error messages and user feedback

---

## ✅ Testing Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### Check quiz endpoint:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/quizzes
```

---

**Files Modified:** 3
**Lines Changed:** ~150
**Status:** ✅ Complete
