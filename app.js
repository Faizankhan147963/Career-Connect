const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const companyRoutes = require('./routes/companyRoutes');
const savedJobsRoutes = require('./routes/savedJobsRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for http://localhost:5173
app.use(cors({
  origin: ['http://localhost:5173', 'https://careerconnectin.netlify.app'],
  credentials: true
}));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/applications', jobApplicationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
