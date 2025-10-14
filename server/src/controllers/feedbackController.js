const { Feedback, Company, Student, Freelancer, User, Job, Application } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create feedback for a student/freelancer
 * @route   POST /api/company/feedback
 * @access  Private (Company)
 */
exports.createFeedback = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      position,
      rating,
      feedback,
      interviewPerformance,
      technicalSkills,
      communication,
      strengths,
      areasForImprovement,
      jobId,
      applicantType
    } = req.body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating (1-5)'
      });
    }

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Please provide feedback'
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

    // Determine applicantId and applicantType
    // Convert empty string to null for UUID field
    let applicantId = studentId && studentId.trim() !== '' ? studentId : null;
    let type = applicantType || 'student';

    // If applicantId is provided and not empty, verify it exists
    if (applicantId) {
      if (type === 'student') {
        const student = await Student.findByPk(applicantId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: 'Student not found'
          });
        }
      } else if (type === 'freelancer') {
        const freelancer = await Freelancer.findByPk(applicantId);
        if (!freelancer) {
          return res.status(404).json({
            success: false,
            message: 'Freelancer not found'
          });
        }
      }
    }

    // Create comprehensive feedback comment
    let comprehensiveFeedback = feedback;

    if (interviewPerformance || technicalSkills || communication || strengths || areasForImprovement) {
      comprehensiveFeedback = `
Overall Feedback: ${feedback}

${interviewPerformance ? `Interview Performance: ${interviewPerformance}\n` : ''}
${technicalSkills ? `Technical Skills: ${technicalSkills}\n` : ''}
${communication ? `Communication: ${communication}\n` : ''}
${strengths ? `Strengths: ${strengths}\n` : ''}
${areasForImprovement ? `Areas for Improvement: ${areasForImprovement}` : ''}
      `.trim();
    }

    // Create feedback
    const newFeedback = await Feedback.create({
      companyId: company.id,
      applicantId,
      applicantType: type,
      jobId: jobId || null,
      rating,
      strengths: strengths || null,
      areasForImprovement: areasForImprovement || null,
      overallComment: comprehensiveFeedback
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all feedback given by company
 * @route   GET /api/company/feedback
 * @access  Private (Company)
 */
exports.getCompanyFeedback = async (req, res) => {
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

    const feedbacks = await Feedback.findAll({
      where: { companyId: company.id },
      include: [
        {
          model: Job,
          attributes: ['id', 'title'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Enrich with applicant details
    const enrichedFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {
        const fbData = fb.toJSON();
        let applicantDetails = null;

        if (fb.applicantType === 'student') {
          const student = await Student.findByPk(fb.applicantId, {
            include: [
              {
                model: User,
                attributes: ['email']
              }
            ]
          });

          if (student) {
            applicantDetails = {
              id: student.id,
              name: student.fullName,
              email: student.User?.email,
              type: 'student'
            };
          }
        } else if (fb.applicantType === 'freelancer') {
          const freelancer = await Freelancer.findByPk(fb.applicantId, {
            include: [
              {
                model: User,
                attributes: ['email']
              }
            ]
          });

          if (freelancer) {
            applicantDetails = {
              id: freelancer.id,
              name: freelancer.fullName,
              email: freelancer.User?.email,
              type: 'freelancer'
            };
          }
        }

        // Parse comprehensive feedback back into components
        const overallComment = fbData.overallComment || '';
        let parsedFeedback = {
          feedback: overallComment,
          interviewPerformance: '',
          technicalSkills: '',
          communication: '',
          strengths: fbData.strengths || '',
          areasForImprovement: fbData.areasForImprovement || ''
        };

        // Try to extract structured feedback
        const lines = overallComment.split('\n');
        lines.forEach(line => {
          if (line.startsWith('Overall Feedback:')) {
            parsedFeedback.feedback = line.replace('Overall Feedback:', '').trim();
          } else if (line.startsWith('Interview Performance:')) {
            parsedFeedback.interviewPerformance = line.replace('Interview Performance:', '').trim();
          } else if (line.startsWith('Technical Skills:')) {
            parsedFeedback.technicalSkills = line.replace('Technical Skills:', '').trim();
          } else if (line.startsWith('Communication:')) {
            parsedFeedback.communication = line.replace('Communication:', '').trim();
          }
        });

        return {
          id: fbData.id,
          studentId: fbData.applicantId,
          studentName: applicantDetails?.name || 'Unknown',
          position: fbData.Job?.title || 'Not specified',
          rating: fbData.rating,
          ...parsedFeedback,
          submittedDate: fbData.createdAt,
          applicant: applicantDetails
        };
      })
    );

    res.json({
      success: true,
      count: enrichedFeedbacks.length,
      data: enrichedFeedbacks
    });
  } catch (error) {
    console.error('Get company feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get feedback by ID
 * @route   GET /api/company/feedback/:id
 * @access  Private (Company)
 */
exports.getFeedbackById = async (req, res) => {
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

    const feedback = await Feedback.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      },
      include: [
        {
          model: Job,
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    let applicantDetails = null;

    if (feedback.applicantType === 'student') {
      const student = await Student.findByPk(feedback.applicantId, {
        include: [
          {
            model: User,
            attributes: ['email', 'phone']
          }
        ]
      });

      if (student) {
        applicantDetails = {
          id: student.id,
          name: student.fullName,
          email: student.User?.email,
          phone: student.User?.phone,
          type: 'student'
        };
      }
    } else if (feedback.applicantType === 'freelancer') {
      const freelancer = await Freelancer.findByPk(feedback.applicantId, {
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
          type: 'freelancer'
        };
      }
    }

    res.json({
      success: true,
      data: {
        ...feedback.toJSON(),
        applicant: applicantDetails
      }
    });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update feedback
 * @route   PUT /api/company/feedback/:id
 * @access  Private (Company)
 */
exports.updateFeedback = async (req, res) => {
  try {
    const {
      rating,
      feedback,
      interviewPerformance,
      technicalSkills,
      communication,
      strengths,
      areasForImprovement
    } = req.body;

    const company = await Company.findOne({
      where: { userId: req.user.id }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const existingFeedback = await Feedback.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Create comprehensive feedback comment
    let comprehensiveFeedback = feedback || existingFeedback.overallComment;

    if (interviewPerformance || technicalSkills || communication || strengths || areasForImprovement) {
      comprehensiveFeedback = `
Overall Feedback: ${feedback || ''}

${interviewPerformance ? `Interview Performance: ${interviewPerformance}\n` : ''}
${technicalSkills ? `Technical Skills: ${technicalSkills}\n` : ''}
${communication ? `Communication: ${communication}\n` : ''}
${strengths ? `Strengths: ${strengths}\n` : ''}
${areasForImprovement ? `Areas for Improvement: ${areasForImprovement}` : ''}
      `.trim();
    }

    await existingFeedback.update({
      rating: rating || existingFeedback.rating,
      strengths: strengths || existingFeedback.strengths,
      areasForImprovement: areasForImprovement || existingFeedback.areasForImprovement,
      overallComment: comprehensiveFeedback
    });

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: existingFeedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/company/feedback/:id
 * @access  Private (Company)
 */
exports.deleteFeedback = async (req, res) => {
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

    const feedback = await Feedback.findOne({
      where: {
        id: req.params.id,
        companyId: company.id
      }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.destroy();

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get feedback statistics
 * @route   GET /api/company/feedback/stats
 * @access  Private (Company)
 */
exports.getFeedbackStats = async (req, res) => {
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

    const allFeedback = await Feedback.findAll({
      where: { companyId: company.id },
      attributes: ['rating']
    });

    const totalFeedback = allFeedback.length;
    const positiveReviews = allFeedback.filter(f => f.rating >= 4).length;
    const averageReviews = allFeedback.filter(f => f.rating === 3).length;
    const needsImprovement = allFeedback.filter(f => f.rating <= 2).length;

    res.json({
      success: true,
      data: {
        totalFeedback,
        positiveReviews,
        averageReviews,
        needsImprovement
      }
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = exports;
