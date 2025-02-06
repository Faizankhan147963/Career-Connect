const express = require('express');
const { getAllProfiles, getUserProfile, createUserProfile, updateUserProfile } = require('../controllers/profileController');

const router = express.Router();

// Route to get all user profiles
router.get('/', getAllProfiles);

// Route to get a user's profile by ID
router.get('/:id', getUserProfile);

// Route to create or update a user's profile by ID
router.post('/:id', createUserProfile);

// Route to update a user's profile by ID
router.put('/:id', updateUserProfile);

module.exports = router;
