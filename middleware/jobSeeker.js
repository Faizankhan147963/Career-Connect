const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const jobSeeker = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'jobSeeker') {
      return res.status(403).json({ message: 'You are not authorized to apply for jobs' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

module.exports = jobSeeker;
