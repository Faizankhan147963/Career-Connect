const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const adminOnly = require('../middlewares/authMiddleware');  // Middleware for Admin access
const recruiterOnly = require('../middlewares/recruiterMiddleware'); // Middleware for Recruiter access
const router = express.Router();

// Create a job listing (Admin and Recruiter)
router.post('/', adminOnly, recruiterOnly, createJob);

// Get all job listings (Admin and Recruiter)
router.get('/', adminOnly, recruiterOnly, getJobs);

// Update a job listing (Admin and Recruiter)
router.put('/:id', adminOnly, recruiterOnly, updateJob);

// Delete a job listing (Admin and Recruiter)
router.delete('/:id', adminOnly, recruiterOnly, deleteJob);

module.exports = router;
