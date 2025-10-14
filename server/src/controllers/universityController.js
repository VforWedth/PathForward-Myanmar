const { 
  University, 
  Student, 
  Company, 
  UniversityCompanyConnection,
  User,
  Application,
  Job
} = require('../models');
const { Op } = require('sequelize');

// @desc    Get university profile
// @route   GET /api/university/profile
// @access  Private (University)
const getProfile = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'phone', 'isVerified', 'isActive']
        }
      ]
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    res.json({
      success: true,
      university
    });
  } catch (error) {
    console.error('Get university profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update university profile
// @route   PUT /api/university/profile
// @access  Private (University)
const updateProfile = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const {
      universityName,
      location,
      description,
      website,
      logo,
      supportedMajors
    } = req.body;

    // Update university profile
    await university.update({
      universityName: universityName || university.universityName,
      location: location || university.location,
      description: description || university.description,
      website: website || university.website,
      logo: logo || university.logo,
      supportedMajors: supportedMajors || university.supportedMajors
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      university
    });
  } catch (error) {
    console.error('Update university profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all students from this university
// @route   GET /api/university/students
// @access  Private (University)
const getStudents = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const { page = 1, limit = 10, search, major, year, status } = req.query;
    const offset = (page - 1) * limit;

    // Build filter conditions
    const whereConditions = {
      universityId: university.id
    };

    if (major) {
      whereConditions.major = { [Op.iLike]: `%${major}%` };
    }

    if (year) {
      whereConditions.year = year;
    }

    if (status) {
      whereConditions.status = status;
    }

    // Search by name
    let userWhereConditions = {};
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const students = await Student.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'phone', 'isVerified', 'isActive'],
          where: userWhereConditions
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      students: students.rows,
      pagination: {
        total: students.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(students.count / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify/Approve student account
// @route   POST /api/university/verify-student/:studentId
// @access  Private (University)
const verifyStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          as: 'user'
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student belongs to this university
    if (student.universityId && student.universityId !== university.id) {
      return res.status(403).json({
        success: false,
        message: 'This student does not belong to your university'
      });
    }

    if (action === 'approve') {
      // Approve student
      await student.update({
        universityId: university.id,
        verificationStatus: 'approved'
      });

      // Update user verification status
      await student.user.update({
        isVerified: true
      });

      res.json({
        success: true,
        message: 'Student verified successfully',
        student
      });
    } else if (action === 'reject') {
      // Reject student
      await student.update({
        verificationStatus: 'rejected',
        rejectionReason: reason
      });

      res.json({
        success: true,
        message: 'Student verification rejected',
        student
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }
  } catch (error) {
    console.error('Verify student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Connect with a company
// @route   POST /api/university/connect-company/:companyId
// @access  Private (University)
const connectCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if connection already exists
    const existingConnection = await UniversityCompanyConnection.findOne({
      where: {
        universityId: university.id,
        companyId: companyId
      }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection already exists',
        connection: existingConnection
      });
    }

    // Create connection
    const connection = await UniversityCompanyConnection.create({
      universityId: university.id,
      companyId: companyId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent to company',
      connection
    });
  } catch (error) {
    console.error('Connect company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get connected companies
// @route   GET /api/university/connected-companies
// @access  Private (University)
const getConnectedCompanies = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const { status = 'active' } = req.query;

    const connections = await UniversityCompanyConnection.findAll({
      where: {
        universityId: university.id,
        ...(status && { status })
      },
      include: [
        {
          model: Company,
          as: 'company',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['email', 'phone', 'isVerified']
            }
          ]
        }
      ],
      order: [['connectedAt', 'DESC']]
    });

    res.json({
      success: true,
      connections,
      total: connections.length
    });
  } catch (error) {
    console.error('Get connected companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get employment statistics
// @route   GET /api/university/employment-stats
// @access  Private (University)
const getEmploymentStats = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    // Get total students
    const totalStudents = await Student.count({
      where: { universityId: university.id }
    });

    // Get students by status
    const availableStudents = await Student.count({
      where: { 
        universityId: university.id,
        status: 'available'
      }
    });

    const onJobStudents = await Student.count({
      where: { 
        universityId: university.id,
        status: 'on_job'
      }
    });

    const internshipCompletedStudents = await Student.count({
      where: { 
        universityId: university.id,
        status: 'internship_completed'
      }
    });

    // Get applications statistics
    const students = await Student.findAll({
      where: { universityId: university.id },
      attributes: ['id']
    });

    const studentIds = students.map(s => s.id);

    const totalApplications = await Application.count({
      where: { studentId: { [Op.in]: studentIds } }
    });

    const acceptedApplications = await Application.count({
      where: { 
        studentId: { [Op.in]: studentIds },
        status: 'accepted'
      }
    });

    const pendingApplications = await Application.count({
      where: { 
        studentId: { [Op.in]: studentIds },
        status: 'pending'
      }
    });

    const rejectedApplications = await Application.count({
      where: { 
        studentId: { [Op.in]: studentIds },
        status: 'rejected'
      }
    });

    // Get top hiring companies
    const topCompanies = await Application.findAll({
      where: { 
        studentId: { [Op.in]: studentIds },
        status: 'accepted'
      },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: Company,
              as: 'company',
              attributes: ['id', 'companyName', 'industry', 'location']
            }
          ]
        }
      ],
      attributes: ['jobId'],
      group: ['jobId', 'job.id', 'job.companyId', 'job->company.id'],
      raw: false
    });

    // Get students by major
    const studentsByMajor = await Student.findAll({
      where: { universityId: university.id },
      attributes: [
        'major',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['major'],
      raw: true
    });

    // Get students by year
    const studentsByYear = await Student.findAll({
      where: { universityId: university.id },
      attributes: [
        'year',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['year'],
      order: [['year', 'ASC']],
      raw: true
    });

    // Calculate employment rate
    const employmentRate = totalStudents > 0 
      ? ((onJobStudents + internshipCompletedStudents) / totalStudents * 100).toFixed(2)
      : 0;

    // Calculate application success rate
    const successRate = totalApplications > 0
      ? (acceptedApplications / totalApplications * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      stats: {
        students: {
          total: totalStudents,
          available: availableStudents,
          onJob: onJobStudents,
          internshipCompleted: internshipCompletedStudents,
          employmentRate: parseFloat(employmentRate)
        },
        applications: {
          total: totalApplications,
          accepted: acceptedApplications,
          pending: pendingApplications,
          rejected: rejectedApplications,
          successRate: parseFloat(successRate)
        },
        demographics: {
          byMajor: studentsByMajor,
          byYear: studentsByYear
        },
        topCompanies: topCompanies.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get employment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Generate employment report
// @route   GET /api/university/generate-report
// @access  Private (University)
const generateReport = async (req, res) => {
  try {
    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const { startDate, endDate, format = 'json' } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = { 
        ...dateFilter.createdAt,
        [Op.lte]: new Date(endDate) 
      };
    }

    // Get students with applications
    const students = await Student.findAll({
      where: { 
        universityId: university.id,
        ...dateFilter
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'isVerified']
        },
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: Job,
              as: 'job',
              include: [
                {
                  model: Company,
                  as: 'company',
                  attributes: ['companyName', 'industry']
                }
              ]
            }
          ]
        }
      ]
    });

    const report = {
      university: {
        name: university.universityName,
        location: university.location
      },
      reportPeriod: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      summary: {
        totalStudents: students.length,
        studentsWithApplications: students.filter(s => s.applications.length > 0).length,
        totalApplications: students.reduce((sum, s) => sum + s.applications.length, 0),
        acceptedApplications: students.reduce((sum, s) => 
          sum + s.applications.filter(a => a.status === 'accepted').length, 0
        )
      },
      students: students.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.user.email,
        major: student.major,
        year: student.year,
        status: student.status,
        applications: student.applications.map(app => ({
          company: app.job.company.companyName,
          position: app.job.title,
          status: app.status,
          appliedAt: app.createdAt
        }))
      })),
      generatedAt: new Date()
    };

    // TODO: Implement CSV/PDF export based on format parameter
    if (format === 'csv') {
      // Convert to CSV format
      return res.status(501).json({
        success: false,
        message: 'CSV export not yet implemented'
      });
    }

    if (format === 'pdf') {
      // Convert to PDF format
      return res.status(501).json({
        success: false,
        message: 'PDF export not yet implemented'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Disconnect from a company
// @route   DELETE /api/university/disconnect-company/:companyId
// @access  Private (University)
const disconnectCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const university = await University.findOne({
      where: { userId: req.user.id }
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University profile not found'
      });
    }

    const connection = await UniversityCompanyConnection.findOne({
      where: {
        universityId: university.id,
        companyId: companyId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Update status to inactive instead of deleting
    await connection.update({ status: 'inactive' });

    res.json({
      success: true,
      message: 'Company disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStudents,
  verifyStudent,
  connectCompany,
  getConnectedCompanies,
  getEmploymentStats,
  generateReport,
  disconnectCompany
};
