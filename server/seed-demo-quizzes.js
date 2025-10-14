/**
 * Demo Quiz Seeder with Database Setup
 * This script will:
 * 1. Connect to database
 * 2. Create tables if they don't exist
 * 3. Seed demo quiz data
 */

const { sequelize } = require('./src/config/database');
const { Quiz, Question } = require('./src/models');

const demoQuizzes = [
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
    title: 'JavaScript Essentials',
    description: 'Master the fundamentals of JavaScript programming',
    category: 'JavaScript',
    difficulty: 'beginner',
    duration: 20,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        questionText: 'Which keyword is used to declare a variable in JavaScript?',
        questionType: 'multiple_choice',
        options: ['var, let, const', 'int, float, string', 'variable, constant', 'v, l, c'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 1,
        explanation: 'JavaScript uses var, let, and const to declare variables.'
      },
      {
        questionText: 'What is the correct way to write a JavaScript array?',
        questionType: 'multiple_choice',
        options: ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 2,
        explanation: 'Arrays in JavaScript are written with square brackets and comma-separated values.'
      },
      {
        questionText: 'How do you write "Hello World" in an alert box?',
        questionType: 'multiple_choice',
        options: ['alertBox("Hello World");', 'msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 3,
        explanation: 'The alert() function displays an alert box with a specified message.'
      },
      {
        questionText: 'What is the correct syntax for referring to an external script?',
        questionType: 'multiple_choice',
        options: ['<script href="xxx.js">', '<script name="xxx.js">', '<script src="xxx.js">', '<script file="xxx.js">'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 4,
        explanation: 'The src attribute is used to specify the path to an external JavaScript file.'
      },
      {
        questionText: 'How do you create a function in JavaScript?',
        questionType: 'multiple_choice',
        options: ['function:myFunction()', 'function = myFunction()', 'function myFunction()', 'create myFunction()'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 5,
        explanation: 'Functions are declared using the function keyword followed by the function name and parentheses.'
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
  },
  {
    title: 'CSS Fundamentals',
    description: 'Test your knowledge of Cascading Style Sheets',
    category: 'CSS',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        questionText: 'What does CSS stand for?',
        questionType: 'multiple_choice',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 1,
        explanation: 'CSS stands for Cascading Style Sheets, used to style HTML elements.'
      },
      {
        questionText: 'Which HTML tag is used to define an internal style sheet?',
        questionType: 'multiple_choice',
        options: ['<css>', '<script>', '<style>', '<styles>'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 2,
        explanation: 'The <style> tag is used to define internal CSS in an HTML document.'
      },
      {
        questionText: 'How do you select an element with id "demo"?',
        questionType: 'multiple_choice',
        options: ['#demo', '.demo', 'demo', '*demo'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 3,
        explanation: 'In CSS, the # symbol is used to select elements by their id attribute.'
      },
      {
        questionText: 'Which property is used to change the background color?',
        questionType: 'multiple_choice',
        options: ['color', 'bgcolor', 'background-color', 'bg-color'],
        correctAnswer: '2',
        points: 1,
        orderNumber: 4,
        explanation: 'The background-color property is used to set the background color of an element.'
      },
      {
        questionText: 'How do you make text bold?',
        questionType: 'multiple_choice',
        options: ['font-weight: bold;', 'text-style: bold;', 'font: bold;', 'text-weight: bold;'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 5,
        explanation: 'The font-weight property with value "bold" makes text bold.'
      }
    ]
  },
  {
    title: 'React Basics',
    description: 'Test your understanding of React fundamentals',
    category: 'React',
    difficulty: 'intermediate',
    duration: 25,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 5,
    isActive: true,
    questions: [
      {
        questionText: 'What is React?',
        questionType: 'multiple_choice',
        options: ['A JavaScript library for building user interfaces', 'A database management system', 'A CSS framework', 'A backend framework'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 1,
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces.'
      },
      {
        questionText: 'What is JSX?',
        questionType: 'multiple_choice',
        options: ['JavaScript XML - syntax extension for JavaScript', 'A new version of JSON', 'A template engine', 'A CSS preprocessor'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 2,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
      },
      {
        questionText: 'How do you create a component in React?',
        questionType: 'multiple_choice',
        options: ['function MyComponent() { return <div>Hello</div>; }', 'component MyComponent() { return <div>Hello</div>; }', 'create MyComponent() { return <div>Hello</div>; }', 'class MyComponent { return <div>Hello</div>; }'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 3,
        explanation: 'React components can be created as functions that return JSX.'
      },
      {
        questionText: 'What hook is used to manage state in functional components?',
        questionType: 'multiple_choice',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: '1',
        points: 1,
        orderNumber: 4,
        explanation: 'useState is the hook used to add state to functional components.'
      },
      {
        questionText: 'How do you pass data from parent to child component?',
        questionType: 'multiple_choice',
        options: ['Using props', 'Using state', 'Using refs', 'Using context'],
        correctAnswer: '0',
        points: 1,
        orderNumber: 5,
        explanation: 'Props (properties) are used to pass data from parent components to child components.'
      }
    ]
  }
];

async function seedDemoQuizzes() {
  try {
    console.log('\n🚀 Starting Demo Quiz Seeder...\n');
    console.log('='.repeat(50));
    
    // Step 1: Connect to database
    console.log('\n📡 Step 1: Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Step 2: Sync models (create tables if they don't exist)
    console.log('\n🔧 Step 2: Creating/updating database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables ready!');
    
    // Step 3: Check existing data
    console.log('\n🔍 Step 3: Checking existing quiz data...');
    const existingQuizCount = await Quiz.count();
    console.log(`   Found ${existingQuizCount} existing quizzes`);
    
    if (existingQuizCount > 0) {
      console.log('\n⚠️  Database already has quizzes!');
      console.log('   Options:');
      console.log('   1. Keep existing + add new demo quizzes');
      console.log('   2. Clear all and add demo quizzes only');
      console.log('\n   Currently: Adding new demo quizzes (keeping existing)...');
    }
    
    // Step 4: Seed demo quizzes
    console.log('\n📝 Step 4: Creating demo quizzes...');
    console.log('='.repeat(50));
    
    let createdCount = 0;
    for (const quizData of demoQuizzes) {
      const { questions, ...quizInfo } = quizData;
      
      // Check if quiz already exists (by title)
      const existingQuiz = await Quiz.findOne({ where: { title: quizInfo.title } });
      
      if (existingQuiz) {
        console.log(`⏭️  Skipping "${quizInfo.title}" - already exists`);
        continue;
      }
      
      // Create quiz
      const quiz = await Quiz.create(quizInfo);
      console.log(`\n✅ Created: ${quiz.title}`);
      console.log(`   Category: ${quiz.category}`);
      console.log(`   Difficulty: ${quiz.difficulty}`);
      console.log(`   Duration: ${quiz.duration} minutes`);
      
      // Create questions for this quiz
      for (const questionData of questions) {
        await Question.create({ 
          ...questionData, 
          quizId: quiz.id 
        });
      }
      console.log(`   ✓ Added ${questions.length} questions`);
      createdCount++;
    }
    
    // Step 5: Show summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Demo Quiz Seeding Complete!\n');
    
    const totalQuizzes = await Quiz.count();
    const totalQuestions = await Question.count();
    
    console.log('📊 Database Summary:');
    console.log(`   Total Quizzes: ${totalQuizzes}`);
    console.log(`   Total Questions: ${totalQuestions}`);
    console.log(`   New Quizzes Added: ${createdCount}`);
    
    console.log('\n✅ Your skills-test page should now show these quizzes!');
    console.log('='.repeat(50));
    
    await sequelize.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n💡 Database connection failed!');
      console.error('   Make sure:');
      console.error('   1. Database credentials in server/.env are correct');
      console.error('   2. Database server is running');
      console.error('   3. Database exists');
    } else if (error.parent) {
      console.error('\n💡 Database error:', error.parent.message);
    }
    
    process.exit(1);
  }
}

// Run the seeder
console.log('╔' + '═'.repeat(48) + '╗');
console.log('║     PATHFORWARD MYANMAR - DEMO QUIZ SEEDER     ║');
console.log('╚' + '═'.repeat(48) + '╝');

seedDemoQuizzes();
