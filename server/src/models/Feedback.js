const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
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
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  applicantType: {
    type: DataTypes.ENUM('student', 'freelancer'),
    allowNull: false
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  strengths: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  areasForImprovement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  overallComment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'feedbacks'
});

module.exports = Feedback;
