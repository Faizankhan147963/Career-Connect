const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to verify JWT token and check if user is admin or recruiter
const adminOrRecruiter = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || (user.role !== 'admin' && user.role !== 'recruiter')) {
      return res.status(403).json({ message: 'Access denied: Only admins or recruiters allowed' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminOrRecruiter;
