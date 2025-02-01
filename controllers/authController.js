const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  const { name, lastname, email, mobileNumber, password, role } = req.body;

  try {
    // Default to 'job_seeker' if no role is provided
    const userRole = role || 'job_seeker';

    // If role is 'admin', ensure only one admin is allowed
    if (userRole === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already registered' });
      }
    }

    // Create a new user with the role (default 'job_seeker' if not provided)
    const newUser = new User({ name, lastname, email, mobileNumber, password, role: userRole });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('companyProfile'); // Populate company profile if it exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Response with user details and token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyProfile: user.companyProfile || null, // Return company profile if it exists
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { register, login };
