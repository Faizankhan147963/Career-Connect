const Company = require('../models/Company'); // Import the Company model
const User  = require('../models/userModel');

// Controller for registering a new company
const registerCompany = async (req, res) => {
  try {
    const { name, industry, location, companySize, workingPolicy, about, benefits, userId } = req.body;

    // Validate the input data
    if (!name || !industry || !location || !companySize || !workingPolicy || !about || !benefits || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a company is already registered with the provided userId
    const existingCompany = await Company.findOne({ userId });
    if (existingCompany) {
      return res.status(400).json({ message: 'A company is already registered with this userId' });
    }

    // Create a new company object
    const newCompany = new Company({
      name,
      industry,
      location,
      companySize,
      workingPolicy,
      about,
      benefits,
      userId
    });

    // Save the company to the database
    await newCompany.save();

    return res.status(201).json({ message: 'Company registered successfully', company: newCompany });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get company by userId
const getCompanyByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the company by userId
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found for this userId' });
    }

    return res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const getAllCompanies = async (req, res) => {
  try {
    // Retrieve all companies
    const companies = await Company.find();

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: 'No companies found' });
    }

    return res.status(200).json({ companies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the company by its ID
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate input data
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Find and update the company by its ID
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on update
    });

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the company by its ID
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { 
  registerCompany, 
  getCompanyByUserId, 
  getAllCompanies, 
  deleteCompany, 
  updateCompany,
  getCompanyById, // Export the new function
};