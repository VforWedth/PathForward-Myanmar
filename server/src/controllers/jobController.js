const { Job, Company, Application, Student, Freelancer, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new job posting
 * @route   POST /api/company/jobs
 * @access  Private (Company)
 */
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      type,
      salary,
      category,
      applicationDeadline,
      workMode,
      skillsRequired,
      majorsPreferred,
      experienceLevel,
      numberOfPositions,
      targetUniversities,
      isPublic
    } = req.body;

    // Validate required fields
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and location'
      });
    }

    // Get company
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if company is verified (skip in development)
    const requireVerification = process.env.REQUIRE_COMPANY_VERIFICATION === 'true';
    if (requireVerification && company.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Company must be verified before posting jobs'
      });
    }

    // Validate target universities if provided
    if (targetUniversities && targetUniversities.length > 0) {
      // Check if company is connected to these universities
      const { UniversityCompanyConnection } = require('../models');
      const connections = await UniversityCompanyConnection.findAll({
        where: {
          companyId: company.id,
          universityId: targetUniversities,
          status: 'active'
        }
      });
      
      if (connections.length !== targetUniversities.length) {
        return res.status(400).json({
          success: false,
          message: 'You can only post jobs to universities you are connected with'
        });
      }
    }

    // Create job
    const job = await Job.create({
      companyId: company.id,
      title,
      description,
      requirements,
      location,
      jobType: type || 'full-time',
      salaryRange: salary,
      workMode: workMode || 'onsite',
      skillsRequired: skillsRequired || [],
      majorsPreferred: majorsPreferred || [],
      experienceLevel: experienceLevel || 'entry',
      numberOfPositions: numberOfPositions || 1,
      deadline: applicationDeadline ? new Date(applicationDeadline) : null,
      targetUniversities: targetUniversities || [],
      isPublic: isPublic !== false, // Default to true unless explicitly set to false
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all jobs for a company
 * @route   GET /api/company/jobs
 * @access  Private (Company)
 */
exports.getCompanyJobs = async (req, res) => {
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
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Application,
          attributes: ['id'],
          separate: true
        }
      ]
    });

    // Add application count to each job
    const jobsWithCount = jobs.map(job => {
      const jobData = job.toJSON();
      jobData.applicationCount = job.Applications?.length || 0;
      delete jobData.Applications;
      return jobData;
    });

    res.json({
      success: true,
      data: jobsWithCount
    });
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/company/jobs/:id
 * @access  Private (Company)
 */
exports.getJobById = async (req, res) => {
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

    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      },
      include: [
        {
          model: Application,
          attributes: ['id', 'status'],
          separate: true
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const jobData = job.toJSON();
    jobData.applicationCount = job.Applications?.length || 0;
    delete jobData.Applications;

    res.json({
      success: true,
      data: jobData
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
 * @desc    Update a job
 * @route   PUT /api/company/jobs/:id
 * @access  Private (Company)
 */
exports.updateJob = async (req, res) => {
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

    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      type,
      salary,
      applicationDeadline,
      workMode,
      skillsRequired,
      majorsPreferred,
      experienceLevel,
      numberOfPositions,
      status
    } = req.body;

    await job.update({
      title: title || job.title,
      description: description || job.description,
      requirements: requirements || job.requirements,
      location: location || job.location,
      jobType: type || job.jobType,
      salaryRange: salary || job.salaryRange,
      workMode: workMode || job.workMode,
      skillsRequired: skillsRequired || job.skillsRequired,
      majorsPreferred: majorsPreferred || job.majorsPreferred,
      experienceLevel: experienceLevel || job.experienceLevel,
      numberOfPositions: numberOfPositions || job.numberOfPositions,
      deadline: applicationDeadline ? new Date(applicationDeadline) : job.deadline,
      status: status || job.status
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/company/jobs/:id
 * @access  Private (Company)
 */
exports.deleteJob = async (req, res) => {
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

    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await job.destroy();

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

/**
 * @desc    Close a job (change status to closed)
 * @route   PUT /api/company/jobs/:id/close
 * @access  Private (Company)
 */
exports.closeJob = async (req, res) => {
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

    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await job.update({ status: 'closed' });

    res.json({
      success: true,
      message: 'Job closed successfully',
      data: job
    });
  } catch (error) {
    console.error('Close job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
