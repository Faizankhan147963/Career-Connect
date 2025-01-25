const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const adminOnly = require('../middlewares/authMiddleware');  // Middleware for Admin access
const recruiterOnly = require('../middlewares/recruiterMiddleware'); // Middleware for Recruiter access
const router = express.Router();

// Create a job listing (Admin and Recruiter)
router.post('/', recruiterOnly, createJob);

// Get all job listings (Admin and Recruiter)
router.get('/', getJobs);

// Update a job listing (Admin and Recruiter)
router.put('/:id', recruiterOnly, updateJob);

// Delete a job listing (Admin and Recruiter)
router.delete('/:id',  recruiterOnly, deleteJob);

module.exports = router;
