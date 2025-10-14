// Quick script to test database and check for quizzes
const { Sequelize } = require('sequelize');

// Try to connect using environment variables or defaults
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pathforward_myanmar',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Connected to database!\n');

    // Try to query the quizzes table
    console.log('📊 Checking quizzes table...');
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM quizzes');
    const count = results[0].count;
    
    console.log(`Found ${count} quizzes in database\n`);
    
    if (count === 0) {
      console.log('❌ No quizzes found! You need to seed the database.');
      console.log('   Run: node server/seed-quizzes.js');
    } else {
      // Get list of quizzes
      const [quizzes] = await sequelize.query(`
        SELECT id, title, category, difficulty, "isActive" 
        FROM quizzes 
        LIMIT 10
      `);
      console.log('📝 Quizzes:');
      quizzes.forEach((quiz, idx) => {
        console.log(`   ${idx + 1}. ${quiz.title} (${quiz.category}) - Active: ${quiz.isActive}`);
      });
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('\nMake sure:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials are correct');
    console.error('3. Database exists');
    process.exit(1);
  }
}

testDatabase();
