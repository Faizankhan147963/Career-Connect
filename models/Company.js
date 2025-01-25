const mongoose = require('mongoose');

// Define the schema for company registration
const companySchema = new mongoose.Schema({
  name: { type: String },
  industry: { type: String },
  location: { type: String },
  companySize: { type: String },
  workingPolicy: { type: String }, // e.g., "Work from Home", "Hybrid", etc.
  about: { type: String},
  benefits: { type: [String] }, // Changed to an array of strings
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
