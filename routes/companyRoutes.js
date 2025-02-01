const express = require('express');
const router = express.Router();
const { 
  registerCompany, 
  getCompanyByUserId, 
  getAllCompanies, 
  deleteCompany, 
  updateCompany,
  getCompanyById, // Import the new controller function
} = require('../controllers/companyController');
const adminOrRecruiter = require('../middleware/adminOrRecruiter');

// Route for company registration
router.post('/register', registerCompany);

// Route for getting a company by userId
router.get('/:userId', getCompanyByUserId);

// Route for getting a company by company ID
router.get('/company/:id', getCompanyById); // New route

// Route for getting all companies
router.get('/', getAllCompanies);

// Route for deleting a company by its ID
router.delete('/:id', adminOrRecruiter, deleteCompany);

// Route for updating a company by its ID
router.put('/:id', adminOrRecruiter, updateCompany);

module.exports = router;
