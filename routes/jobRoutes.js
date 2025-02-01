// routes/jobRoutes.js
const express = require('express');
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobsByUser,
  getJobById, // Add the new function here
} = require('../controllers/jobController');
const adminOnly = require('../middlewares/authMiddleware');
const recruiterOnly = require('../middlewares/recruiterMiddleware');
const router = express.Router();

// Create a job listing (Admin and Recruiter)
router.post('/', recruiterOnly, createJob);

// Get all job listings (Admin and Recruiter)
router.get('/', getJobs);

// Get a job by job ID
router.get('/job/:id', getJobById); // New route for fetching job by ID

// Get jobs by user ID
router.get('/:userid', getJobsByUser);

// Update a job listing (Admin and Recruiter)
router.put('/:id', recruiterOnly, updateJob);

// Delete a job listing (Admin and Recruiter)
router.delete('/:id', recruiterOnly, deleteJob);

module.exports = router;
