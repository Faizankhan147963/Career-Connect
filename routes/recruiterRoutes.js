const express = require('express');
const { signupRecruiter, loginRecruiter, updateCompanyProfile, changePassword, getCompanyProfile } = require('../controllers/recruiterController');
const adminOrRecruiter = require('../middleware/adminOrRecruiter');
const router = express.Router();

// Sign up as recruiter
router.post('/signup', signupRecruiter);

// Login as recruiter
router.post('/login', loginRecruiter);

// Update company profile (create or update)
router.put('/company-profile', adminOrRecruiter, updateCompanyProfile);

// Get company profile
router.get('/company-profile', adminOrRecruiter, getCompanyProfile); // Added GET request for company profile

// Change recruiter password
router.put('/change-password', adminOrRecruiter, changePassword);

module.exports = router;
