const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: String,
}, { _id: false });

const tableSchemaSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
  },
  columns: [columnSchema],
  sampleData: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  tableSchemas: [tableSchemaSchema],
  expectedOutput: {
    type: String,
    default: '',
  },
  hints: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

assignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Assignment', assignmentSchema);
