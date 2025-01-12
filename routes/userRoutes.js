const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const adminOnly = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', adminOnly, getUsers);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
