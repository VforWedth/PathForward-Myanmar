const { sequelize } = require('./src/config/database');
const { Quiz, Question } = require('./src/models');

const sampleQuizzes = [
  {
    title: 'Python Basics',
    description: 'Test your knowledge of Python fundamentals including variables, data types, and basic operations.',
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
  },
  {
    title: 'JavaScript Fundamentals',
    description: 'Assess your understanding of JavaScript core concepts, functions, and ES6 features.',
    category: 'JavaScript',
    difficulty: 'beginner',
    duration: 25,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 6,
    questions: [
      { questionText: 'How do you declare a variable in JavaScript?', questionType: 'multiple_choice', options: ['var x', 'let x', 'const x', 'All of the above'], correctAnswer: '3', points: 1, orderNumber: 1, explanation: 'JavaScript supports var, let, and const for variable declarations.' },
      { questionText: 'What is the result of 2 + "2"?', questionType: 'multiple_choice', options: ['4', '"22"', 'NaN', 'Error'], correctAnswer: '1', points: 1, orderNumber: 2, explanation: 'JavaScript performs string concatenation when one operand is a string.' },
      { questionText: 'Which method adds an element to the end of an array?', questionType: 'multiple_choice', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: '0', points: 1, orderNumber: 3, explanation: 'push() adds elements to the end of an array.' },
      { questionText: 'What is the correct way to write an arrow function?', questionType: 'multiple_choice', options: ['() -> {}', '() => {}', '() = {}', 'function() => {}'], correctAnswer: '1', points: 1, orderNumber: 4, explanation: 'Arrow functions use the => syntax.' },
      { questionText: 'What does JSON.parse() do?', questionType: 'multiple_choice', options: ['Converts object to string', 'Converts string to object', 'Validates JSON', 'Formats JSON'], correctAnswer: '1', points: 1, orderNumber: 5, explanation: 'JSON.parse() converts a JSON string to a JavaScript object.' },
      { questionText: 'Which is NOT a primitive data type in JavaScript?', questionType: 'multiple_choice', options: ['string', 'number', 'object', 'boolean'], correctAnswer: '2', points: 1, orderNumber: 6, explanation: 'Object is not a primitive data type in JavaScript.' }
    ]
  },
  {
    title: 'React Fundamentals',
    description: 'Test your knowledge of React components, hooks, and state management.',
    category: 'React',
    difficulty: 'intermediate',
    duration: 30,
    passingScore: 75,
    type: 'multiple_choice',
    totalQuestions: 7,
    questions: [
      { questionText: 'What is JSX?', questionType: 'multiple_choice', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Extension'], correctAnswer: '0', points: 1, orderNumber: 1, explanation: 'JSX stands for JavaScript XML.' },
      { questionText: 'Which hook is used for side effects?', questionType: 'multiple_choice', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswer: '1', points: 1, orderNumber: 2, explanation: 'useEffect is used for side effects like API calls.' },
      { questionText: 'How do you pass data from parent to child component?', questionType: 'multiple_choice', options: ['Props', 'State', 'Context', 'Redux'], correctAnswer: '0', points: 1, orderNumber: 3, explanation: 'Props are used to pass data from parent to child.' },
      { questionText: 'What is the virtual DOM?', questionType: 'multiple_choice', options: ['Real DOM copy', 'JavaScript representation of DOM', 'Browser API', 'CSS framework'], correctAnswer: '1', points: 1, orderNumber: 4, explanation: 'Virtual DOM is a JavaScript representation of the real DOM.' },
      { questionText: 'Which is the correct way to update state?', questionType: 'multiple_choice', options: ['state.count++', 'setState({count: count + 1})', 'setCount(count + 1)', 'Both B and C'], correctAnswer: '3', points: 1, orderNumber: 5, explanation: 'Both setState and the setter from useState can update state.' },
      { questionText: 'What is a React key used for?', questionType: 'multiple_choice', options: ['Styling', 'Performance optimization', 'Event handling', 'State management'], correctAnswer: '1', points: 1, orderNumber: 6, explanation: 'Keys help React identify which items have changed for performance.' },
      { questionText: 'Which hook would you use for expensive calculations?', questionType: 'multiple_choice', options: ['useState', 'useEffect', 'useMemo', 'useCallback'], correctAnswer: '2', points: 1, orderNumber: 7, explanation: 'useMemo is used to memoize expensive calculations.' }
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Evaluate your understanding of fundamental data structures and algorithmic thinking.',
    category: 'Computer Science',
    difficulty: 'intermediate',
    duration: 35,
    passingScore: 80,
    type: 'multiple_choice',
    totalQuestions: 8,
    questions: [
      { questionText: 'What is the time complexity of binary search?', questionType: 'multiple_choice', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: '1', points: 1, orderNumber: 1, explanation: 'Binary search has O(log n) time complexity.' },
      { questionText: 'Which data structure uses LIFO principle?', questionType: 'multiple_choice', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: '1', points: 1, orderNumber: 2, explanation: 'Stack follows Last In First Out (LIFO) principle.' },
      { questionText: 'What is the worst-case time complexity of quicksort?', questionType: 'multiple_choice', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: '2', points: 1, orderNumber: 3, explanation: 'Quicksort has O(n²) worst-case time complexity.' },
      { questionText: 'Which traversal visits root node first?', questionType: 'multiple_choice', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correctAnswer: '1', points: 1, orderNumber: 4, explanation: 'Preorder traversal visits root first.' },
      { questionText: 'What is a hash collision?', questionType: 'multiple_choice', options: ['Two keys map to same index', 'Hash function fails', 'Memory overflow', 'Invalid key'], correctAnswer: '0', points: 1, orderNumber: 5, explanation: 'Hash collision occurs when different keys map to the same index.' },
      { questionText: 'Which is NOT a stable sorting algorithm?', questionType: 'multiple_choice', options: ['Merge sort', 'Bubble sort', 'Quick sort', 'Insertion sort'], correctAnswer: '2', points: 1, orderNumber: 6, explanation: 'Quick sort is not stable by default.' },
      { questionText: 'What is the space complexity of merge sort?', questionType: 'multiple_choice', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: '2', points: 1, orderNumber: 7, explanation: 'Merge sort requires O(n) additional space.' },
      { questionText: 'Which graph algorithm finds shortest path?', questionType: 'multiple_choice', options: ['DFS', 'BFS', 'Dijkstra', 'All of the above'], correctAnswer: '3', points: 1, orderNumber: 8, explanation: 'All can find shortest paths in different scenarios.' }
    ]
  },
  {
    title: 'SQL Database Fundamentals',
    description: 'Test your knowledge of SQL queries, database design, and relational concepts.',
    category: 'Database',
    difficulty: 'beginner',
    duration: 25,
    passingScore: 70,
    type: 'multiple_choice',
    totalQuestions: 6,
    questions: [
      { questionText: 'Which SQL command is used to retrieve data?', questionType: 'multiple_choice', options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correctAnswer: '1', points: 1, orderNumber: 1, explanation: 'SELECT is used to retrieve data from database.' },
      { questionText: 'What does ACID stand for?', questionType: 'multiple_choice', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Completeness, Integrity, Dependability', 'Authentication, Confidentiality, Integrity, Durability', 'Availability, Consistency, Isolation, Dependability'], correctAnswer: '0', points: 1, orderNumber: 2, explanation: 'ACID stands for Atomicity, Consistency, Isolation, Durability.' },
      { questionText: 'Which JOIN returns all records from both tables?', questionType: 'multiple_choice', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctAnswer: '3', points: 1, orderNumber: 3, explanation: 'FULL OUTER JOIN returns all records from both tables.' },
      { questionText: 'What is a primary key?', questionType: 'multiple_choice', options: ['Unique identifier', 'Foreign reference', 'Index column', 'Encrypted field'], correctAnswer: '0', points: 1, orderNumber: 4, explanation: 'Primary key uniquely identifies each record in a table.' },
      { questionText: 'Which clause is used to filter results?', questionType: 'multiple_choice', options: ['FILTER', 'WHERE', 'HAVING', 'CONDITION'], correctAnswer: '1', points: 1, orderNumber: 5, explanation: 'WHERE clause is used to filter records.' },
      { questionText: 'What does normalization prevent?', questionType: 'multiple_choice', options: ['Data redundancy', 'Fast queries', 'Data security', 'Data backup'], correctAnswer: '0', points: 1, orderNumber: 6, explanation: 'Normalization reduces data redundancy and improves data integrity.' }
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
