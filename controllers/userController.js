// controllers/userController.js
import CodeComponent from '../models/CodeComponent.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    if (users.length === 0) {
      return res.status(404).json({ message: 'No Users Found!' });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error('Error while fetching users:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get the authenticated user's details with bookmarks
export const getAuthenticatedUser = async (req, res) => {
  console.log("start: ")

  const userId = req.userId;
  // const googleId = req.googleId;
  // console.log("googleId: ", googleId)

  try {
    // Use populate to get bookmarks details for the authenticated user
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      model: 'CodeComponent',
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user data with bookmarks in the response
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      googleId: user.googleId,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      github: user.github,
      cityName: user.cityName,
      stateName: user.stateName,
      codeComponents: user.codeComponents,
      webTemplates: user.webTemplates,
      following: user.following,
      bookmarks: user.bookmarks.map((bookmark) => ({
        _id: bookmark._id,
      })),
    });
  } catch (err) {
    console.error('Error while fetching user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count the number of followers
    const followerCount = await User.countDocuments({ following: userId });

    // Send the user data in the response
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      github: user.github,
      cityName: user.cityName,
      stateName: user.stateName,
      codeComponents: user.codeComponents,
      webTemplates: user.webTemplates,
      following: user.following,
      followerCount: followerCount,
    });
  } catch (err) {
    console.error('Error while fetching user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const getSingleUserByUsername = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user data in the response
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      github: user.github,
      cityName: user.cityName,
      stateName: user.stateName,
      codeComponents: user.codeComponents,
      webTemplates: user.webTemplates,
      following: user.following,
    });
  } catch (err) {
    console.error('Error while fetching user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};


// Upload avatar image to Cloudinary
export const uploadAvatar = async (req, res) => {
  try {
    // Update user's avatar field with the Cloudinary URL
    const userId = req.userId;
    const newAvatarUrl = req.body.url;

    // Find and update the user
    const user = await User.findByIdAndUpdate(userId, { avatar: newAvatarUrl }, { new: true });

    // Update the creatorAvatar field in CodeComponent documents where createdBy matches the current user
    await CodeComponent.updateMany(
      { createdBy: userId },
      { $set: { creatorAvatar: newAvatarUrl } }
    );

    return res.status(200).json({
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
};


// Delete avatar
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const previousImageUrl = req.query.avatarUrl; // Fix: Change to req.query.avatarUrl
    console.log(previousImageUrl);

    // Check if previousImageUrl is defined and not an empty string
    if (!previousImageUrl || typeof previousImageUrl !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing avatarUrl parameter.' });
    }

    // Parse the avatar URL to get the public_id
    const publicId = getPublicIdFromUrl(previousImageUrl);
    console.log("Public ID:", publicId);

    // Make an API call to Cloudinary to delete the image
    const deletionResult = await cloudinary.uploader.destroy(publicId);

    console.log("Deletion Result: ", deletionResult);

    // Handle the deletion result and send a response
    if (deletionResult.result === 'ok') {
      // Remove the avatar URL from the user's data in the database
      await User.findByIdAndUpdate(userId, { $set: { avatar: null } });
      res.status(200).json({ message: 'Image deleted successfully.' });
    } else if (deletionResult.result === 'not found') {
      // Image not found in Cloudinary, but proceed to remove from the database
      await User.findByIdAndUpdate(userId, { $set: { avatar: null } });
      res.status(200).json({ message: 'Image not found in Cloudinary. Removed from the database.' });
    } else {
      // Image deletion failed
      console.error("Failed to delete image:", deletionResult);
      res.status(500).json({ error: 'Failed to delete image.' });
    }
  } catch (error) {
    console.error("Error deleting avatar: ", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) {
    return null; // or handle it according to your requirements
  }
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  return publicId;
};


// Update authenticated user details
export const updateAuthenticatedUser = async (req, res) => {
  const userId = req.userId;
  const { name, portfolio, linkedin, github, cityName, stateName } = req.body;

  try {
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, portfolio, linkedin, github, cityName, stateName },
      { new: true }
    );

    // Send the updated user data in the response
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      portfolio: user.portfolio,
      linkedin: user.linkedin,
      github: user.github,
      cityName: user.cityName,
      stateName: user.stateName
    });
  } catch (err) {
    console.error('Error while updating user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Follwer User
export const followUser = async (req, res) => {
  const userId = req.userId;
  const { followUserId } = req.body;

  try {
    // Check if the user is already following the target user
    const user = await User.findById(userId);
    if (user.following.includes(followUserId)) {
      return res.status(400).json({ error: 'User is already being followed' });
    }

    // Add the follower to the user's following array
    await User.findByIdAndUpdate(userId, { $push: { following: followUserId } });

    // Add the follower to the target user's followers array
    await User.findByIdAndUpdate(followUserId, { $push: { followers: userId } });

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error while following user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Unfollow user
export const unfollowUser = async (req, res) => {
  const userId = req.userId;
  const { unfollowUserId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error while unfollowing user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};
