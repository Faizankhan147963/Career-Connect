const express = require('express');
const { applyForJob, getAllApplications, getApplicantsForJob, getUserApplications, updateApplicationById, getLastFiveApplications } = require('../controllers/jobApplicationController');

const router = express.Router();

// Route to apply for a job
router.post('/apply', applyForJob);

// Route to get all job applications
router.get('/', getAllApplications);

// Route to get total applicants for a specific job
router.get('/applicants/:jobId', getApplicantsForJob);

// Route to get all applications for a specific user
router.get('/user/:userId', getUserApplications);

// Route to update an application by ID
router.put('/:applicationId', updateApplicationById);

// Route to get the last 5 job applications
router.get('/last-five', getLastFiveApplications);

module.exports = router;
