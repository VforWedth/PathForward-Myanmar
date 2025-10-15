const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    // Examples: 'cv_upload', 'certificate_earned', 'application_submitted', 'profile_updated', etc.
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  relatedType: {
    type: DataTypes.ENUM('job', 'application', 'company', 'quiz', 'certificate', 'profile'),
    allowNull: true
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB, // Additional data like score, certificate URL, etc.
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'activities',
  indexes: [
    {
      fields: ['studentId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Activity;
