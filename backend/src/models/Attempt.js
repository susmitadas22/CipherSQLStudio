const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  sqlQuery: {
    type: String,
    required: true,
  },
  isSuccessful: {
    type: Boolean,
    default: false,
  },
  executionTime: {
    type: Number,
    default: 0,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

attemptSchema.index({ userId: 1, assignmentId: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
