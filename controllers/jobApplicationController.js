const fs = require('fs');
const multer = require('multer');
const path = require('path');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

// Ensure uploads directory exists
const uploadDirectory = 'uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set up file storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Specify folder to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

// Initialize multer with file size limit and filter
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
}).single('resume'); // 'resume' is the field name in Postman

// Apply for a job
exports.applyForJob = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { jobId, userId } = req.body;
      const resume = req.file.path; // Path to the uploaded resume

      // Validate input
      if (!jobId || !userId || !resume) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check if the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
      }

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user || user.role !== 'job_seeker') {
        return res.status(403).json({ message: 'Invalid user or unauthorized.' });
      }

      // Check if the user has already applied for this job
      const existingApplication = await JobApplication.findOne({ job: jobId, user: userId });
      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job.' });
      }

      // Create a new job application
      const application = await JobApplication.create({
        job: jobId,
        user: userId,
        resume,
      });

      res.status(201).json({ message: 'Application submitted successfully.', application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
};


// Get all job applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate('job', 'title description')  // Populate job details
      .populate('user', 'name email')        // Populate user details
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found.' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


// Get all applicants for a specific job with user details and total count
exports.getApplicantsForJob = async (req, res) => {
  const { jobId } = req.params; // Get jobId from route parameters

  try {
    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    // Find all applications for the given job ID
    const applications = await JobApplication.find({ job: jobId })
      .populate('user', 'name email')  // Populate the user details (name, email)
      .exec();

    // If no applications exist
    if (applications.length === 0) {
      return res.status(404).json({ message: 'No applicants found for this job.' });
    }

    // Return total number of applicants and their details
    res.status(200).json({
      totalApplicants: applications.length, // Total number of applicants
      applicants: applications.map(application => ({
        applicationId: application._id, // Add application ID
        userId: application.user._id,  // User ID
        name: application.user.name,
        email: application.user.email,
        resumeLink: `${req.protocol}://${req.get('host')}/${application.resume}`, // Resume link
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all job applications for a specific user
exports.getUserApplications = async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Find all job applications for the user
    const applications = await JobApplication.find({ user: userId })
      .populate({
        path: 'job',
        model: 'Job',
      }) // Populate full job details
      .exec();

    // If no applications found
    if (applications.length === 0) {
      return res.status(404).json({ message: 'No job applications found for this user.' });
    }

    // Return total applications and their details
    res.status(200).json({
      totalApplications: applications.length, // Total number of applications
      applications: applications.map(application => ({
        jobId: application.job._id,
        title: application.job.title,
        description: application.job.description,
        company: application.job.company, // Assuming company field exists
        location: application.job.location, // Assuming location field exists
        salary: application.job.salary, // Assuming salary field exists
        requirements: application.job.requirements, // Assuming requirements field exists
        status: application.status, // Application status
        appliedAt: application.appliedAt, // Application date
        resumeLink: `${req.protocol}://${req.get('host')}/${application.resume}`, // Resume link
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


exports.updateApplicationById = async (req, res) => {
  const { applicationId } = req.params; // Get application ID from request parameters
  const updates = req.body; // Get update fields from request body

  try {
    // Validate application ID
    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required.' });
    }

    // Find application and update it
    const updatedApplication = await JobApplication.findByIdAndUpdate(applicationId, updates, { new: true });

    // If application not found
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: 'Application updated successfully.', updatedApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


exports.getLastFiveApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Get only the last 5 applications
      .populate('job', 'title description') // Populate job details
      .populate('user', 'name email') // Populate user details
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found.' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};