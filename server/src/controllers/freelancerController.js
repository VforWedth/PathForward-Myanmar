const { Job, Company, Application, Freelancer, User, Project } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @desc    Get freelancer dashboard statistics
 * @route   GET /api/freelancer/dashboard/stats
 * @access  Private (Freelancer)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get freelancer profile
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    // Get projects count
    const projectsCount = await Project.count({
      where: { freelancerId: freelancer.id }
    });

    const activeProjectsCount = await Project.count({
      where: {
        freelancerId: freelancer.id,
        status: { [Op.in]: ['active', 'in-progress'] }
      }
    });

    // Get applications statistics
    const applicationsCount = await Application.count({
      where: {
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      }
    });

    const pendingApplicationsCount = await Application.count({
      where: {
        applicantId: freelancer.id,
        applicantType: 'freelancer',
        status: 'pending'
      }
    });

    const acceptedApplicationsCount = await Application.count({
      where: {
        applicantId: freelancer.id,
        applicantType: 'freelancer',
        status: 'accepted'
      }
    });

    // Calculate profile completion percentage
    const profileFields = [
      freelancer.firstName,
      freelancer.lastName,
      freelancer.bio,
      freelancer.skills && freelancer.skills.length > 0,
      freelancer.portfolio,
      freelancer.hourlyRate,
      freelancer.availability
    ];
    const completedFields = profileFields.filter(field => field).length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    res.json({
      success: true,
      data: {
        activeProjects: activeProjectsCount,
        totalProjects: projectsCount,
        totalApplications: applicationsCount,
        pendingApplications: pendingApplicationsCount,
        acceptedApplications: acceptedApplicationsCount,
        profileCompletion,
        availability: freelancer.availability || 'available'
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
 * @desc    Get freelancer recent activities
 * @route   GET /api/freelancer/dashboard/recent-activities
 * @access  Private (Freelancer)
 */
exports.getRecentActivities = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    // Get recent applications
    const recentApplications = await Application.findAll({
      where: {
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      },
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'jobType'],
          include: [
            {
              model: Company,
              attributes: ['companyName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent projects
    const recentProjects = await Project.findAll({
      where: { freelancerId: freelancer.id },
      attributes: ['id', 'title', 'status', 'projectType', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    // Format activities
    const activities = [];

    recentApplications.forEach(app => {
      activities.push({
        id: app.id,
        type: 'application',
        title: `Applied to ${app.Job?.title || 'a job'}`,
        description: `at ${app.Job?.Company?.companyName || 'a company'}`,
        status: app.status,
        date: app.createdAt
      });
    });

    recentProjects.forEach(project => {
      activities.push({
        id: project.id,
        type: 'project',
        title: project.title,
        description: `${project.status} - ${project.projectType}`,
        status: project.status,
        date: project.updatedAt
      });
    });

    // Sort by date and limit to 10 most recent
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivities = activities.slice(0, 10);

    res.json({
      success: true,
      data: recentActivities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all public job postings for freelancers
 * @route   GET /api/freelancer/jobs
 * @access  Private (Freelancer)
 */
exports.getPublicJobs = async (req, res) => {
  try {
    const { search, jobType, workMode, experienceLevel, location } = req.query;

    // Build filter criteria
    const where = {
      isPublic: true,
      status: 'active'
    };

    // Add deadline filter - only show jobs that haven't expired
    where.deadline = {
      [Op.or]: [
        { [Op.gte]: new Date() },
        { [Op.is]: null }
      ]
    };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { skillsRequired: { [Op.overlap]: [search] } }
      ];
    }

    // Job type filter
    if (jobType && jobType !== 'all') {
      where.jobType = jobType;
    }

    // Work mode filter
    if (workMode && workMode !== 'all') {
      where.workMode = workMode;
    }

    // Experience level filter
    if (experienceLevel && experienceLevel !== 'all') {
      where.experienceLevel = experienceLevel;
    }

    // Location filter
    if (location && location !== 'all') {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    const jobs = await Job.findAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/freelancer/jobs/:id
 * @access  Private (Freelancer)
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        isPublic: true,
        status: 'active'
      },
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo', 'description', 'website']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not available'
      });
    }

    // Check if freelancer has already applied
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (freelancer) {
      const existingApplication = await Application.findOne({
        where: {
          jobId: job.id,
          applicantId: freelancer.id,
          applicantType: 'freelancer'
        }
      });

      const jobData = job.toJSON();
      jobData.hasApplied = !!existingApplication;
      jobData.application = existingApplication ? existingApplication.toJSON() : null;

      return res.json({
        success: true,
        data: jobData
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

/**
 * @desc    Apply for a job
 * @route   POST /api/freelancer/jobs/:id/apply
 * @access  Private (Freelancer)
 */
exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;

    // Get freelancer profile
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    // Check if job exists and is available
    const job = await Job.findOne({
      where: {
        id: jobId,
        isPublic: true,
        status: 'active'
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not available'
      });
    }

    // Check if deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId,
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: freelancer.id,
      applicantType: 'freelancer',
      coverLetter: coverLetter || null,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get freelancer's applications
 * @route   GET /api/freelancer/applications
 * @access  Private (Freelancer)
 */
exports.getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;

    // Get freelancer profile
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    // Build filter
    const where = {
      applicantId: freelancer.id,
      applicantType: 'freelancer'
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const applications = await Application.findAll({
      where,
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'jobType', 'workMode', 'location', 'salaryRange', 'deadline'],
          include: [
            {
              model: Company,
              attributes: ['id', 'companyName', 'industry', 'location', 'logo']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single application by ID
 * @route   GET /api/freelancer/applications/:id
 * @access  Private (Freelancer)
 */
exports.getApplicationById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    const application = await Application.findOne({
      where: {
        id: req.params.id,
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      },
      include: [
        {
          model: Job,
          include: [
            {
              model: Company,
              attributes: ['id', 'companyName', 'industry', 'location', 'logo', 'description', 'website']
            }
          ]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Withdraw an application
 * @route   DELETE /api/freelancer/applications/:id
 * @access  Private (Freelancer)
 */
exports.withdrawApplication = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found'
      });
    }

    const application = await Application.findOne({
      where: {
        id: req.params.id,
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only allow withdrawal of pending applications
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending applications'
      });
    }

    await application.destroy();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
