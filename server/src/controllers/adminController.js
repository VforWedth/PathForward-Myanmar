const {
  User,
  Student,
  Company,
  University,
  Freelancer,
  Job,
  Application,
  ActivityLog
} = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Helper function to log admin activities
const logActivity = async (adminId, action, targetType, targetId, details, req) => {
  try {
    await ActivityLog.create({
      adminId,
      action,
      targetType,
      targetId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Activity logging failed:', error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.count();
    const students = await User.count({ where: { role: 'student' } });
    const companies = await User.count({ where: { role: 'company' } });
    const universities = await User.count({ where: { role: 'university' } });
    const freelancers = await User.count({ where: { role: 'freelancer' } });

    // Count pending verifications
    const pendingCompanies = await Company.count({
      where: { verificationStatus: 'pending' }
    });
    const pendingUniversities = await University.count({
      where: { verificationStatus: 'pending' }
    });

    // Count active jobs
    const activeJobs = await Job.count({
      where: { status: 'active' }
    });

    // Count total applications
    const totalApplications = await Application.count();

    // Recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentApplications = await Application.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students,
          companies,
          universities,
          freelancers
        },
        pendingVerifications: {
          companies: pendingCompanies,
          universities: pendingUniversities,
          total: pendingCompanies + pendingUniversities
        },
        jobs: {
          active: activeJobs
        },
        applications: {
          total: totalApplications,
          recent: recentApplications
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get chart data for dashboard
// @route   GET /api/admin/dashboard/charts
// @access  Private/Admin
exports.getDashboardCharts = async (req, res) => {
  try {
    // User growth over last 12 months
    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    // Job postings over last 12 months
    const jobGrowth = await Job.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        userGrowth,
        jobGrowth
      }
    });
  } catch (error) {
    console.error('Get dashboard charts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isVerified,
      isActive,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (role) where.role = role;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user details by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'student':
        profile = await Student.findOne({
          where: { userId: user.id },
          include: [{ model: University }]
        });
        break;
      case 'company':
        profile = await Company.findOne({ where: { userId: user.id } });
        break;
      case 'university':
        profile = await University.findOne({ where: { userId: user.id } });
        break;
      case 'freelancer':
        profile = await Freelancer.findOne({ where: { userId: user.id } });
        break;
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { email, phone, isVerified, isActive } = req.body;

    // Update user
    await user.update({
      email: email || user.email,
      phone: phone || user.phone,
      isVerified: isVerified !== undefined ? isVerified : user.isVerified,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    // Log activity
    await logActivity(
      req.user.id,
      'USER_UPDATED',
      'user',
      user.id,
      { changes: req.body },
      req
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isVerified: true });

    // Log activity
    await logActivity(
      req.user.id,
      'USER_VERIFIED',
      'user',
      user.id,
      { email: user.email },
      req
    );

    res.json({
      success: true,
      message: 'User verified successfully',
      data: user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private/Admin
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newStatus = !user.isActive;
    await user.update({ isActive: newStatus });

    // Log activity
    await logActivity(
      req.user.id,
      newStatus ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      'user',
      user.id,
      { email: user.email, newStatus },
      req
    );

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle user active error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    const userEmail = user.email;
    await user.destroy();

    // Log activity
    await logActivity(
      req.user.id,
      'USER_DELETED',
      'user',
      user.id,
      { email: userEmail },
      req
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get pending companies
// @route   GET /api/admin/companies/pending
// @access  Private/Admin
exports.getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { verificationStatus: 'pending' },
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'phone', 'createdAt']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get pending companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify company
// @route   PUT /api/admin/companies/:id/verify
// @access  Private/Admin
exports.verifyCompany = async (req, res) => {
  try {
    const { status, feedback } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await company.update({ verificationStatus: status });

    // Log activity
    await logActivity(
      req.user.id,
      `COMPANY_${status.toUpperCase()}`,
      'company',
      company.id,
      { companyName: company.companyName, feedback },
      req
    );

    res.json({
      success: true,
      message: `Company ${status} successfully`,
      data: company
    });
  } catch (error) {
    console.error('Verify company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get pending universities
// @route   GET /api/admin/universities/pending
// @access  Private/Admin
exports.getPendingUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      where: { verificationStatus: 'pending' },
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'phone', 'createdAt']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: universities
    });
  } catch (error) {
    console.error('Get pending universities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify university
// @route   PUT /api/admin/universities/:id/verify
// @access  Private/Admin
exports.verifyUniversity = async (req, res) => {
  try {
    const { status, feedback } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const university = await University.findByPk(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    await university.update({ verificationStatus: status });

    // Log activity
    await logActivity(
      req.user.id,
      `UNIVERSITY_${status.toUpperCase()}`,
      'university',
      university.id,
      { universityName: university.universityName, feedback },
      req
    );

    res.json({
      success: true,
      message: `University ${status} successfully`,
      data: university
    });
  } catch (error) {
    console.error('Verify university error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/admin/jobs/:id
// @access  Private/Admin
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update job status
// @route   PUT /api/admin/jobs/:id/status
// @access  Private/Admin
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // active, closed, draft

    if (!['active', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await job.update({ status });

    // Log activity
    await logActivity(
      req.user.id,
      'JOB_STATUS_UPDATED',
      'job',
      job.id,
      { title: job.title, newStatus: status },
      req
    );

    res.json({
      success: true,
      message: 'Job status updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const jobTitle = job.title;
    await job.destroy();

    // Log activity
    await logActivity(
      req.user.id,
      'JOB_DELETED',
      'job',
      job.id,
      { title: jobTitle, reason: req.body.reason },
      req
    );

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get activity logs
// @route   GET /api/admin/activity
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      adminId
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const { count, rows: logs } = await ActivityLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
