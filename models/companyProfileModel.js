const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensure the recruiter is associated with the company profile
  },
  companyName: { type: String, required: true },
  contact: { type: String, required: true },
  logo: { type: String }, // Path or URL to the company logo
  website: { type: String }, // Optional field for company website
  address: { type: String }, // Optional field for company address
  description: { type: String }, // Optional field for company description
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
