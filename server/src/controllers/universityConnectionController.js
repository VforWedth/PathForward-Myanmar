const { Company, University, UniversityCompanyConnection, Student, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all available universities
 * @route   GET /api/company/universities
 * @access  Private (Company)
 */
exports.getAvailableUniversities = async (req, res) => {
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

    // Get all universities with their connection status
    const universities = await University.findAll({
      include: [
        {
          model: User,
          attributes: ['email', 'isVerified']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get existing connections for this company
    const connections = await UniversityCompanyConnection.findAll({
      where: { companyId: company.id }
    });

    const connectionMap = {};
    connections.forEach(conn => {
      connectionMap[conn.universityId] = conn.status;
    });

    // Add connection status to each university
    const universitiesWithStatus = universities.map(uni => {
      const uniData = uni.toJSON();
      return {
        ...uniData,
        connectionStatus: connectionMap[uni.id] || 'not_connected',
        isConnected: connectionMap[uni.id] === 'active'
      };
    });

    res.json({
      success: true,
      count: universitiesWithStatus.length,
      data: universitiesWithStatus
    });
  } catch (error) {
    console.error('Get available universities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Request connection with a university
 * @route   POST /api/company/universities/:id/connect
 * @access  Private (Company)
 */
exports.requestConnection = async (req, res) => {
  try {
    const { id: universityId } = req.params;
    const { message } = req.body;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if university exists
    const university = await University.findByPk(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Check if connection already exists
    const existingConnection = await UniversityCompanyConnection.findOne({
      where: {
        universityId,
        companyId: company.id
      }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: `Connection already exists with status: ${existingConnection.status}`,
        data: existingConnection
      });
    }

    // Create connection request
    const connection = await UniversityCompanyConnection.create({
      universityId,
      companyId: company.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error('Request connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get connected universities
 * @route   GET /api/company/universities/connected
 * @access  Private (Company)
 */
exports.getConnectedUniversities = async (req, res) => {
  try {
    const { status } = req.query;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Build where clause for connections
    const whereClause = {
      companyId: company.id
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Get connections with university details
    const connections = await UniversityCompanyConnection.findAll({
      where: whereClause,
      include: [
        {
          model: University,
          include: [
            {
              model: User,
              attributes: ['email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: connections.length,
      data: connections
    });
  } catch (error) {
    console.error('Get connected universities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Disconnect from a university
 * @route   DELETE /api/company/universities/:id/disconnect
 * @access  Private (Company)
 */
exports.disconnectUniversity = async (req, res) => {
  try {
    const { id: universityId } = req.params;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const connection = await UniversityCompanyConnection.findOne({
      where: {
        universityId,
        companyId: company.id
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    await connection.destroy();

    res.json({
      success: true,
      message: 'University disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect university error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get students from a connected university
 * @route   GET /api/company/universities/:id/students
 * @access  Private (Company)
 */
exports.getUniversityStudents = async (req, res) => {
  try {
    const { id: universityId } = req.params;
    const { major, year, search } = req.query;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Check if company is connected to this university
    const connection = await UniversityCompanyConnection.findOne({
      where: {
        universityId,
        companyId: company.id,
        status: 'active'
      }
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'Not connected to this university or connection not active'
      });
    }

    // Build where clause for students
    const whereClause = {
      universityId
    };

    if (major) {
      whereClause.major = major;
    }

    if (year) {
      whereClause.year = year;
    }

    // Get students
    let students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['email', 'phone', 'isVerified']
        },
        {
          model: University,
          attributes: ['id', 'universityName', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(student => {
        const name = student.fullName?.toLowerCase() || '';
        const email = student.User?.email?.toLowerCase() || '';
        const skills = student.skills?.join(' ').toLowerCase() || '';
        return name.includes(searchLower) ||
               email.includes(searchLower) ||
               skills.includes(searchLower);
      });
    }

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get university students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get connection statistics
 * @route   GET /api/company/universities/stats
 * @access  Private (Company)
 */
exports.getConnectionStats = async (req, res) => {
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

    const totalConnections = await UniversityCompanyConnection.count({
      where: { companyId: company.id }
    });

    const activeConnections = await UniversityCompanyConnection.count({
      where: {
        companyId: company.id,
        status: 'active'
      }
    });

    const pendingConnections = await UniversityCompanyConnection.count({
      where: {
        companyId: company.id,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      data: {
        total: totalConnections,
        active: activeConnections,
        pending: pendingConnections
      }
    });
  } catch (error) {
    console.error('Get connection stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
