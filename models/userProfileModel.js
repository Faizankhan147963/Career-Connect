const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  jobTitle: { type: String },
  employerName: { type: String },
  yearsOfExperience: [
    {
      company: { type: String },
      years: { type: Number },
      experienceType: { type: String, enum: ['Job', 'Internship'], required: true },
      description: { type: String, required: false }
    }
  ],
  
  skills: { type: [String] },
  preferredJobRole: { type: String },
  expectedSalary: { type: String },
  highestQualification: { type: String },
  specialization: { type: String },
  graduationYear: { type: String },
  currentLocation: { type: String },
  preferredLocation: { type: String },
  jobPreferences: { type: String },
  industryPreference: { type: String },
  languagesKnown: { type: [String] },
  
  // Updated portfolio field to include project name and link
  portfolio: [
    {
      projectName: { type: String, required: true },
      projectLink: { type: String, required: true }
    }
  ],

  aboutMe: { type: String }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
