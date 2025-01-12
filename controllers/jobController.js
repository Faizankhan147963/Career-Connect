const Job = require('../models/jobModel');

// Create a new job listing (Admin and Recruiter)
const createJob = async (req, res) => {
  const { title, company, location, description } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      location,
      description,
      postedBy: req.user._id,  // Associate job with the logged-in user
    });

    await newJob.save();
    res.status(201).json({ message: 'Job listing created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all job listings (Admin and Recruiter)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email'); // Populate the user details for the job listing
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a job listing (Admin and Recruiter)
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, location, description } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, company, location, description },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job listing updated successfully', job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a job listing (Admin and Recruiter)
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
