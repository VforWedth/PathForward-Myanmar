const { User, Student, Company, University, Freelancer } = require('../models');
const { generateToken } = require('../utils/jwt');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, phone, role, ...profileData } = req.body;

    console.log('Registration request received:', { email, role, profileData });

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate required fields based on role
    if (role === 'university' && !profileData.universityName) {
      return res.status(400).json({
        success: false,
        message: 'University name is required'
      });
    }

    if (role === 'company' && !profileData.companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    if (role === 'student' && (!profileData.firstName || !profileData.lastName)) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      phone: phone || null,
      role
    });

    console.log('User created:', user.id);

    // Create role-specific profile
    let profile;
    switch (role) {
      case 'student':
        profile = await Student.create({
          userId: user.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          major: profileData.major,
          year: profileData.year,
          location: profileData.location,
          universityId: null, // Will be assigned by university admin later
          jobPreference: profileData.jobPreference || 'onsite',
          portfolioUrl: profileData.portfolioUrl,
          bio: profileData.bio,
          skills: profileData.skills || [],
          status: 'available',
          verificationStatus: 'pending'
        });
        break;

      case 'company':
        profile = await Company.create({
          userId: user.id,
          companyName: profileData.companyName,
          industry: profileData.industry,
          location: profileData.location || profileData.address,
          description: profileData.description,
          website: profileData.website,
          companySize: profileData.companySize || profileData.size,
          verificationStatus: 'pending'
        });
        break;

      case 'university':
        profile = await University.create({
          userId: user.id,
          universityName: profileData.universityName,
          location: profileData.location || profileData.address,
          description: profileData.description,
          website: profileData.website,
          supportedMajors: profileData.supportedMajors || [],
          verificationStatus: 'pending'
        });
        break;

      case 'freelancer':
        profile = await Freelancer.create({
          userId: user.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          skills: profileData.skills || [],
          location: profileData.location,
          portfolioUrl: profileData.portfolioUrl,
          bio: profileData.bio,
          hourlyRate: profileData.hourlyRate,
          availability: profileData.availability || 'available',
          verificationStatus: 'pending'
        });
        break;
    }

    console.log(`${role} profile created:`, profile.id);

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registration successful. Account pending verification.`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0], // Use name or fallback to email prefix
        role: user.role,
        isVerified: user.isVerified
      },
      profile: {
        id: profile.id,
        name: profile.companyName || profile.universityName || `${profile.firstName} ${profile.lastName}`
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A record with this information already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0], // Use name or fallback to email prefix
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get role-specific profile
    let profile;
    switch (user.role) {
      case 'student':
        profile = await Student.findOne({ where: { userId: user.id } });
        break;
      case 'company':
        profile = await Company.findOne({ where: { userId: user.id } });
        break;
      case 'university':
        profile = await University.findOne({ where: { userId: user.id } });
        break;
      case 'freelancer':
        profile = await Freelancer.findOne({ where: { userId: user.id } });
        break;
    }

    res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Logout user (optional - mainly for logging purposes)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // For JWT-based auth, logout is mainly client-side
    // This endpoint can be used for logging logout events
    console.log(`User ${req.user.id} (${req.user.email}) logged out`);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};