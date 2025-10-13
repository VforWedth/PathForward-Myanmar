const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UniversityCompanyConnection = sequelize.define('UniversityCompanyConnection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  universityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'universities',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'inactive'),
    defaultValue: 'pending'
  },
  connectedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'university_company_connections'
});

module.exports = UniversityCompanyConnection;
