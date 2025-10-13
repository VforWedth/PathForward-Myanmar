/**
 * Test Supabase Connection with detailed diagnostics
 * This bypasses the check-postgres.js script issues
 */

const { Client } = require('pg');
require('dotenv').config();

console.log('\n🔍 Supabase Connection Test\n');
console.log('═'.repeat(60));
console.log('\n📋 Configuration:');
console.log('═'.repeat(60));
console.log(`Host:     ${process.env.DB_HOST}`);
console.log(`Port:     ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`User:     ${process.env.DB_USER}`);
console.log(`Password: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)}`);
console.log('═'.repeat(60));

async function testConnection() {
  console.log('\n🧪 Attempting connection...\n');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Enable SSL for Supabase
    ssl: {
      rejectUnauthorized: false
    },
    // Connection timeout
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('⏳ Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Test query
    console.log('🔍 Testing database query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful!\n');

    console.log('📊 PostgreSQL Version:');
    console.log(result.rows[0].version);
    console.log('');

    // Check tables
    console.log('🔍 Checking for tables...');
    const tables = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    if (tables.rows.length > 0) {
      console.log(`✅ Found ${tables.rows.length} tables:\n`);
      tables.rows.forEach(row => {
        console.log(`   - ${row.tablename}`);
      });
    } else {
      console.log('⚠️  No tables found. Run migration: pnpm migrate');
    }

    await client.end();

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 SUCCESS! Connection to Supabase works!');
    console.log('═'.repeat(60));
    console.log('\n✅ Next steps:');
    console.log('   1. If no tables: pnpm migrate');
    console.log('   2. Start server: pnpm dev\n');

    process.exit(0);

  } catch (error) {
    console.log('❌ Connection failed!\n');
    console.log('🔴 Error Details:');
    console.log('═'.repeat(60));
    console.log(`Code:    ${error.code}`);
    console.log(`Message: ${error.message}`);
    console.log('═'.repeat(60));

    console.log('\n💡 Possible Solutions:\n');

    if (error.code === 'ENOTFOUND') {
      console.log('❌ DNS Resolution Failed');
      console.log('   Causes:');
      console.log('   - Network/firewall blocking Supabase');
      console.log('   - IPv6 connectivity issues');
      console.log('   - Corporate network restrictions');
      console.log('   - VPN interference');
      console.log('');
      console.log('   Solutions:');
      console.log('   1. Check internet connection');
      console.log('   2. Disable VPN temporarily');
      console.log('   3. Try different DNS:');
      console.log('      - Windows: Settings → Network → Change adapter');
      console.log('      - Use Google DNS: 8.8.8.8 and 8.8.4.4');
      console.log('   4. Check firewall settings');
      console.log('   5. Try from different network (mobile hotspot)');
      console.log('');
      console.log('   Test DNS manually:');
      console.log('   nslookup db.cgtnpglqjpedhjfcputl.supabase.co 8.8.8.8');

    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Connection Timeout');
      console.log('   - Firewall blocking port 5432');
      console.log('   - Network restrictions');
      console.log('   ');
      console.log('   Solutions:');
      console.log('   1. Check Windows Firewall');
      console.log('   2. Try different network');
      console.log('   3. Check corporate proxy settings');

    } else if (error.code === '28P01') {
      console.log('❌ Password Authentication Failed');
      console.log('   - Incorrect password in .env');
      console.log('   ');
      console.log('   Solutions:');
      console.log('   1. Check password in Supabase dashboard');
      console.log('   2. Reset password: Settings → Database');
      console.log('   3. Update DB_PASSWORD in .env');

    } else if (error.message.includes('certificate')) {
      console.log('❌ SSL Certificate Issue');
      console.log('   ');
      console.log('   Solutions:');
      console.log('   1. Update database.js with SSL config');
      console.log('   2. See SUPABASE_DATABASE_SETUP.md');

    } else {
      console.log('❌ Unknown Error');
      console.log('   ');
      console.log('   Please check:');
      console.log('   1. Supabase project is active (not paused)');
      console.log('   2. Connection details are correct');
      console.log('   3. Internet connection is stable');
    }

    await client.end().catch(() => {});
    process.exit(1);
  }
}

// Run test
testConnection();
