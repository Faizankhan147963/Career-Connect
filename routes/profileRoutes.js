// Create a new route, controller, and model for user profile information

// routes/profileRoutes.js
const express = require('express');
const { getUserProfile, createUserProfile, updateUserProfile } = require('../controllers/profileController');
const router = express.Router();

// Route to get a user's profile by ID
router.get('/:id', getUserProfile);

// Route to create or update a user's profile by ID
router.post('/:id', createUserProfile);

// Route to update a user's profile by ID
router.put('/:id', updateUserProfile);

module.exports = router;
