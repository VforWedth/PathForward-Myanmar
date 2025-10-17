const User = require('./User');
const Student = require('./Student');
const Company = require('./Company');
const University = require('./University');
const Freelancer = require('./Freelancer');
const Job = require('./Job');
const Application = require('./Application');
const Review = require('./Review');
const Feedback = require('./Feedback');
const UniversityCompanyConnection = require('./UniversityCompanyConnection');
const Education = require('./Education');
const Experience = require('./Experience');
const Certificate = require('./Certificate');
const ActivityLog = require('./ActivityLog');
const Activity = require('./Activity');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const Notification = require('./Notification');
const Project = require('./Project');
const CompanyProject = require('./CompanyProject');

// User Relationships
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Company, { foreignKey: 'userId', onDelete: 'CASCADE' });
Company.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(University, { foreignKey: 'userId', onDelete: 'CASCADE' });
University.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Freelancer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Freelancer.belongsTo(User, { foreignKey: 'userId' });

// Student Relationships
Student.belongsTo(University, { foreignKey: 'universityId' });
University.hasMany(Student, { foreignKey: 'universityId' });

Student.hasMany(Education, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Education.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Experience, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Experience.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Certificate, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Certificate.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Activity, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Activity.belongsTo(Student, { foreignKey: 'studentId' });

// Company Relationships
Company.hasMany(Job, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

// Job Relationships
Job.hasMany(Application, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

// Review Relationships
Company.hasMany(Review, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Review.belongsTo(Company, { foreignKey: 'companyId' });

// Feedback Relationships
Company.hasMany(Feedback, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Feedback.belongsTo(Company, { foreignKey: 'companyId' });

Job.hasMany(Feedback, { foreignKey: 'jobId', onDelete: 'SET NULL' });
Feedback.belongsTo(Job, { foreignKey: 'jobId' });

// University-Company Connection
University.belongsToMany(Company, {
  through: UniversityCompanyConnection,
  foreignKey: 'universityId',
  otherKey: 'companyId'
});
Company.belongsToMany(University, {
  through: UniversityCompanyConnection,
  foreignKey: 'companyId',
  otherKey: 'universityId'
});

// Direct associations for easier querying
UniversityCompanyConnection.belongsTo(University, { foreignKey: 'universityId' });
UniversityCompanyConnection.belongsTo(Company, { foreignKey: 'companyId' });

// ActivityLog Relationships
User.hasMany(ActivityLog, { foreignKey: 'adminId', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

// Quiz Relationships
Quiz.hasMany(Question, { foreignKey: 'quizId', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });

Student.hasMany(QuizAttempt, { foreignKey: 'studentId', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Student, { foreignKey: 'studentId' });

User.hasMany(Quiz, { foreignKey: 'createdBy', onDelete: 'SET NULL' });
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Notification Relationships
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Project Relationships
Freelancer.hasMany(Project, { foreignKey: 'freelancerId', onDelete: 'CASCADE' });
Project.belongsTo(Freelancer, { foreignKey: 'freelancerId' });

// Company Project Relationships (for hiring freelancers)
Company.hasMany(CompanyProject, { foreignKey: 'companyId', onDelete: 'CASCADE' });
CompanyProject.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = {
  User,
  Student,
  Company,
  University,
  Freelancer,
  Job,
  Application,
  Review,
  Feedback,
  UniversityCompanyConnection,
  Education,
  Experience,
  Certificate,
  ActivityLog,
  Activity,
  Quiz,
  Question,
  QuizAttempt,
  Notification,
  Project,
  CompanyProject
};
