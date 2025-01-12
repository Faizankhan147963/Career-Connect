const JobApplication = require('../models/jobApplicationModel');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Apply for a job (with resume)
const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const resume = req.file;  // Multer attaches the uploaded file to req.file

  if (!resume) {
    return res.status(400).json({ message: 'Resume is required to apply for the job' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await JobApplication.findOne({
      jobId,
      userId: req.user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new JobApplication({
      userId: req.user._id,
      jobId,
      resume: resume.path,  // Store the file path of the uploaded resume
      status: 'pending',
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get application status (Job Seeker, Admin, or Recruiter)
const getApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await JobApplication.findById(applicationId).populate('jobId userId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure the user is either the Job Seeker or has the right role (Admin/Recruiter)
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'recruiter' &&
      application.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'You are not authorized to view this application status' });
    }

    res.status(200).json({ applicationStatus: application.status, application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View all applications (Recruiters/Admin)
const viewApplications = async (req, res) => {
  const { jobId } = req.query;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure the user is a recruiter or admin
    if (req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'You are not authorized to view applications' });
    }

    const applications = await JobApplication.find({ jobId }).populate('userId jobId');
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { applyForJob, getApplicationStatus, viewApplications };
