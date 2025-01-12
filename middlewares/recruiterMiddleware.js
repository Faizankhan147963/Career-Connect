const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to verify if the user is a Recruiter
const recruiterOnly = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || (user.role !== 'admin' && user.role !== 'recruiter')) {
      return res.status(403).json({ message: 'Access denied: Admins and Recruiters only' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = recruiterOnly;
