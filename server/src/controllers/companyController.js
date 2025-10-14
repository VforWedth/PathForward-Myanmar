const { User, Company, Job, Application, Feedback, Student, Freelancer } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Register a new company
 * @route   POST /api/company/register
 * @access  Public
 */
exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      industry,
      size,
      website,
      description,
      address,
      phone
    } = req.body;

    // Validate required fields
    if (!companyName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user account
    const user = await User.create({
      email,
      password,
      phone,
      role: 'company',
      isVerified: false
    });

    // Create company profile
    const company = await Company.create({
      userId: user.id,
      companyName,
      industry,
      location: address,
      description,
      website,
      companySize: size,
      verificationStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Company registration submitted for verification',
      data: {
        id: company.id,
        companyName: company.companyName,
        email: user.email,
        verificationStatus: company.verificationStatus
      }
    });
  } catch (error) {
    console.error('Register company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * @desc    Get company profile
 * @route   GET /api/company/profile
 * @access  Private (Company)
 */
exports.getProfile = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        attributes: ['email', 'phone', 'isVerified']
      }]
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/company/profile
 * @access  Private (Company)
 */
exports.updateProfile = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      location,
      description,
      website,
      companySize,
      phone
    } = req.body;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Update company details
    await company.update({
      companyName: companyName || company.companyName,
      industry: industry || company.industry,
      location: location || company.location,
      description: description || company.description,
      website: website || company.website,
      companySize: companySize || company.companySize
    });

    // Update user phone if provided
    if (phone) {
      await User.update(
        { phone },
        { where: { id: req.user.id } }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get company dashboard statistics
 * @route   GET /api/company/dashboard/stats
 * @access  Private (Company)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Get all jobs for this company
    const jobs = await Job.findAll({
      where: { companyId: company.id }
    });

    const jobIds = jobs.map(job => job.id);

    // Count active jobs
    const activeJobs = await Job.count({
      where: {
        companyId: company.id,
        status: 'active'
      }
    });

    // Count total applications
    const totalApplicants = await Application.count({
      where: {
        jobId: { [Op.in]: jobIds }
      }
    });

    // Count pending applications
    const pendingApplications = await Application.count({
      where: {
        jobId: { [Op.in]: jobIds },
        status: 'pending'
      }
    });

    // Count feedback given
    const feedbackGiven = await Feedback.count({
      where: { companyId: company.id }
    });

    res.json({
      success: true,
      data: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplicants,
        pendingApplications,
        feedbackGiven
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

/**
 * @desc    Get recent activity
 * @route   GET /api/company/dashboard/activity
 * @access  Private (Company)
 */
exports.getRecentActivity = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobs = await Job.findAll({
      where: { companyId: company.id },
      attributes: ['id']
    });
    const jobIds = jobs.map(job => job.id);

    // Get recent applications
    const recentApplications = await Application.findAll({
      where: {
        jobId: { [Op.in]: jobIds }
      },
      include: [
        {
          model: Job,
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent jobs posted
    const recentJobs = await Job.findAll({
      where: { companyId: company.id },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'title', 'status', 'createdAt']
    });

    // Get recent feedback
    const recentFeedback = await Feedback.findAll({
      where: { companyId: company.id },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'rating', 'createdAt']
    });

    // Format activity feed
    const activity = [];

    recentApplications.forEach(app => {
      activity.push({
        id: app.id,
        type: 'application',
        message: `New application for ${app.Job?.title || 'a position'}`,
        time: app.createdAt
      });
    });

    recentJobs.forEach(job => {
      if (job.status === 'active') {
        activity.push({
          id: job.id,
          type: 'job',
          message: `Job "${job.title}" published`,
          time: job.createdAt
        });
      }
    });

    recentFeedback.forEach(feedback => {
      activity.push({
        id: feedback.id,
        type: 'feedback',
        message: 'Feedback submitted for applicant',
        time: feedback.createdAt
      });
    });

    // Sort by time and limit
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivity = activity.slice(0, 10);

    res.json({
      success: true,
      data: limitedActivity
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
