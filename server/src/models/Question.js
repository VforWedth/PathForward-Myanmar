const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  questionType: {
    type: DataTypes.ENUM('multiple_choice', 'coding'),
    defaultValue: 'multiple_choice'
  },
  // For multiple choice questions
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  correctAnswer: {
    type: DataTypes.STRING, // For MCQ: option index (0,1,2,3), For coding: expected output or test cases
    allowNull: false
  },
  // For coding questions
  starterCode: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  testCases: {
    type: DataTypes.JSONB, // Array of {input, expectedOutput}
    allowNull: true
  },
  language: {
    type: DataTypes.STRING, // python, java, javascript, etc.
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  orderNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'questions'
});

module.exports = Question;
