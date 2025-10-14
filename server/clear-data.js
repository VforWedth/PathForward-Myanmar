#!/usr/bin/env node

const { sequelize } = require('./src/config/database');
const { User, Student, Company, University, UniversityCompanyConnection, Job, Application } = require('./src/models');

async function clearData() {
  try {
    console.log('🗑️ Clearing existing data...');

    // Clear in order to respect foreign key constraints
    await Application.destroy({ where: {} });
    console.log('✅ Cleared applications');

    await Job.destroy({ where: {} });
    console.log('✅ Cleared jobs');

    await UniversityCompanyConnection.destroy({ where: {} });
    console.log('✅ Cleared university-company connections');

    await Student.destroy({ where: {} });
    console.log('✅ Cleared students');

    await Company.destroy({ where: {} });
    console.log('✅ Cleared companies');

    await University.destroy({ where: {} });
    console.log('✅ Cleared universities');

    await User.destroy({ where: {} });
    console.log('✅ Cleared users');

    console.log('🎉 All data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Run the clearing
if (require.main === module) {
  clearData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Clearing failed:', error);
    process.exit(1);
  });
}

module.exports = { clearData };
