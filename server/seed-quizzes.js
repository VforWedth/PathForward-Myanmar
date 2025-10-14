const { sequelize } = require('./src/config/database');
const { Quiz, Question } = require('./src/models');

const sampleQuizzes = [
  {
    title: 'Python Basics',
    description: 'Test your knowledge of Python fundamentals',
    category: 'Python',
    difficulty: 'beginner',
    duration: 20,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    questions: [
      { questionText: 'What is the correct way to create a variable in Python?', questionType: 'multiple_choice', options: ['var x = 5', 'x = 5', 'int x = 5', 'x := 5'], correctAnswer: '1', points: 1, orderNumber: 1, explanation: 'In Python, you simply assign a value to a variable name.' },
      { questionText: 'Which is a mutable data type?', questionType: 'multiple_choice', options: ['Tuple', 'String', 'List', 'Integer'], correctAnswer: '2', points: 1, orderNumber: 2, explanation: 'Lists are mutable.' },
      { questionText: 'What does len() do?', questionType: 'multiple_choice', options: ['Returns length', 'Returns type', 'Returns max', 'Returns min'], correctAnswer: '0', points: 1, orderNumber: 3, explanation: 'len() returns the number of items.' },
      { questionText: 'Exponentiation operator?', questionType: 'multiple_choice', options: ['^', '**', 'exp()', 'pow()'], correctAnswer: '1', points: 1, orderNumber: 4, explanation: '** is used for exponentiation.' },
      { questionText: 'What is type([])?', questionType: 'multiple_choice', options: ['<class "list">', '<class "dict">', '<class "tuple">', '<class "set">'], correctAnswer: '0', points: 1, orderNumber: 5, explanation: '[] creates an empty list.' }
    ]
  }
];

async function seedQuizzes() {
  try {
    await sequelize.authenticate();
    for (const quizData of sampleQuizzes) {
      const { questions, ...quizInfo } = quizData;
      const quiz = await Quiz.create(quizInfo);
      for (const q of questions) await Question.create({ ...q, quizId: quiz.id });
      console.log(`✅ Created: ${quiz.title}`);
    }
    console.log('🎉 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedQuizzes();
