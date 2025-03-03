const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['job_seeker', 'recruiter', 'admin'], 
    required: true, 
    default: 'job_seeker' 
  },
  companyProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' },

  status: { 
    type: String, 
    enum: ['active', 'rejected'], 
    required: true, 
    default: 'active' 
  },

  // New field for saved jobs
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }] // Array of job IDs
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
