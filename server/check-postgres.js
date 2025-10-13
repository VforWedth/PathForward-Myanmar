/**
 * PostgreSQL Connection Checker
 * Run this to diagnose database connection issues
 *
 * Usage: node check-postgres.js
 */

const { Client } = require('pg');
require('dotenv').config();

console.log('\n🔍 PostgreSQL Connection Checker\n');
console.log('='.repeat(50));

// Display current configuration
console.log('\n📋 Current Configuration from .env:');
console.log('='.repeat(50));
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Password: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)} (${process.env.DB_PASSWORD?.length || 0} characters)`);
console.log('='.repeat(50));

// Test 1: Connect to default 'postgres' database
async function testDefaultConnection() {
  console.log('\n🧪 Test 1: Connecting to default postgres database...');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Default database
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    const result = await client.query('SELECT version()');
    console.log('\n📊 PostgreSQL Version:');
    console.log(result.rows[0].version);

    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Failed to connect to PostgreSQL');
    console.log('\n🔴 Error Details:');
    console.log(`Code: ${error.code}`);
    console.log(`Message: ${error.message}`);

    if (error.code === '28P01') {
      console.log('\n💡 Solution: Password is incorrect!');
      console.log('   1. Check your PostgreSQL password');
      console.log('   2. Update DB_PASSWORD in server/.env file');
      console.log('   3. If you forgot password, see POSTGRESQL_SETUP_WINDOWS.md');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: PostgreSQL is not running!');
      console.log('   1. Open Services (Win + R, type "services.msc")');
      console.log('   2. Find "postgresql-x64-16" service');
      console.log('   3. Right-click and select "Start"');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Solution: Cannot find PostgreSQL server!');
      console.log('   1. Check DB_HOST in .env (should be "localhost")');
      console.log('   2. Verify PostgreSQL is installed');
    }

    await client.end().catch(() => {});
    return false;
  }
}

// Test 2: Check if target database exists
async function testTargetDatabase() {
  console.log('\n🧪 Test 2: Checking if target database exists...');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (result.rows.length > 0) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists!`);
      await client.end();
      return true;
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does NOT exist!`);
      console.log('\n💡 Solution: Create the database');
      console.log('   Method 1 - Automated (Recommended):');
      console.log('   pnpm setup');
      console.log('\n   Method 2 - Command Line:');
      console.log('   1. Open PowerShell');
      console.log('   2. cd "C:\\Program Files\\PostgreSQL\\16\\bin"');
      console.log('   3. .\\psql.exe -U postgres');
      console.log(`   4. CREATE DATABASE ${process.env.DB_NAME};`);
      console.log('   5. \\q');
      console.log('\n   Method 3 - pgAdmin:');
      console.log('   1. Open pgAdmin 4');
      console.log('   2. Right-click "Databases"');
      console.log('   3. Create → Database');
      console.log(`   4. Name: ${process.env.DB_NAME}`);

      await client.end();
      return false;
    }
  } catch (error) {
    console.log('❌ Could not check database existence');
    console.log(`Error: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Test 3: Connect to target database
async function testProjectDatabase() {
  console.log(`\n🧪 Test 3: Connecting to '${process.env.DB_NAME}' database...`);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log(`✅ Successfully connected to '${process.env.DB_NAME}'!`);

    // Check if tables exist
    const result = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );

    console.log(`\n📊 Found ${result.rows.length} tables:`);
    if (result.rows.length === 0) {
      console.log('⚠️  No tables found - you need to run migration!');
      console.log('\n💡 Solution:');
      console.log('   pnpm setup  (or pnpm migrate)');
    } else {
      result.rows.forEach(row => {
        console.log(`   - ${row.tablename}`);
      });

      if (result.rows.length === 13) {
        console.log('\n✅ All 13 tables exist! Database is ready!');
      } else {
        console.log(`\n⚠️  Expected 13 tables, found ${result.rows.length}`);
        console.log('   Consider running migration again: pnpm migrate');
      }
    }

    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ Could not connect to '${process.env.DB_NAME}'`);
    console.log(`Error: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Starting diagnostics...\n');

  // Validate environment variables
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log('\n💡 Solution:');
    console.log('   1. Make sure .env file exists in server/ directory');
    console.log('   2. Copy from .env.example if needed');
    console.log('   3. Fill in all required values');
    return;
  }

  const test1 = await testDefaultConnection();

  if (!test1) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Cannot proceed with other tests');
    console.log('Fix the connection issue first!');
    console.log('See POSTGRESQL_SETUP_WINDOWS.md for detailed help');
    console.log('='.repeat(50));
    return;
  }

  const test2 = await testTargetDatabase();

  if (test2) {
    await testProjectDatabase();
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Diagnostics Complete!');
  console.log('='.repeat(50));

  if (test1 && test2) {
    console.log('\n🎉 Everything looks good!');
    console.log('You can now run: pnpm dev');
  } else {
    console.log('\n⚠️  Please fix the issues above');
    console.log('See POSTGRESQL_SETUP_WINDOWS.md for detailed instructions');
  }
}

// Run the checker
runAllTests().catch(err => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
