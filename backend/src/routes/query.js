const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../services/queryExecutor');
const { generateHint } = require('../services/llmService');
const Assignment = require('../models/Assignment');
const Attempt = require('../models/Attempt');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/query/execute - Execute SQL query
router.post('/execute',
  [
    body('query').trim().notEmpty().withMessage('SQL query is required'),
    body('assignmentId').optional().isMongoId().withMessage('Invalid assignment ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { query, assignmentId } = req.body;

    try {
      const result = await executeQuery(query);

      // If user is authenticated and assignmentId provided, save attempt (optional feature)
      if (req.userId && assignmentId) {
        try {
          await Attempt.create({
            userId: req.userId,
            assignmentId,
            sqlQuery: query,
            isSuccessful: result.success,
            executionTime: result.executionTime,
            errorMessage: result.error || null,
          });
        } catch (attemptError) {
          console.error('Error saving attempt:', attemptError);
          // Don't fail the request if saving attempt fails
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Query execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error during query execution',
      });
    }
  }
);

// POST /api/query/hint - Get LLM hint
router.post('/hint',
  [
    body('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
    body('userQuery').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { assignmentId, userQuery } = req.body;

    try {
      // Fetch assignment
      const assignment = await Assignment.findById(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({
          success: false,
          error: 'Assignment not found',
        });
      }

      // Generate hint using LLM
      const hint = await generateHint(
        assignment.question,
        userQuery,
        assignment.hints || []
      );

      res.json({
        success: true,
        hint,
      });
    } catch (error) {
      console.error('Hint generation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate hint',
      });
    }
  }
);

module.exports = router;
