const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workMode: {
    type: DataTypes.ENUM('onsite', 'remote', 'ojt', 'hybrid'),
    defaultValue: 'onsite'
  },
  jobType: {
    type: DataTypes.ENUM('internship', 'full-time', 'part-time', 'contract', 'freelance'),
    allowNull: false
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skillsRequired: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  majorsPreferred: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  experienceLevel: {
    type: DataTypes.ENUM('entry', 'mid', 'senior'),
    defaultValue: 'entry'
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  numberOfPositions: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  timestamps: true,
  tableName: 'jobs'
});

module.exports = Job;
