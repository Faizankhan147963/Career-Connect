const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Import job routes
const recruiterRoutes = require('./routes/recruiterRoutes'); // Import recruiter routes
const jobApplicationRoutes = require('./routes/jobApplicationRoutes'); // Import job application routes

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);  // Auth routes (Sign up and login)
app.use('/api/users', userRoutes);  // User management routes (CRUD for users, Admin only)
app.use('/api/jobs', jobRoutes);  // Job listing routes (Admin and Recruiter)
app.use('/api/recruiters', recruiterRoutes);  // Recruiter-specific routes (Profile management, password change)
app.use('/api/applications', jobApplicationRoutes);  // Job application routes

// Server setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
