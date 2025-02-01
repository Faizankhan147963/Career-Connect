const express = require('express');
const { applyForJob, getAllApplications, getApplicantsForJob,getUserApplications,updateApplicationById } = require('../controllers/jobApplicationController');

const router = express.Router();

// Route to apply for a job
router.post('/apply', applyForJob);

// Route to get all job applications (get all applicants)
router.get('/', getAllApplications);

// Route to get total applicants for a specific job
router.get('/applicants/:jobId', getApplicantsForJob); 

// Route to get all applications for a specific user
router.get('/user/:userId', getUserApplications);

router.put('/:applicationId', updateApplicationById);


module.exports = router;
