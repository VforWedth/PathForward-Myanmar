const { CompanyProject, Company, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new company project
 * @route   POST /api/company/projects
 * @access  Private (Company)
 */
exports.createCompanyProject = async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      contactPerson,
      contactRole,
      title,
      description,
      objective,
      deliverables,
      category,
      techStack,
      integrationRequirements,
      referenceLinks,
      designGuidelines,
      startDate,
      deadline,
      milestones,
      budgetType,
      budgetMin,
      budgetMax,
      paymentMethod,
      bonusRewards,
      experienceLevel,
      skillsRequired,
      preferredLocation,
      portfolioRequired,
      communicationExpectation,
      ndaRequired,
      ownershipTerms,
      attachments
    } = req.body;

    // Validate required fields
    if (!title || !description || !objective || !deliverables || !category || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, objective, deliverables, category, deadline)'
      });
    }

    if (!skillsRequired || skillsRequired.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill'
      });
    }

    // Get company profile
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Create company project
    const project = await CompanyProject.create({
      companyId: company.id,
      companyName: companyName || company.companyName,
      companyType: companyType || null,
      contactPerson: contactPerson || req.user.name,
      contactRole: contactRole || null,
      title,
      description,
      objective,
      deliverables,
      category,
      techStack: techStack || [],
      integrationRequirements: integrationRequirements || null,
      referenceLinks: referenceLinks || null,
      designGuidelines: designGuidelines || null,
      startDate: startDate || null,
      deadline,
      milestones: milestones || null,
      budgetType: budgetType || 'fixed',
      budgetMin: budgetMin || null,
      budgetMax: budgetMax || null,
      paymentMethod: paymentMethod || null,
      bonusRewards: bonusRewards || null,
      experienceLevel: experienceLevel || 'intermediate',
      skillsRequired,
      preferredLocation: preferredLocation || null,
      portfolioRequired: portfolioRequired || false,
      communicationExpectation: communicationExpectation || null,
      ndaRequired: ndaRequired || false,
      ownershipTerms: ownershipTerms || null,
      attachments: attachments || [],
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Project posted successfully',
      data: project
    });
  } catch (error) {
    console.error('Create company project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all projects for the logged-in company
 * @route   GET /api/company/projects
 * @access  Private (Company)
 */
exports.getCompanyProjects = async (req, res) => {
  try {
    const { status } = req.query;

    // Get company profile
    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Build filter
    const where = {
      companyId: company.id
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const projects = await CompanyProject.findAll({
      where,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['companyId'] // Don't expose internal IDs
      }
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get company projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single company project by ID
 * @route   GET /api/company/projects/:id
 * @access  Private (Company)
 */
exports.getCompanyProjectById = async (req, res) => {
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

    const project = await CompanyProject.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
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
    console.error('Get company project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update a company project
 * @route   PUT /api/company/projects/:id
 * @access  Private (Company)
 */
exports.updateCompanyProject = async (req, res) => {
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

    const project = await CompanyProject.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update project with provided fields
    const updateData = {};
    const allowedFields = [
      'companyName', 'companyType', 'contactPerson', 'contactRole',
      'title', 'description', 'objective', 'deliverables', 'category',
      'techStack', 'integrationRequirements', 'referenceLinks', 'designGuidelines',
      'startDate', 'deadline', 'milestones',
      'budgetType', 'budgetMin', 'budgetMax', 'paymentMethod', 'bonusRewards',
      'experienceLevel', 'skillsRequired', 'preferredLocation', 'portfolioRequired',
      'communicationExpectation', 'ndaRequired', 'ownershipTerms', 'status', 'attachments'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await project.update(updateData);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update company project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a company project
 * @route   DELETE /api/company/projects/:id
 * @access  Private (Company)
 */
exports.deleteCompanyProject = async (req, res) => {
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

    const project = await CompanyProject.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
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
    console.error('Delete company project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Close a company project
 * @route   PUT /api/company/projects/:id/close
 * @access  Private (Company)
 */
exports.closeCompanyProject = async (req, res) => {
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

    const project = await CompanyProject.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.update({ status: 'closed' });

    res.json({
      success: true,
      message: 'Project closed successfully',
      data: project
    });
  } catch (error) {
    console.error('Close company project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all active company projects (for freelancers to browse)
 * @route   GET /api/freelancer/company-projects
 * @access  Private (Freelancer)
 */
exports.getAllActiveProjects = async (req, res) => {
  try {
    const { category, experienceLevel, search, budgetType } = req.query;

    // Build filter - only active projects
    const where = {
      status: 'active'
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (experienceLevel && experienceLevel !== 'all') {
      where.experienceLevel = experienceLevel;
    }

    if (budgetType && budgetType !== 'all') {
      where.budgetType = budgetType;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const projects = await CompanyProject.findAll({
      where,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo']
        }
      ],
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['companyId', 'attachments'] // Don't expose internal IDs and attachments in list view
      }
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Get all active projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single company project by ID (for freelancers to view details)
 * @route   GET /api/freelancer/company-projects/:id
 * @access  Private (Freelancer)
 */
exports.getProjectDetailsForFreelancer = async (req, res) => {
  try {
    const project = await CompanyProject.findOne({
      where: {
        id: req.params.id,
        status: 'active' // Only active projects can be viewed
      },
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo', 'description', 'website']
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
    console.error('Get project details for freelancer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
