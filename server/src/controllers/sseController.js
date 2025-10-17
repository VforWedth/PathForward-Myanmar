// Real-time Server-Sent Events (SSE) for job notifications
const { verifyToken } = require('../utils/jwt');
const { User, University } = require('../models');

// Store active SSE connections
const universityConnections = new Map();

/**
 * SSE endpoint for universities to receive real-time job notifications
 * @route GET /api/university/job-notifications
 */
const streamJobNotifications = async (req, res) => {
  try {
    // Extract token from query parameter
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Get user and verify role
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: University, as: 'University' }]
    });

    if (!user || user.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const universityId = user.University.id;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    console.log(`✅ SSE connection established for university: ${user.University.universityName} (${universityId})`);

    // Store connection
    if (!universityConnections.has(universityId)) {
      universityConnections.set(universityId, new Set());
    }
    universityConnections.get(universityId).add(res);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time updates active' })}\n\n`);

    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
      res.write(`:heartbeat\n\n`);
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      console.log(`❌ SSE connection closed for university: ${universityId}`);
      clearInterval(heartbeatInterval);

      const connections = universityConnections.get(universityId);
      if (connections) {
        connections.delete(res);
        if (connections.size === 0) {
          universityConnections.delete(universityId);
        }
      }
    });

  } catch (error) {
    console.error('SSE Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Notify universities when a new job is posted
 * @param {string} jobId - The job ID
 * @param {object} jobData - The job data to send
 * @param {array} targetUniversityIds - Array of university IDs to notify
 * @param {boolean} isPublic - Whether the job is public
 */
const notifyUniversitiesNewJob = (jobId, jobData, targetUniversityIds = [], isPublic = true) => {
  console.log(`📢 Broadcasting new job: ${jobData.title}`);
  console.log(`   Public: ${isPublic}, Target Unis: ${targetUniversityIds.length}`);

  const notification = {
    type: 'new_job',
    job: {
      id: jobId,
      title: jobData.title,
      company: jobData.Company?.companyName || 'Unknown Company',
      ...jobData
    }
  };

  let notifiedCount = 0;

  if (isPublic) {
    // Notify ALL universities
    universityConnections.forEach((connections, universityId) => {
      connections.forEach(res => {
        try {
          res.write(`data: ${JSON.stringify(notification)}\n\n`);
          notifiedCount++;
        } catch (error) {
          console.error(`Error sending to university ${universityId}:`, error);
        }
      });
    });
    console.log(`   ✅ Notified all universities (${notifiedCount} connections)`);
  } else {
    // Notify only target universities
    targetUniversityIds.forEach(universityId => {
      const connections = universityConnections.get(universityId);
      if (connections) {
        connections.forEach(res => {
          try {
            res.write(`data: ${JSON.stringify(notification)}\n\n`);
            notifiedCount++;
          } catch (error) {
            console.error(`Error sending to university ${universityId}:`, error);
          }
        });
      }
    });
    console.log(`   ✅ Notified ${targetUniversityIds.length} target universities (${notifiedCount} connections)`);
  }
};

/**
 * Notify universities when a job is updated
 */
const notifyUniversitiesJobUpdate = (jobId, jobData, targetUniversityIds = [], isPublic = true) => {
  const notification = {
    type: 'update_job',
    job: {
      id: jobId,
      title: jobData.title,
      ...jobData
    }
  };

  if (isPublic) {
    universityConnections.forEach((connections) => {
      connections.forEach(res => {
        try {
          res.write(`data: ${JSON.stringify(notification)}\n\n`);
        } catch (error) {
          console.error('Error sending update:', error);
        }
      });
    });
  } else {
    targetUniversityIds.forEach(universityId => {
      const connections = universityConnections.get(universityId);
      if (connections) {
        connections.forEach(res => {
          try {
            res.write(`data: ${JSON.stringify(notification)}\n\n`);
          } catch (error) {
            console.error('Error sending update:', error);
          }
        });
      }
    });
  }
};

/**
 * Notify universities when a job is deleted
 */
const notifyUniversitiesJobDelete = (jobId, jobTitle) => {
  const notification = {
    type: 'delete_job',
    job: {
      id: jobId,
      title: jobTitle
    }
  };

  universityConnections.forEach((connections) => {
    connections.forEach(res => {
      try {
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (error) {
        console.error('Error sending delete:', error);
      }
    });
  });
};

module.exports = {
  streamJobNotifications,
  notifyUniversitiesNewJob,
  notifyUniversitiesJobUpdate,
  notifyUniversitiesJobDelete,
};
