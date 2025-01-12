const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resume: {
      type: String,  // Storing the file path or URL of the resume
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
