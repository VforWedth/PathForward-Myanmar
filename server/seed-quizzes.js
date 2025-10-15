const { sequelize } = require('./src/config/database');
const { Quiz, Question } = require('./src/models');

const sampleQuizzes = [
  {
    title: 'Python Fundamentals',
    description: 'Test your knowledge of Python programming basics',
    category: 'Python',
    difficulty: 'beginner',
    duration: 20,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      { 
        questionText: 'What is the correct way to create a variable in Python?', 
        questionType: 'multiple_choice', 
        options: ['var x = 5', 'x = 5', 'int x = 5', 'x := 5'], 
        correctAnswer: '1', 
        points: 1, 
        orderNumber: 1, 
        explanation: 'In Python, you simply assign a value to a variable name without any type declaration.' 
      },
      { 
        questionText: 'Which of the following is a mutable data type in Python?', 
        questionType: 'multiple_choice', 
        options: ['Tuple', 'String', 'List', 'Integer'], 
        correctAnswer: '2', 
        points: 1, 
        orderNumber: 2, 
        explanation: 'Lists are mutable, meaning their contents can be changed after creation.' 
      },
      { 
        questionText: 'What does the len() function do?', 
        questionType: 'multiple_choice', 
        options: ['Returns the length of an object', 'Returns the type of an object', 'Returns the maximum value', 'Returns the minimum value'], 
        correctAnswer: '0', 
        points: 1, 
        orderNumber: 3, 
        explanation: 'len() returns the number of items in an object like a list, string, or dictionary.' 
      },
      { 
        questionText: 'What is the exponentiation operator in Python?', 
        questionType: 'multiple_choice', 
        options: ['^', '**', 'exp()', 'pow()'], 
        correctAnswer: '1', 
        points: 1, 
        orderNumber: 4, 
        explanation: '** is used for exponentiation in Python. For example, 2**3 equals 8.' 
      },
      { 
        questionText: 'What is the output of type([])?', 
        questionType: 'multiple_choice', 
        options: ['<class "list">', '<class "dict">', '<class "tuple">', '<class "set">'], 
        correctAnswer: '0', 
        points: 1, 
        orderNumber: 5, 
        explanation: '[] creates an empty list, so type([]) returns <class "list">.' 
      }
    ]
  },
  {
    title: 'Java Basics',
    description: 'Master the fundamentals of Java programming',
    category: 'Java',
    difficulty: 'beginner',
    duration: 20,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        questionText: 'Which of the following is the correct way to declare a variable in Java?',
        questionType: 'multiple_choice',
        options: ['int x = 5;', 'x = 5', 'var x = 5', 'integer x = 5;'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 1,
        explanation: 'In Java, you must specify the data type followed by the variable name and value, ending with a semicolon.'
      },
      {
        questionText: 'What is the parent class of all classes in Java?',
        questionType: 'multiple_choice',
        options: ['System', 'Object', 'Class', 'Main'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 2,
        explanation: 'Object class is the parent class of all classes in Java by default.'
      },
      {
        questionText: 'Which keyword is used to create a constant in Java?',
        questionType: 'multiple_choice',
        options: ['const', 'final', 'static', 'constant'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 3,
        explanation: 'The final keyword is used to declare constants in Java.'
      },
      {
        questionText: 'What is the default value of a boolean variable in Java?',
        questionType: 'multiple_choice',
        options: ['true', 'false', 'null', '0'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 4,
        explanation: 'The default value of a boolean variable in Java is false.'
      },
      {
        questionText: 'Which method is the entry point of a Java application?',
        questionType: 'multiple_choice',
        options: ['start()', 'main()', 'run()', 'execute()'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 5,
        explanation: 'The main() method is the entry point of any Java application.'
      }
    ]
  },
  {
    title: 'HTML Essentials',
    description: 'Learn the building blocks of web development with HTML',
    category: 'HTML',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        questionText: 'What does HTML stand for?',
        questionType: 'multiple_choice',
        options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'Hyperlinking Text Marking Language'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 1,
        explanation: 'HTML stands for Hyper Text Markup Language, the standard language for creating web pages.'
      },
      {
        questionText: 'Which HTML tag is used to define the largest heading?',
        questionType: 'multiple_choice',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 2,
        explanation: '<h1> defines the largest heading in HTML, while <h6> is the smallest.'
      },
      {
        questionText: 'Which attribute specifies an alternate text for an image?',
        questionType: 'multiple_choice',
        options: ['title', 'alt', 'src', 'text'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 3,
        explanation: 'The alt attribute provides alternative text for an image if it cannot be displayed.'
      },
      {
        questionText: 'Which HTML tag is used to create a hyperlink?',
        questionType: 'multiple_choice',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 4,
        explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.'
      },
      {
        questionText: 'What is the correct HTML for creating a checkbox?',
        questionType: 'multiple_choice',
        options: ['<input type="checkbox">', '<checkbox>', '<check>', '<input type="check">'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 5,
        explanation: '<input type="checkbox"> is the correct way to create a checkbox in HTML.'
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    console.log('🔄 Starting quiz seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Optional: Clear existing data (uncomment if needed)
    // await Question.destroy({ where: {}, truncate: true, cascade: true });
    // await Quiz.destroy({ where: {}, truncate: true, cascade: true });
    // console.log('🗑️  Cleared existing quiz data');
    
    // Create quizzes with questions
    for (const quizData of sampleQuizzes) {
      const { questions, ...quizInfo } = quizData;
      
      // Create quiz
      const quiz = await Quiz.create(quizInfo);
      console.log(`📝 Created quiz: ${quiz.title}`);
      
      // Create questions for this quiz
      for (const questionData of questions) {
        await Question.create({ 
          ...questionData, 
          quizId: quiz.id 
        });
      }
      console.log(`   ✓ Added ${questions.length} questions to ${quiz.title}`);
    }
    
    console.log('\n🎉 All quizzes seeded successfully!');
    console.log(`📊 Total quizzes created: ${sampleQuizzes.length}`);
    
    // Show summary
    const totalQuizzes = await Quiz.count();
    const totalQuestions = await Question.count();
    console.log(`\n📈 Database Summary:`);
    console.log(`   Quizzes: ${totalQuizzes}`);
    console.log(`   Questions: ${totalQuestions}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    console.error('Error details:', error.message);
    if (error.parent) {
      console.error('Database error:', error.parent.message);
    }
    process.exit(1);
  }
}

// Run the seeder
seedQuizzes();