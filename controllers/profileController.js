const UserProfile = require('../models/userProfileModel');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const userProfile = await UserProfile.findById(id);

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ profile: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create or update user profile by ID
const createUserProfile = async (req, res) => {
  const { id } = req.params;
  const profileData = req.body;

  try {
    let userProfile = await UserProfile.findById(id);

    if (userProfile) {
      // Update existing profile
      userProfile = await UserProfile.findByIdAndUpdate(id, profileData, { new: true });
      return res.status(200).json({ message: 'Profile updated successfully', profile: userProfile });
    }

    // Create new profile if not found
    userProfile = new UserProfile({ _id: id, ...profileData });
    await userProfile.save();
    res.status(201).json({ message: 'Profile created successfully', profile: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Update user profile by ID
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const profileData = req.body;

  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(id, profileData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getUserProfile, createUserProfile, updateUserProfile };