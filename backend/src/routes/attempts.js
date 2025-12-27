const express = require('express');
const Attempt = require('../models/Attempt');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/attempts - Get user's attempts (requires auth)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.query;
    
    const query = { userId: req.userId };
    if (assignmentId) {
      query.assignmentId = assignmentId;
    }

    const attempts = await Attempt.find(query)
      .populate('assignmentId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attempts',
    });
  }
});

module.exports = router;
