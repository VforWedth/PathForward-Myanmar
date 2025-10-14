const { Student, User, University, Education, Experience, Certificate } = require('../models');

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

module.exports = {
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
  getMyReviews
};
