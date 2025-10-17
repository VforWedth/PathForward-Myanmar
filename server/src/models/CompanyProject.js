const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanyProject = sequelize.define('CompanyProject', {
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

  // Company Information
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactRole: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Project Overview
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  objective: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliverables: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Technical Requirements
  techStack: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  integrationRequirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referenceLinks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  designGuidelines: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Timeline
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  milestones: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Budget and Payment
  budgetType: {
    type: DataTypes.ENUM('fixed', 'hourly', 'milestone'),
    defaultValue: 'fixed'
  },
  budgetMin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  budgetMax: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bonusRewards: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Freelancer Requirements
  experienceLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'expert'),
    defaultValue: 'intermediate'
  },
  skillsRequired: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  preferredLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolioRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  communicationExpectation: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Legal/Policy
  ndaRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ownershipTerms: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Project Status
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active'
  },

  // Attachments (stored as JSON array of file URLs/paths)
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'company_projects'
});

module.exports = CompanyProject;
