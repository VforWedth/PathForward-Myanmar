const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Check if using SQLite or PostgreSQL
const useSQLite = process.env.DB_DIALECT === 'sqlite' || !process.env.DB_NAME;

const sequelize = useSQLite 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../demo-database.sqlite'),
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,

        // SSL configuration for cloud databases (Supabase, Heroku, etc.)
        dialectOptions: {
          ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase.co') ? {
            require: true,
            rejectUnauthorized: false
          } : false
        },

        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
