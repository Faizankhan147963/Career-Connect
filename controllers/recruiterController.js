const User = require('../models/userModel');
const CompanyProfile = require('../models/companyProfileModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up recruiter


const getCompanyProfile = async (req, res) => {
  try {
    // Find the company profile linked to the recruiter (user)
    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id }).select('-__v -createdAt -updatedAt');

    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.status(200).json({ message: 'Company profile retrieved successfully', companyProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const signupRecruiter = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: 'recruiter',
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Recruiter registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login recruiter
const loginRecruiter = async (req, res) => {
  const { email, password } = req.body;

  try {
    const recruiter = await User.findOne({ email });
    if (!recruiter || recruiter.role !== 'recruiter') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create/Update recruiter company profile
const updateCompanyProfile = async (req, res) => {
  const { companyName, contact, logo, website, address, description } = req.body;

  try {
    // Check if the recruiter already has a company profile
    let companyProfile = await CompanyProfile.findOne({ userId: req.user._id });

    if (!companyProfile) {
      // Create new company profile if it doesn't exist
      companyProfile = new CompanyProfile({
        userId: req.user._id,
        companyName,
        contact,
        logo,
        website,
        address,
        description,
      });
      await companyProfile.save();
    } else {
      // Update existing company profile
      companyProfile.companyName = companyName;
      companyProfile.contact = contact;
      companyProfile.logo = logo;
      companyProfile.website = website;
      companyProfile.address = address;
      companyProfile.description = description;

      await companyProfile.save();
    }

    // Link the company profile to the recruiter
    const recruiter = await User.findById(req.user._id);
    recruiter.companyProfile = companyProfile._id;
    await recruiter.save();

    res.status(200).json({ message: 'Company profile updated successfully', companyProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Change recruiter password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const recruiter = await User.findById(req.user._id);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    recruiter.password = newPassword;
    await recruiter.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { signupRecruiter, loginRecruiter, updateCompanyProfile, changePassword,getCompanyProfile };
