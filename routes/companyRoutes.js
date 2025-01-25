const express = require('express');
const router = express.Router();
const { 
  registerCompany, 
  getCompanyByUserId, 
  getAllCompanies, 
  deleteCompany, 
  updateCompany 
} = require('../controllers/companyController');
const adminOrRecruiter = require('../middleware/adminOrRecruiter'); // Import the middleware

// Route for company registration (only accessible by admin or recruiter)
router.post('/register', registerCompany);

// Route for getting a company by userId
router.get('/:userId', getCompanyByUserId);

// Route for getting all companies
router.get('/', getAllCompanies);

// Route for deleting a company by its ID
router.delete('/:id', adminOrRecruiter, deleteCompany);

// Route for updating a company by its ID
router.put('/:id', adminOrRecruiter, updateCompany);

module.exports = router;
