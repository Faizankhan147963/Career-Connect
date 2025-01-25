const express = require('express');
const adminOnly = require('../middlewares/authMiddleware');
const router = express.Router();

const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', getUsers); // Get all users
router.get('/:id', getUserById); // Get a single user by ID
router.put('/:id', updateUser); // Update a user
router.delete('/:id', adminOnly, deleteUser); // Delete a user (admin only)

module.exports = router;
