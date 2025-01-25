const Job = require('../models/jobModel');

// Create a new job listing (Admin and Recruiter)
const createJob = async (req, res) => {
  const { title, description, jobType, salary, location, experienceLevel, skills} = req.body;

  try {
    const newJob = new Job({
      title,
      description,
      jobType,
      salary,
      location: {
        city: location.city,
        stateOrProvince: location.stateOrProvince,
        country: location.country,
        remoteOnSiteHybrid: location.remoteOnSiteHybrid
      },
      experienceLevel,
      skills,
      postedBy: req.user._id,  // Associate job with the logged-in user
    });

    await newJob.save();
    res.status(201).json({ message: 'Job listing created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all job listings (Admin and Recruiter)
// Get all job listings with search, pagination, and sorting
const getJobs = async (req, res) => {
  const { title, location, jobType, experienceLevel, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  try {
    // Build the filter object dynamically
    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' }; // Title search (case-insensitive)
    if (location) filter['location.city'] = { $regex: location, $options: 'i' }; // City search
    if (jobType) filter.jobType = { $regex: jobType, $options: 'i' }; // Job type search
    if (experienceLevel) filter.experienceLevel = { $regex: experienceLevel, $options: 'i' }; // Experience level search

    // Pagination and sorting
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email') // Include postedBy fields
      .sort(sort) // Sort jobs
      .skip((page - 1) * limit) // Skip for pagination
      .limit(parseInt(limit)); // Limit results per page

    // Total count for pagination metadata
    const total = await Job.countDocuments(filter);

    // Respond with jobs and metadata
    res.status(200).json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// Update a job listing (Admin and Recruiter)
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, jobType, salary, location, experienceLevel, skills } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        description,
        jobType,
        salary,
        location: {
          city: location.city,
          stateOrProvince: location.stateOrProvince,
          country: location.country,
          remoteOnSiteHybrid: location.remoteOnSiteHybrid
        },
        experienceLevel,
        skills,
        
      },
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
