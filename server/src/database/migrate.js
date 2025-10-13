const { sequelize, testConnection } = require('../config/database');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Test connection
    await testConnection();

    // Sync all models
    await sequelize.sync({ force: false, alter: true });

    console.log('✅ Database migration completed successfully!');
    console.log('📊 All models synchronized');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
