const express = require('express');
const Assignment = require('../models/Assignment');

const router = express.Router();

// GET /api/assignments - Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .select('title description difficulty tags createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments',
    });
  }
});

// GET /api/assignments/:id - Get single assignment with full details
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }
    
    res.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment',
    });
  }
});

module.exports = router;
