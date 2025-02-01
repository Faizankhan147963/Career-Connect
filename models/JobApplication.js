const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Under Review', 'Shortlisted', '  '], 
    default: 'Applied' 
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
