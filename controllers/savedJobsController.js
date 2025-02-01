const User = require('../models/userModel');
const Job = require('../models/jobModel');

// Save a job to the user's saved jobs list
exports.saveJob = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const { jobId } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Find user and add job to savedJobs array if not already saved
    const user = await User.findById(userId);
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all saved jobs for a user
exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const user = await User.findById(userId).populate('savedJobs');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.savedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
