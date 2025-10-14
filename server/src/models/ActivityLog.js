const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    // Examples: 'USER_VERIFIED', 'COMPANY_APPROVED', 'JOB_DELETED', etc.
  },
  targetType: {
    type: DataTypes.ENUM('user', 'company', 'university', 'job', 'application', 'system'),
    allowNull: false
  },
  targetId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  details: {
    type: DataTypes.JSONB, // Store additional info like old/new values
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'activity_logs',
  indexes: [
    {
      fields: ['adminId']
    },
    {
      fields: ['action']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = ActivityLog;
