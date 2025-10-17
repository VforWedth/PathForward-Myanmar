const { Project, Freelancer, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new project
 * @route   POST /api/freelancer/projects
 * @access  Private (Freelancer)
 */
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      skillsRequired,
      partnersNeeded,
      projectType,
      timeline,
      fileUrl
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

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

    // Create project
    const project = await Project.create({
      freelancerId: freelancer.id,
      title,
      description,
      skillsRequired: skillsRequired || [],
      partnersNeeded: partnersNeeded || 1,
      projectType: projectType || 'web',
      timeline: timeline || null,
      fileUrl: fileUrl || null,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all projects for the logged-in freelancer
 * @route   GET /api/freelancer/projects
 * @access  Private (Freelancer)
 */
exports.getMyProjects = async (req, res) => {
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
      freelancerId: freelancer.id
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const projects = await Project.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/freelancer/projects/:id
 * @access  Private (Freelancer)
 */
exports.getProjectById = async (req, res) => {
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

    const project = await Project.findOne({
      where: {
        id: req.params.id,
        freelancerId: freelancer.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/freelancer/projects/:id
 * @access  Private (Freelancer)
 */
exports.updateProject = async (req, res) => {
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

    const project = await Project.findOne({
      where: {
        id: req.params.id,
        freelancerId: freelancer.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const {
      title,
      description,
      skillsRequired,
      partnersNeeded,
      projectType,
      timeline,
      status,
      fileUrl
    } = req.body;

    await project.update({
      title: title || project.title,
      description: description || project.description,
      skillsRequired: skillsRequired !== undefined ? skillsRequired : project.skillsRequired,
      partnersNeeded: partnersNeeded !== undefined ? partnersNeeded : project.partnersNeeded,
      projectType: projectType || project.projectType,
      timeline: timeline !== undefined ? timeline : project.timeline,
      status: status || project.status,
      fileUrl: fileUrl !== undefined ? fileUrl : project.fileUrl
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/freelancer/projects/:id
 * @access  Private (Freelancer)
 */
exports.deleteProject = async (req, res) => {
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

    const project = await Project.findOne({
      where: {
        id: req.params.id,
        freelancerId: freelancer.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all active freelancer projects (for companies to browse)
 * @route   GET /api/company/freelancer-projects
 * @access  Private (Company)
 */
exports.getAllActiveFreelancerProjects = async (req, res) => {
  try {
    const { projectType, search } = req.query;

    // Build filter - only active projects
    const where = {
      status: 'active'
    };

    if (projectType && projectType !== 'all') {
      where.projectType = projectType;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: Freelancer,
          attributes: ['id', 'firstName', 'lastName', 'skills', 'bio', 'portfolioUrl'],
          include: [
            {
              model: User,
              attributes: ['email', 'phone']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['freelancerId', 'fileUrl'] // Don't expose internal IDs and files in list view
      }
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Get all active freelancer projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single freelancer project by ID (for companies to view details)
 * @route   GET /api/company/freelancer-projects/:id
 * @access  Private (Company)
 */
exports.getFreelancerProjectDetailsForCompany = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        status: 'active' // Only active projects can be viewed
      },
      include: [
        {
          model: Freelancer,
          attributes: ['id', 'firstName', 'lastName', 'skills', 'bio', 'portfolioUrl', 'availability', 'hourlyRate'],
          include: [
            {
              model: User,
              attributes: ['email', 'phone']
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or no longer available'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get freelancer project details for company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
