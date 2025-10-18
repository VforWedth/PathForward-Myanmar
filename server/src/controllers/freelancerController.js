const { Job, Company, Application, Freelancer, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all public job postings for freelancers
 * @route   GET /api/freelancer/jobs
 * @access  Private (Freelancer)
 */
exports.getPublicJobs = async (req, res) => {
  try {
    const { search, jobType, workMode, experienceLevel, location, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

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

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
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
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

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

    const { count, rows: applications } = await Application.findAndCountAll({
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
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
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

/**
 * @desc    Get personalized job recommendations for freelancer
 * @route   GET /api/freelancer/recommendations
 * @access  Private (Freelancer)
 */
exports.getRecommendedJobs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

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

    // Get freelancer's skills and preferences
    const freelancerSkills = freelancer.skills || [];
    const freelancerExperience = freelancer.experienceLevel || 'entry';

    // Get jobs the freelancer has already applied to
    const appliedJobIds = await Application.findAll({
      where: {
        applicantId: freelancer.id,
        applicantType: 'freelancer'
      },
      attributes: ['jobId']
    }).then(apps => apps.map(app => app.jobId));

    // Build recommendation query
    const where = {
      isPublic: true,
      status: 'active',
      id: { [Op.notIn]: appliedJobIds.length > 0 ? appliedJobIds : [0] }
    };

    // Add deadline filter - only show jobs that haven't expired
    where.deadline = {
      [Op.or]: [
        { [Op.gte]: new Date() },
        { [Op.is]: null }
      ]
    };

    // Find jobs that match freelancer's profile
    const allJobs = await Job.findAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50 // Get more jobs to score
    });

    // Score each job based on relevance
    const scoredJobs = allJobs.map(job => {
      let score = 0;
      const jobData = job.toJSON();

      // Skill matching (highest weight)
      if (freelancerSkills.length > 0 && jobData.skillsRequired) {
        const matchingSkills = freelancerSkills.filter(skill =>
          jobData.skillsRequired.some(reqSkill =>
            reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(reqSkill.toLowerCase())
          )
        );
        score += matchingSkills.length * 10;
      }

      // Experience level match
      if (jobData.experienceLevel === freelancerExperience) {
        score += 5;
      }

      // Job type preferences (freelance/contract jobs get higher score)
      if (jobData.jobType === 'freelance' || jobData.jobType === 'contract') {
        score += 3;
      }

      // Remote work preference
      if (jobData.workMode === 'remote') {
        score += 2;
      }

      // Recency bonus (newer jobs are slightly preferred)
      const daysOld = Math.floor((new Date() - new Date(jobData.createdAt)) / (1000 * 60 * 60 * 24));
      if (daysOld < 7) {
        score += 2;
      }

      return { ...jobData, recommendationScore: score };
    });

    // Sort by score and get top recommendations
    const recommendations = scoredJobs
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
