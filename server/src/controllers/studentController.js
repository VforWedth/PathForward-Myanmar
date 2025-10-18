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
      where: {
        applicantId: student.id,
        applicantType: 'student'
      }
    });

    const interviewsCount = await Application.count({
      where: {
        applicantId: student.id,
        applicantType: 'student',
        status: 'shortlisted'
      }
    });

    const offersCount = await Application.count({
      where: {
        applicantId: student.id,
        applicantType: 'student',
        status: 'accepted'
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

    console.log('Dashboard Stats for student', student.id, ':', {
      applications: totalApplications,
      interviews: interviewsCount,
      offers: offersCount,
      quizzesTaken: totalQuizzesTaken,
      certificates: certificatesEarned
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

    console.log('Recent certificates count:', recentCertificates.length);

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

    const responseData = {
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
    };

    console.log('Sending dashboard response:', JSON.stringify(responseData, null, 2));

    res.json(responseData);
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

// @desc    Submit university verification request
// @route   POST /api/student/verify-university
// @access  Private (Student)
const submitVerificationRequest = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { universityId, rollNumber } = req.body;

    if (!universityId || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'University ID and roll number are required'
      });
    }

    // Verify university exists
    const university = await University.findByPk(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Update student with university info and reset to pending
    await student.update({
      universityId,
      rollNumber,
      verificationStatus: 'pending',
      rejectionReason: null
    });

    // Log activity
    const { Activity } = require('../models');
    await Activity.create({
      studentId: student.id,
      type: 'verification_submitted',
      title: 'Verification Request Submitted',
      description: `Submitted verification request to ${university.universityName}`
    });

    res.json({
      success: true,
      message: 'Verification request submitted successfully',
      data: {
        verificationStatus: student.verificationStatus,
        universityName: university.universityName
      }
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all universities
// @route   GET /api/student/universities
// @access  Private (Student)
const getUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      attributes: ['id', 'universityName', 'location', 'logo'],
      order: [['universityName', 'ASC']]
    });

    res.json({
      success: true,
      data: universities
    });
  } catch (error) {
    console.error('Get universities error:', error);
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

// @desc    Get available jobs for verified students
// @route   GET /api/student/jobs
// @access  Private (Student)
const getAvailableJobs = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: University,
          attributes: ['id', 'universityName', 'location']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Check if student is verified
    if (student.verificationStatus !== 'approved' || !student.universityId) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified student to browse jobs',
        requiresVerification: true,
        verificationStatus: student.verificationStatus
      });
    }

    const { Op } = require('sequelize');
    const { Job, Company, UniversityCompanyConnection } = require('../models');

    const {
      page = 1,
      limit = 20,
      jobType,
      workMode,
      experienceLevel,
      search,
      companyId
    } = req.query;

    const offset = (page - 1) * limit;

    // Get companies connected to student's university
    const connections = await UniversityCompanyConnection.findAll({
      where: {
        universityId: student.universityId,
        status: 'active'
      },
      attributes: ['companyId']
    });

    const connectedCompanyIds = connections.map(conn => conn.companyId);

    if (connectedCompanyIds.length === 0) {
      return res.json({
        success: true,
        jobs: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: 0
        },
        message: 'No companies are currently connected to your university'
      });
    }

    // Build where clause for jobs
    const whereClause = {
      companyId: { [Op.in]: connectedCompanyIds },
      status: 'active',
      [Op.and]: [
        // Valid deadline
        {
          [Op.or]: [
            { deadline: { [Op.gt]: new Date() } },
            { deadline: null }
          ]
        },
        // Show public jobs OR jobs targeted to this university
        {
          [Op.or]: [
            { isPublic: true },
            {
              isPublic: false,
              targetUniversities: { [Op.contains]: [student.universityId] }
            }
          ]
        }
      ]
    };

    // Apply filters
    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (workMode) {
      whereClause.workMode = workMode;
    }

    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel;
    }

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (search) {
      whereClause[Op.and].push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      });
    }

    // Fetch jobs with pagination
    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo', 'website']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      university: {
        id: student.University.id,
        name: student.University.universityName
      },
      pagination: {
        total: jobs.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(jobs.count / limit)
      }
    });
  } catch (error) {
    console.error('Get available jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single job details
// @route   GET /api/student/jobs/:id
// @access  Private (Student)
const getJobDetails = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: University,
          attributes: ['id', 'universityName']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Check if student is verified
    if (student.verificationStatus !== 'approved' || !student.universityId) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified student to view job details',
        requiresVerification: true
      });
    }

    const { Op } = require('sequelize');
    const { Job, Company, UniversityCompanyConnection, Application } = require('../models');

    // Get job details
    const job = await Job.findOne({
      where: { id: req.params.id, status: 'active' },
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName', 'industry', 'location', 'logo', 'website', 'description']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if company is connected to student's university
    const connection = await UniversityCompanyConnection.findOne({
      where: {
        universityId: student.universityId,
        companyId: job.companyId,
        status: 'active'
      }
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'This job is not available for your university'
      });
    }

    // Check if job is targeted to specific universities
    if (!job.isPublic && !job.targetUniversities.includes(student.universityId)) {
      return res.status(403).json({
        success: false,
        message: 'This job is not available for your university'
      });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: job.id,
        applicantId: student.id,
        applicantType: 'student'
      }
    });

    res.json({
      success: true,
      job,
      hasApplied: !!existingApplication,
      application: existingApplication
    });
  } catch (error) {
    console.error('Get job details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/student/jobs/:id/apply
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: University,
          attributes: ['id', 'universityName']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Check if student is verified
    if (student.verificationStatus !== 'approved' || !student.universityId) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified student to apply for jobs'
      });
    }

    const { Op } = require('sequelize');
    const { Job, Company, UniversityCompanyConnection, Application } = require('../models');
    const { coverLetter } = req.body;

    // Get job details
    const job = await Job.findOne({
      where: { id: req.params.id, status: 'active' },
      include: [
        {
          model: Company,
          attributes: ['id', 'companyName']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer active'
      });
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if company is connected to student's university
    const connection = await UniversityCompanyConnection.findOne({
      where: {
        universityId: student.universityId,
        companyId: job.companyId,
        status: 'active'
      }
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'This job is not available for your university'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: job.id,
        applicantId: student.id,
        applicantType: 'student'
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
        application: existingApplication
      });
    }

    // Create application
    const application = await Application.create({
      jobId: job.id,
      applicantId: student.id,
      applicantType: 'student',
      coverLetter: coverLetter || null,
      status: 'pending'
    });

    // Log activity
    const { Activity } = require('../models');
    await Activity.create({
      studentId: student.id,
      type: 'job_application',
      title: `Applied to ${job.title}`,
      description: `Applied to ${job.title} at ${job.Company.companyName}`
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
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

// @desc    Get my applications
// @route   GET /api/student/applications
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    console.log('getMyApplications called for user:', req.user.id);
    console.log('Student found:', student ? student.id : 'NOT FOUND');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Application, Job, Company } = require('../models');
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {
      applicantId: student.id,
      applicantType: 'student'
    };

    if (status) {
      whereClause.status = status;
    }

    console.log('Querying applications with whereClause:', whereClause);

    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'jobType', 'workMode', 'location', 'status', 'salaryRange'],
          include: [
            {
              model: Company,
              attributes: ['id', 'companyName', 'logo', 'industry']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    console.log('Found applications:', applications.length);

    res.json({
      success: true,
      applications,
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

// @desc    Withdraw application
// @route   DELETE /api/student/applications/:id
// @access  Private (Student)
const withdrawApplication = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { Application, Job, Company } = require('../models');

    // Find application
    const application = await Application.findOne({
      where: {
        id: req.params.id,
        applicantId: student.id,
        applicantType: 'student'
      },
      include: [
        {
          model: Job,
          attributes: ['id', 'title'],
          include: [
            {
              model: Company,
              attributes: ['id', 'companyName']
            }
          ]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or you do not have permission to withdraw it'
      });
    }

    // Check if application can be withdrawn
    if (application.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an accepted application. Please contact the company directly.'
      });
    }

    // Store job info before deleting
    const jobTitle = application.Job?.title || 'Unknown Job';
    const companyName = application.Job?.Company?.companyName || 'Unknown Company';

    // Delete the application
    await application.destroy();

    // Log activity
    const { Activity } = require('../models');
    await Activity.create({
      studentId: student.id,
      type: 'application_withdrawn',
      title: `Withdrew application`,
      description: `Withdrew application for ${jobTitle} at ${companyName}`
    });

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
  submitVerificationRequest,
  getUniversities,
  findPeers,
  getAvailableJobs,
  getJobDetails,
  applyForJob,
  getMyApplications,
  withdrawApplication
};