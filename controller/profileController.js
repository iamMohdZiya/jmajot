const User = require('../model/user');
const fs = require('fs');
const path = require('path');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    if (name) user.name = name;
    if (bio) user.bio = bio;
    
    // If a new profile image is uploaded, update the image
    if (req.file) {
      // Delete old profile image if it's not the default
      if (user.profileImage && user.profileImage !== 'default-profile.png') {
        const oldImagePath = path.join(__dirname, '../uploads/profiles', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      user.profileImage = req.file.filename;
    }
    
    await user.save();
    
    // Return user data without sensitive information
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const user = await User.findById(userId).select('-password -salt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

// Get profile image
exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId).select('profileImage');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user has a profile image, send the file path
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '../uploads/profiles', user.profileImage);
      
      // Check if the file exists
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else if (user.profileImage === 'default-profile.png') {
        // If it's the default image, send the default image
        const defaultImagePath = path.join(__dirname, '../uploads/profiles', 'default-profile.png');
        if (fs.existsSync(defaultImagePath)) {
          return res.sendFile(defaultImagePath);
        }
      }
    }
    
    // If no image found or file doesn't exist, send a 404
    res.status(404).json({ message: 'Profile image not found' });
  } catch (error) {
    console.error('Get profile image error:', error);
    res.status(500).json({ message: 'Error retrieving profile image' });
  }
};