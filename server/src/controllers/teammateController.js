const { Student, Freelancer, User, University } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all potential teammates (students and freelancers)
 * @route   GET /api/freelancer/teammates
 * @access  Private (Freelancer)
 */
exports.getAllTeammates = async (req, res) => {
  try {
    const { search, skills, type, university, major } = req.query;

    // Get current freelancer to exclude from results
    const currentFreelancer = await Freelancer.findOne({
      where: { userId: req.user.id }
    });

    // Build filters for students
    const studentWhere = {};

    if (search) {
      studentWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { major: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (skills) {
      studentWhere.skills = { [Op.overlap]: [skills] };
    }

    if (major) {
      studentWhere.major = { [Op.iLike]: `%${major}%` };
    }

    if (university) {
      studentWhere.universityId = university;
    }

    // Build filters for freelancers
    const freelancerWhere = {};

    if (currentFreelancer) {
      freelancerWhere.id = { [Op.ne]: currentFreelancer.id }; // Exclude current user
    }

    if (search) {
      freelancerWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (skills) {
      freelancerWhere.skills = { [Op.overlap]: [skills] };
    }

    let teammates = [];

    // Fetch students if type is 'all' or 'student'
    if (!type || type === 'all' || type === 'student') {
      const students = await Student.findAll({
        where: studentWhere,
        include: [
          {
            model: User,
            attributes: ['email']
          },
          {
            model: University,
            attributes: ['universityName', 'location']
          }
        ],
        limit: 50
      });

      teammates = teammates.concat(
        students.map(student => ({
          id: student.id,
          type: 'student',
          name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
          email: student.User?.email,
          skills: student.skills || [],
          major: student.major,
          year: student.year,
          university: student.University?.universityName,
          universityLocation: student.University?.location,
          bio: student.bio,
          location: student.location,
          gpa: student.gpa,
          profilePicture: student.profilePicture
        }))
      );
    }

    // Fetch freelancers if type is 'all' or 'freelancer'
    if (!type || type === 'all' || type === 'freelancer') {
      const freelancers = await Freelancer.findAll({
        where: freelancerWhere,
        include: [
          {
            model: User,
            attributes: ['email']
          }
        ],
        limit: 50
      });

      teammates = teammates.concat(
        freelancers.map(freelancer => ({
          id: freelancer.id,
          type: 'freelancer',
          name: `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim(),
          email: freelancer.User?.email,
          skills: freelancer.skills || [],
          bio: freelancer.bio,
          location: freelancer.location,
          portfolioUrl: freelancer.portfolioUrl,
          availability: freelancer.availability,
          hourlyRate: freelancer.hourlyRate,
          profilePicture: freelancer.profilePicture
        }))
      );
    }

    res.json({
      success: true,
      count: teammates.length,
      data: teammates
    });
  } catch (error) {
    console.error('Get teammates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get teammate details by ID and type
 * @route   GET /api/freelancer/teammates/:type/:id
 * @access  Private (Freelancer)
 */
exports.getTeammateById = async (req, res) => {
  try {
    const { type, id } = req.params;

    let teammate = null;

    if (type === 'student') {
      const student = await Student.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['email', 'phone']
          },
          {
            model: University,
            attributes: ['universityName', 'location']
          }
        ]
      });

      if (student) {
        teammate = {
          id: student.id,
          type: 'student',
          name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
          email: student.User?.email,
          phone: student.User?.phone,
          skills: student.skills || [],
          major: student.major,
          year: student.year,
          university: student.University?.universityName,
          universityLocation: student.University?.location,
          bio: student.bio,
          location: student.location,
          gpa: student.gpa,
          profilePicture: student.profilePicture,
          github: student.github,
          linkedin: student.linkedin,
          portfolio: student.portfolio
        };
      }
    } else if (type === 'freelancer') {
      const freelancer = await Freelancer.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['email', 'phone']
          }
        ]
      });

      if (freelancer) {
        teammate = {
          id: freelancer.id,
          type: 'freelancer',
          name: `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim(),
          email: freelancer.User?.email,
          phone: freelancer.User?.phone,
          skills: freelancer.skills || [],
          bio: freelancer.bio,
          location: freelancer.location,
          portfolioUrl: freelancer.portfolioUrl,
          availability: freelancer.availability,
          hourlyRate: freelancer.hourlyRate,
          profilePicture: freelancer.profilePicture
        };
      }
    }

    if (!teammate) {
      return res.status(404).json({
        success: false,
        message: 'Teammate not found'
      });
    }

    res.json({
      success: true,
      data: teammate
    });
  } catch (error) {
    console.error('Get teammate by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
