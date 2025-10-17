const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  freelancerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'freelancers',
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
  skillsRequired: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  partnersNeeded: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  projectType: {
    type: DataTypes.ENUM('web', 'mobile', 'desktop', 'ai', 'other'),
    defaultValue: 'web'
  },
  timeline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'in-progress', 'completed', 'archived'),
    defaultValue: 'active'
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL to uploaded project documentation'
  }
}, {
  timestamps: true,
  tableName: 'projects'
});

module.exports = Project;
