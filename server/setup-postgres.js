/**
 * PostgreSQL Automated Setup Script
 *
 * This script will:
 * 1. Test connection to PostgreSQL
 * 2. Create database if it doesn't exist
 * 3. Run migrations automatically
 * 4. Verify all tables were created
 *
 * Usage: pnpm setup
 */

const { Client } = require('pg');
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

// Display configuration
function displayConfig() {
  console.log('\n' + '='.repeat(60));
  logInfo('PostgreSQL Setup Configuration');
  console.log('='.repeat(60));
  console.log(`Host:     ${process.env.DB_HOST}`);
  console.log(`Port:     ${process.env.DB_PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`User:     ${process.env.DB_USER}`);
  console.log(`Password: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)}`);
  console.log('='.repeat(60) + '\n');
}

// Test connection to default postgres database
async function testConnection() {
  logStep('Testing PostgreSQL connection...');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Default database
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query('SELECT version()');
    const version = result.rows[0].version;

    logSuccess('Connected to PostgreSQL!');
    logInfo(`Version: ${version.split(',')[0]}`);

    await client.end();
    return true;
  } catch (error) {
    logError('Failed to connect to PostgreSQL!');
    console.log('');

    if (error.code === '28P01') {
      logError('Password Authentication Failed!');
      console.log('');
      log('💡 Solution:', 'yellow');
      console.log('   1. Open pgAdmin 4');
      console.log('   2. Set/reset your postgres user password');
      console.log('   3. Update DB_PASSWORD in server/.env file');
      console.log('   4. Run this script again');
      console.log('');
      log('📖 See PGADMIN_GUIDE.md for detailed instructions with screenshots', 'cyan');
    } else if (error.code === 'ECONNREFUSED') {
      logError('PostgreSQL server is not running!');
      console.log('');
      log('💡 Solution:', 'yellow');
      console.log('   1. Press Win + R');
      console.log('   2. Type: services.msc');
      console.log('   3. Find "postgresql-x64-16" service');
      console.log('   4. Right-click → Start');
      console.log('   5. Run this script again');
    } else if (error.code === 'ENOTFOUND') {
      logError('Cannot find PostgreSQL server!');
      console.log('');
      log('💡 Solution:', 'yellow');
      console.log('   1. Check DB_HOST in .env (should be "localhost")');
      console.log('   2. Verify PostgreSQL is installed');
      console.log('   3. See POSTGRESQL_SETUP_WINDOWS.md for installation guide');
    } else {
      logError(`Unexpected error: ${error.message}`);
      console.log('');
      log('💡 Run diagnostics for more info:', 'yellow');
      console.log('   pnpm check-db');
    }

    await client.end().catch(() => {});
    return false;
  }
}

// Check if database exists
async function checkDatabaseExists() {
  logStep(`Checking if database '${process.env.DB_NAME}' exists...`);

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
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_NAME]
    );

    await client.end();

    if (result.rows.length > 0) {
      logSuccess(`Database '${process.env.DB_NAME}' already exists!`);
      return true;
    } else {
      logWarning(`Database '${process.env.DB_NAME}' does not exist.`);
      return false;
    }
  } catch (error) {
    logError(`Error checking database: ${error.message}`);
    await client.end().catch(() => {});
    throw error;
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

    logSuccess(`Database '${process.env.DB_NAME}' created successfully!`);

    await client.end();
    return true;
  } catch (error) {
    if (error.code === '42P04') {
      logWarning('Database already exists (another process may have created it)');
      await client.end();
      return true;
    }

    logError(`Failed to create database: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Run migrations
function runMigrations() {
  logStep('Running database migrations...');

  try {
    // Run the migration script
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

// Verify tables were created
async function verifyTables() {
  logStep('Verifying tables...');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );

    const tables = result.rows.map(row => row.tablename);
    const expectedTables = [
      'applications',
      'certificates',
      'companies',
      'education',
      'experience',
      'feedbacks',
      'freelancers',
      'jobs',
      'reviews',
      'students',
      'universities',
      'university_company_connections',
      'users'
    ];

    console.log('');
    logInfo(`Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table}`);
    });

    if (tables.length === expectedTables.length) {
      logSuccess(`All ${expectedTables.length} tables created successfully!`);
    } else {
      logWarning(`Expected ${expectedTables.length} tables, found ${tables.length}`);
    }

    await client.end();
    return tables.length === expectedTables.length;
  } catch (error) {
    logError(`Error verifying tables: ${error.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

// Main setup function
async function setup() {
  console.log('\n' + '='.repeat(60));
  log('🚀 PathForward Myanmar - PostgreSQL Setup', 'cyan');
  console.log('='.repeat(60));

  displayConfig();

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
    console.log('   2. Copy from .env.example if needed: cp .env.example .env');
    console.log('   3. Fill in all required values');
    process.exit(1);
  }

  try {
    // Step 1: Test connection
    const connected = await testConnection();
    if (!connected) {
      console.log('');
      logError('Setup failed: Cannot connect to PostgreSQL');
      logInfo('Fix the connection issue and try again');
      process.exit(1);
    }

    // Step 2: Check if database exists
    const dbExists = await checkDatabaseExists();

    // Step 3: Create database if needed
    if (!dbExists) {
      const created = await createDatabase();
      if (!created) {
        logError('Setup failed: Cannot create database');
        process.exit(1);
      }
    }

    // Step 4: Run migrations
    const migrated = runMigrations();
    if (!migrated) {
      logError('Setup failed: Migration errors');
      process.exit(1);
    }

    // Step 5: Verify tables
    await verifyTables();

    // Success!
    console.log('\n' + '='.repeat(60));
    log('🎉 Setup Complete!', 'green');
    console.log('='.repeat(60));
    console.log('');
    logSuccess('Database is ready!');
    console.log('');
    log('Next steps:', 'cyan');
    console.log('   1. Start the server: pnpm dev');
    console.log('   2. Open frontend: cd ../client && pnpm dev');
    console.log('   3. Visit: http://localhost:3000');
    console.log('');
    log('Useful commands:', 'cyan');
    console.log('   pnpm check-db  - Check database connection');
    console.log('   pnpm reset-db  - Reset database (drops all data)');
    console.log('   pnpm dev       - Start development server');
    console.log('');

  } catch (error) {
    console.log('');
    logError(`Setup failed with error: ${error.message}`);
    console.log('');
    log('💡 Try running diagnostics:', 'yellow');
    console.log('   pnpm check-db');
    process.exit(1);
  }
}

// Run setup
setup();
