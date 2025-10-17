const { Job, Company, Application, Freelancer, User } = require('../models');
const { Op } = require('sequelize');

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
