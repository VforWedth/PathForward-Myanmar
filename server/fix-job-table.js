/**
 * Fix Job Table - Add missing columns
 * Run this script to add targetUniversities and isPublic columns to jobs table
 */

const { sequelize } = require('./src/config/database');
const { QueryTypes } = require('sequelize');

async function fixJobTable() {
  try {
    console.log('🔧 Checking and fixing jobs table...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check if columns exist
    const columns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'jobs' 
       AND column_name IN ('targetUniversities', 'isPublic')`,
      { type: QueryTypes.SELECT }
    );

    const existingColumns = columns.map(c => c.column_name);
    console.log('📋 Existing columns:', existingColumns);

    // Add targetUniversities if missing
    if (!existingColumns.includes('targetUniversities')) {
      console.log('➕ Adding targetUniversities column...');
      await sequelize.query(
        `ALTER TABLE jobs 
         ADD COLUMN "targetUniversities" UUID[] DEFAULT ARRAY[]::UUID[]`,
        { type: QueryTypes.RAW }
      );
      console.log('✅ targetUniversities column added');
    } else {
      console.log('✓ targetUniversities column already exists');
    }

    // Add isPublic if missing
    if (!existingColumns.includes('isPublic')) {
      console.log('➕ Adding isPublic column...');
      await sequelize.query(
        `ALTER TABLE jobs 
         ADD COLUMN "isPublic" BOOLEAN DEFAULT true`,
        { type: QueryTypes.RAW }
      );
      console.log('✅ isPublic column added');
    } else {
      console.log('✓ isPublic column already exists');
    }

    // Add comment to targetUniversities
    await sequelize.query(
      `COMMENT ON COLUMN jobs."targetUniversities" IS 'Array of university IDs that can see this job posting'`,
      { type: QueryTypes.RAW }
    );

    // Add comment to isPublic
    await sequelize.query(
      `COMMENT ON COLUMN jobs."isPublic" IS 'If true, job is visible to all. If false, only target universities can see it'`,
      { type: QueryTypes.RAW }
    );

    console.log('\n✅ Job table fixed successfully!');
    console.log('\nYou can now:');
    console.log('1. Post jobs with targetUniversities');
    console.log('2. Set jobs as public or private');
    console.log('3. Share jobs with specific universities\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing job table:', error);
    process.exit(1);
  }
}

fixJobTable();
