const { Application, Job, Company, Student, Freelancer, User, University } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all applicants for company's jobs with filters
 * @route   GET /api/company/applicants
 * @access  Private (Company)
 */
exports.getApplicants = async (req, res) => {
  try {
    const { status, position, search, jobId, city, major, university } = req.query;

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
      where: { companyId: company.id },
      attributes: ['id', 'title']
    });

    const jobIds = jobs.map(job => job.id);

    // Build where clause for applications
    const whereClause = {
      jobId: { [Op.in]: jobIds }
    };

    // Filter by specific job if provided
    if (jobId) {
      whereClause.jobId = jobId;
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Get applications
    let applications = await Application.findAll({
      where: whereClause,
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'jobType']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Enrich with applicant details
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const appData = app.toJSON();
        let applicantDetails = null;

        if (app.applicantType === 'student') {
          const student = await Student.findByPk(app.applicantId, {
            include: [
              {
                model: User,
                attributes: ['email', 'phone']
              },
              {
                model: University,
                attributes: ['name']
              }
            ]
          });

          if (student) {
            applicantDetails = {
              id: student.id,
              name: student.fullName,
              email: student.User?.email,
              phone: student.User?.phone,
              university: student.University?.name,
              major: student.major,
              year: student.year,
              skills: student.skills || [],
              experience: `${student.year} year student`,
              education: `${student.major} at ${student.University?.name || 'University'}`
            };
          }
        } else if (app.applicantType === 'freelancer') {
          const freelancer = await Freelancer.findByPk(app.applicantId, {
            include: [
              {
                model: User,
                attributes: ['email', 'phone']
              }
            ]
          });

          if (freelancer) {
            applicantDetails = {
              id: freelancer.id,
              name: freelancer.fullName,
              email: freelancer.User?.email,
              phone: freelancer.User?.phone,
              skills: freelancer.skills || [],
              experience: freelancer.experience || 'Freelancer',
              education: freelancer.education || 'Not specified',
              portfolio: freelancer.portfolio
            };
          }
        }

        return {
          ...appData,
          applicant: applicantDetails,
          position: appData.Job?.title
        };
      })
    );

    // Apply advanced filters
    let filteredApplications = enrichedApplications;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app => {
        const name = app.applicant?.name?.toLowerCase() || '';
        const email = app.applicant?.email?.toLowerCase() || '';
        const skills = app.applicant?.skills?.join(' ').toLowerCase() || '';
        return name.includes(searchLower) ||
               email.includes(searchLower) ||
               skills.includes(searchLower);
      });
    }

    // Position filter
    if (position && position !== 'all') {
      filteredApplications = filteredApplications.filter(app =>
        app.Job?.title === position
      );
    }

    // City/Location filter
    if (city && city !== 'all') {
      filteredApplications = filteredApplications.filter(app =>
        app.applicant?.location?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Major filter (students only)
    if (major && major !== 'all') {
      filteredApplications = filteredApplications.filter(app =>
        app.applicant?.major?.toLowerCase().includes(major.toLowerCase())
      );
    }

    // University filter (students only)
    if (university && university !== 'all') {
      filteredApplications = filteredApplications.filter(app =>
        app.applicant?.university?.toLowerCase().includes(university.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: filteredApplications.length,
      data: filteredApplications
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single applicant details
 * @route   GET /api/company/applicants/:id
 * @access  Private (Company)
 */
exports.getApplicantById = async (req, res) => {
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

    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          where: { companyId: company.id }
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    let applicantDetails = null;

    if (application.applicantType === 'student') {
      const student = await Student.findByPk(application.applicantId, {
        include: [
          {
            model: User,
            attributes: ['email', 'phone']
          },
          {
            model: University,
            attributes: ['name']
          }
        ]
      });

      if (student) {
        applicantDetails = {
          id: student.id,
          name: student.fullName,
          email: student.User?.email,
          phone: student.User?.phone,
          university: student.University?.name,
          major: student.major,
          year: student.year,
          skills: student.skills || [],
          gpa: student.gpa,
          location: student.location,
          bio: student.bio
        };
      }
    } else if (application.applicantType === 'freelancer') {
      const freelancer = await Freelancer.findByPk(application.applicantId, {
        include: [
          {
            model: User,
            attributes: ['email', 'phone']
          }
        ]
      });

      if (freelancer) {
        applicantDetails = {
          id: freelancer.id,
          name: freelancer.fullName,
          email: freelancer.User?.email,
          phone: freelancer.User?.phone,
          skills: freelancer.skills || [],
          experience: freelancer.experience,
          education: freelancer.education,
          portfolio: freelancer.portfolio,
          bio: freelancer.bio,
          availability: freelancer.availability
        };
      }
    }

    res.json({
      success: true,
      data: {
        ...application.toJSON(),
        applicant: applicantDetails
      }
    });
  } catch (error) {
    console.error('Get applicant by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/company/applicants/:id/status
 * @access  Private (Company)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          where: { companyId: company.id }
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.update({ status });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get available positions for filtering
 * @route   GET /api/company/applicants/positions
 * @access  Private (Company)
 */
exports.getPositions = async (req, res) => {
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
      attributes: ['id', 'title'],
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
