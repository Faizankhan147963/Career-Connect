const express = require('express');
const { applyForJob, getApplicationStatus, viewApplications } = require('../controllers/jobApplicationController');
const jobSeeker = require('../middleware/jobSeeker');
const adminOrRecruiter = require('../middleware/adminOrRecruiter');
const uploadResume = require('../middleware/uploadResume'); // Import the multer upload middleware
const router = express.Router();

// Job Seeker applies for a job (with resume upload)
router.post('/apply', jobSeeker, uploadResume.single('resume'), applyForJob);

// Job Seeker, Admin, or Recruiter checks application status
router.get('/status/:applicationId', adminOrRecruiter, getApplicationStatus);

// Recruiters/Admin view applications for a job
router.get('/view', adminOrRecruiter, viewApplications);

module.exports = router;
