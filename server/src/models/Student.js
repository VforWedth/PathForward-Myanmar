const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  universityId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'universities',
      key: 'id'
    }
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 6
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobPreference: {
    type: DataTypes.ENUM('onsite', 'remote', 'ojt', 'hybrid'),
    defaultValue: 'onsite'
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolioUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('available', 'on_job', 'internship_completed'),
    defaultValue: 'available'
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'students'
});

module.exports = Student;
