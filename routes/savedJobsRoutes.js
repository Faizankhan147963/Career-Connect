const express = require('express');
const router = express.Router();
const savedJobsController = require('../controllers/savedJobsController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

// Route to save a job for the user
router.post('/save', protect, savedJobsController.saveJob);

// Route to get all saved jobs for the user
router.get('/', protect, savedJobsController.getSavedJobs);

module.exports = router;
