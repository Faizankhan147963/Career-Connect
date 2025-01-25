const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true }, // Added lastname field
  email: { type: String, unique: true, required: true },
  mobileNumber: { type: String, required: true }, // Added mobile number field
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['job_seeker', 'recruiter', 'admin'], 
    required: true, 
    default: 'job_seeker' 
  }, // Default role to 'job_seeker'
  companyProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' }, // Reference to company profile

  // New status field
  status: { 
    type: String, 
    enum: ['active', 'rejected'], 
    required: true, 
    default: 'active' 
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
