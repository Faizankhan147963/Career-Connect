const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');  // Import cors middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const companyRoutes = require('./routes/companyRoutes'); // Import company routes
dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, Vercel!');
});


// Enable CORS for http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api/auth', authRoutes);  // Auth routes (Sign up and login)
app.use('/api/users', userRoutes);  // User management routes (CRUD for users, Admin only)
app.use('/api/jobs', jobRoutes);  // Job listing routes (Admin and Recruiter)
app.use('/api/profiles', profileRoutes);
app.use('/api/companies', companyRoutes);  // Company registration route

// Server setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
