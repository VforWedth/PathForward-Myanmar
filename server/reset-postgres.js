/**
 * PostgreSQL Database Reset Script
 *
 * This script will:
 * 1. Ask for confirmation
 * 2. Drop the database (deletes ALL data)
 * 3. Create fresh database
 * 4. Run migrations
 *
 * ⚠️ WARNING: This will DELETE ALL DATA!
 *
 * Usage: pnpm reset-db
 */

const { Client } = require('pg');
const readline = require('readline');
const { execSync } = require('child_process');
require('dotenv').config();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logStep(message) {
  log(`\n🔄 ${message}`, 'blue');
}

// Ask for confirmation
function askConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('');
    log('⚠️  WARNING: DATABASE RESET', 'red');
    console.log('');
    log('This will:', 'yellow');
    console.log(`   - DROP database '${process.env.DB_NAME}'`);
    console.log('   - DELETE all tables and data');
    console.log('   - CREATE fresh database');
    console.log('   - RUN migrations');
    console.log('');
    log('⚠️  ALL DATA WILL BE LOST!', 'red');
    console.log('');

    rl.question(log('Are you sure you want to continue? (yes/no): ', 'yellow'), (answer) => {
      rl.close();
      const confirmed = answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
      resolve(confirmed);
    });
  });
}

// Drop database
async function dropDatabase() {
  logStep(`Dropping database '${process.env.DB_NAME}'...`);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    // Terminate existing connections
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${process.env.DB_NAME}'
        AND pid <> pg_backend_pid()
    `);

    // Drop database
    await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

    logSuccess(`Database '${process.env.DB_NAME}' dropped!`);

    await client.end();
    return true;
  } catch (error) {
    logError(`Failed to drop database: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Create database
async function createDatabase() {
  logStep(`Creating database '${process.env.DB_NAME}'...`);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);

    logSuccess(`Database '${process.env.DB_NAME}' created!`);

    await client.end();
    return true;
  } catch (error) {
    logError(`Failed to create database: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Run migrations
function runMigrations() {
  logStep('Running database migrations...');

  try {
    execSync('node src/database/migrate.js', {
      stdio: 'inherit',
      cwd: __dirname
    });

    return true;
  } catch (error) {
    logError('Migration failed!');
    return false;
  }
}

// Main reset function
async function reset() {
  console.log('\n' + '='.repeat(60));
  log('🔄 PathForward Myanmar - Database Reset', 'cyan');
  console.log('='.repeat(60));

  // Validate environment variables
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    logError('Missing required environment variables!');
    console.log('');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log('');
    log('💡 Solution:', 'yellow');
    console.log('   1. Make sure .env file exists in server/ directory');
    console.log('   2. Fill in all required values');
    process.exit(1);
  }

  // Ask for confirmation
  const confirmed = await askConfirmation();

  if (!confirmed) {
    console.log('');
    logInfo('Reset cancelled. No changes made.');
    console.log('');
    process.exit(0);
  }

  try {
    // Step 1: Drop database
    const dropped = await dropDatabase();
    if (!dropped) {
      logError('Reset failed: Cannot drop database');
      process.exit(1);
    }

    // Step 2: Create database
    const created = await createDatabase();
    if (!created) {
      logError('Reset failed: Cannot create database');
      process.exit(1);
    }

    // Step 3: Run migrations
    const migrated = runMigrations();
    if (!migrated) {
      logError('Reset failed: Migration errors');
      process.exit(1);
    }

    // Success!
    console.log('\n' + '='.repeat(60));
    log('🎉 Database Reset Complete!', 'green');
    console.log('='.repeat(60));
    console.log('');
    logSuccess('Fresh database created with all tables!');
    console.log('');
    log('Next steps:', 'cyan');
    console.log('   1. Start the server: pnpm dev');
    console.log('   2. Register a new account');
    console.log('   3. Start testing!');
    console.log('');

  } catch (error) {
    console.log('');
    logError(`Reset failed with error: ${error.message}`);
    console.log('');
    log('💡 Try running diagnostics:', 'yellow');
    console.log('   pnpm check-db');
    process.exit(1);
  }
}

// Run reset
reset();
