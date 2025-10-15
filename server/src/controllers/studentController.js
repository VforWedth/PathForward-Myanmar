const { Student, User, University, Education, Experience, Certificate } = require('../models');

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Application, Activity, QuizAttempt, Quiz } = require('../models');
    const { Op } = require('sequelize');

    // Get application stats
    const totalApplications = await Application.count({
      where: { studentId: student.id }
    });

    const interviewsCount = await Application.count({
      where: {
        studentId: student.id,
        status: 'interview'
      }
    });

    const offersCount = await Application.count({
      where: {
        studentId: student.id,
        status: 'offer'
      }
    });

    // Get quiz/certificate stats
    const totalQuizzesTaken = await QuizAttempt.count({
      where: { studentId: student.id }
    });

    const certificatesEarned = await QuizAttempt.count({
      where: {
        studentId: student.id,
        certificateIssued: true
      }
    });

    // Get recent certificates
    const recentCertificates = await QuizAttempt.findAll({
      where: {
        studentId: student.id,
        certificateIssued: true
      },
      include: [{
        model: Quiz,
        attributes: ['id', 'title', 'category', 'difficulty']
      }],
      limit: 3,
      order: [['completedAt', 'DESC']]
    });

    // Get recent activity (last 10 items)
    const recentActivity = await Activity.findAll({
      where: { studentId: student.id },
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    // Get unread notifications count
    const { Notification } = require('../models');
    const unreadNotifications = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          applications: totalApplications,
          interviews: interviewsCount,
          offers: offersCount,
          quizzesTaken: totalQuizzesTaken,
          certificates: certificatesEarned
        },
        recentActivity,
        recentCertificates,
        alertsCount: unreadNotifications
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student recent activity
// @route   GET /api/student/activity
// @access  Private (Student)
const getActivity = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Activity, Company, Job } = require('../models');
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const activities = await Activity.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: false
        },
        {
          model: Job,
          attributes: ['id', 'title'],
          required: false
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalCount = await Activity.count({
      where: { studentId: student.id }
    });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student notifications
// @route   GET /api/student/notifications
// @access  Private (Student)
const getNotifications = async (req, res) => {
  try {
    const { Notification } = require('../models');
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalCount = await Notification.count({
      where: { userId: req.user.id }
    });

    const unreadCount = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/student/notifications/:id/read
// @access  Private (Student)
const markNotificationRead = async (req, res) => {
  try {
    const { Notification } = require('../models');

    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/student/notifications/read-all
// @access  Private (Student)
const markAllNotificationsRead = async (req, res) => {
  try {
    const { Notification } = require('../models');

    await Notification.update(
      { isRead: true },
      {
        where: {
          userId: req.user.id,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ['email', 'phone', 'isVerified', 'createdAt']
        },
        {
          model: University,
          attributes: ['id', 'universityName', 'location']
        },
        {
          model: Education,
          attributes: ['id', 'institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'isCurrent', 'grade']
        },
        {
          model: Experience,
          attributes: ['id', 'company', 'position', 'description', 'startDate', 'endDate', 'isCurrent']
        },
        {
          model: Certificate,
          attributes: ['id', 'title', 'issuingOrganization', 'issueDate', 'expiryDate', 'credentialId', 'credentialUrl']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      major,
      year,
      location,
      jobPreference,
      portfolioUrl,
      bio,
      skills,
      universityId
    } = req.body;

    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    await student.update({
      firstName,
      lastName,
      major,
      year,
      location,
      jobPreference,
      portfolioUrl,
      bio,
      skills,
      universityId
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload CV
// @route   POST /api/student/upload-cv
// @access  Private (Student)
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const cvUrl = `/uploads/cv/${req.file.filename}`;
    await student.update({ cvUrl });

    // Log activity
    const { Activity } = require('../models');
    await Activity.create({
      studentId: student.id,
      type: 'cv_upload',
      title: 'Uploaded CV',
      description: 'Your CV is now visible to recruiters.'
    });

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      cvUrl
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/student/upload-picture
// @access  Private (Student)
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const profilePicture = `/uploads/profile/${req.file.filename}`;
    await student.update({ profilePicture });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update student status
// @route   PUT /api/student/status
// @access  Private (Student)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'on_job', 'internship_completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    await student.update({ status });

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: { status: student.status }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Education Management

// @desc    Add education
// @route   POST /api/student/education
// @access  Private (Student)
const addEducation = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const education = await Education.create({
      studentId: student.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: education
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update education
// @route   PUT /api/student/education/:id
// @access  Private (Student)
const updateEducation = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const education = await Education.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    await education.update(req.body);

    res.json({
      success: true,
      message: 'Education updated successfully',
      data: education
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/student/education/:id
// @access  Private (Student)
const deleteEducation = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const education = await Education.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    await education.destroy();

    res.json({
      success: true,
      message: 'Education deleted successfully'
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Experience Management

// @desc    Add experience
// @route   POST /api/student/experience
// @access  Private (Student)
const addExperience = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const experience = await Experience.create({
      studentId: student.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: experience
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update experience
// @route   PUT /api/student/experience/:id
// @access  Private (Student)
const updateExperience = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const experience = await Experience.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    await experience.update(req.body);

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/student/experience/:id
// @access  Private (Student)
const deleteExperience = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const experience = await Experience.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    await experience.destroy();

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Certificate Management

// @desc    Add certificate
// @route   POST /api/student/certificate
// @access  Private (Student)
const addCertificate = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const certificate = await Certificate.create({
      studentId: student.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Certificate added successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Add certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update certificate
// @route   PUT /api/student/certificate/:id
// @access  Private (Student)
const updateCertificate = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const certificate = await Certificate.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await certificate.update(req.body);

    res.json({
      success: true,
      message: 'Certificate updated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/student/certificate/:id
// @access  Private (Student)
const deleteCertificate = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const certificate = await Certificate.findOne({
      where: { id: req.params.id, studentId: student.id }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await certificate.destroy();

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Feedback & Reviews

// @desc    Get my feedback from companies
// @route   GET /api/student/feedback
// @access  Private (Student)
const getMyFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Feedback, Company, Job } = require('../models');

    const feedbacks = await Feedback.findAll({
      where: {
        applicantId: student.id,
        applicantType: 'student'
      },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: Job,
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit anonymous review
// @route   POST /api/student/reviews
// @access  Private (Student)
const submitReview = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { companyId, rating, comment, jobId } = req.body;

    if (!companyId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Company ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const { Review } = require('../models');

    const review = await Review.create({
      companyId,
      reviewerId: student.id,
      reviewerType: 'student',
      rating,
      comment,
      jobId,
      isAnonymous: true
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my reviews
// @route   GET /api/student/reviews
// @access  Private (Student)
const getMyReviews = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Review, Company, Job } = require('../models');

    const reviews = await Review.findAll({
      where: {
        reviewerId: student.id,
        reviewerType: 'student'
      },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo']
        },
        {
          model: Job,
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student certificates
// @route   GET /api/student/certificates
// @access  Private (Student)
const getCertificates = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { QuizAttempt, Quiz } = require('../models');

    const certificates = await QuizAttempt.findAll({
      where: {
        studentId: student.id,
        certificateIssued: true
      },
      include: [{
        model: Quiz,
        attributes: ['id', 'title', 'category', 'difficulty', 'passingScore']
      }],
      order: [['completedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Find peer students for collaboration
// @route   GET /api/student/peers
// @access  Private (Student)
const findPeers = async (req, res) => {
  try {
    const currentStudent = await Student.findOne({ where: { userId: req.user.id } });

    if (!currentStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Op } = require('sequelize');
    const {
      search,
      email,
      skills,
      availability,
      minRating,
      location,
      limit = 20,
      offset = 0
    } = req.query;

    // Build where clause for filtering
    let whereClause = {
      id: { [Op.ne]: currentStudent.id } // Exclude current student
      // Removed verificationStatus filter to show all students
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { bio: { [Op.iLike]: `%${search}%` } },
        { major: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Email filter
    if (email) {
      // Add email search to the User model include
      whereClause['$User.email$'] = { [Op.iLike]: `%${email}%` };
    }

    // Skills filter
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills = { [Op.overlap]: skillArray };
    }

    // Availability filter
    if (availability) {
      const availabilityArray = Array.isArray(availability) ? availability : [availability];
      whereClause.status = { [Op.in]: availabilityArray };
    }

    // Location filter
    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    // Find peers with pagination
    const peers = await Student.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['email', 'isVerified', 'createdAt']
        },
        {
          model: University,
          attributes: ['id', 'universityName', 'location']
        },
        {
          model: Education,
          attributes: ['id', 'institution', 'degree', 'fieldOfStudy'],
          limit: 1,
          order: [['endDate', 'DESC']]
        },
        {
          model: Experience,
          attributes: ['id', 'company', 'position', 'description'],
          limit: 1,
          order: [['endDate', 'DESC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Calculate rating for each peer (mock for now - you can implement real rating system)
    const peersWithRating = peers.rows.map(peer => {
      // Mock rating calculation based on profile completeness and verification
      let rating = 3.0; // Base rating
      
      if (peer.User.isVerified) rating += 0.5;
      if (peer.skills && peer.skills.length > 0) rating += 0.3;
      if (peer.bio) rating += 0.2;
      if (peer.portfolioUrl) rating += 0.2;
      if (peer.cvUrl) rating += 0.2;
      if (peer.Educations && peer.Educations.length > 0) rating += 0.3;
      if (peer.Experiences && peer.Experiences.length > 0) rating += 0.3;
      
      // Cap at 5.0
      rating = Math.min(rating, 5.0);

      return {
        ...peer.toJSON(),
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal
        projectsCompleted: peer.Experiences ? peer.Experiences.length : 0,
        name: `${peer.firstName} ${peer.lastName}`,
        avatar: peer.profilePicture || '👨‍💻', // Default avatar
        projectInterests: peer.skills || [], // Use skills as project interests
        experience: peer.Experiences && peer.Experiences.length > 0 
          ? `${peer.Experiences.length} project${peer.Experiences.length > 1 ? 's' : ''}`
          : 'New to platform'
      };
    });

    // Apply rating filter if specified
    let filteredPeers = peersWithRating;
    if (minRating) {
      filteredPeers = peersWithRating.filter(peer => peer.rating >= parseFloat(minRating));
    }

    res.json({
      success: true,
      data: {
        peers: filteredPeers,
        pagination: {
          total: peers.count,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < peers.count
        }
      }
    });
  } catch (error) {
    console.error('Find peers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getDashboard,
  getActivity,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getProfile,
  updateProfile,
  uploadCV,
  uploadProfilePicture,
  updateStatus,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  getMyFeedback,
  submitReview,
  getMyReviews,
  getCertificates,
  findPeers
};