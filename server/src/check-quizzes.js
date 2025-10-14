// server/src/check-quizzes.js
const { sequelize } = require('./config/database');
const { Quiz, Question } = require('./models');

async function checkQuizzes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Count quizzes
    const quizCount = await Quiz.count();
    console.log(`📊 Total Quizzes: ${quizCount}`);

    if (quizCount === 0) {
      console.log('❌ No quizzes found! Run: node seed-quizzes.js\n');
      process.exit(1);
    }

    // List all quizzes
    const quizzes = await Quiz.findAll({
      attributes: ['id', 'title', 'category', 'isActive'],
      raw: true
    });

    console.log('\n📝 Quizzes in database:');
    quizzes.forEach((quiz, idx) => {
      console.log(`${idx + 1}. ${quiz.title} (${quiz.category}) - Active: ${quiz.isActive}`);
      console.log(`   ID: ${quiz.id}`);
    });

    // Count questions
    const questionCount = await Question.count();
    console.log(`\n📝 Total Questions: ${questionCount}\n`);

    // Check if any are inactive
    const activeCount = await Quiz.count({ where: { isActive: true } });
    const inactiveCount = quizCount - activeCount;
    
    if (inactiveCount > 0) {
      console.log(`⚠️  Warning: ${inactiveCount} quizzes are INACTIVE`);
    }

    console.log('✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkQuizzes();