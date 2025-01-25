const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Internship'], 
    required: true 
  },
  salary: { type: Number },
  location: {
    city: { type: String, required: true },
    stateOrProvince: { type: String, required: true },
    country: { type: String, required: true },
    remoteOnSiteHybrid: { 
      type: String, 
      enum: ['Remote', 'On-site', 'Hybrid'], 
      required: true 
    }
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level'],
    required: true
  },
  skills: { type: [String], required: true },
 
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
