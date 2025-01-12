const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // Default role to 'job_seeker'
  role: { type: String, enum: ['job_seeker', 'recruiter', 'admin'], required: true, default: 'job_seeker' },
  companyProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' }, // Reference to company profile
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
