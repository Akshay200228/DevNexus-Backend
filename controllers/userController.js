// controllers/userController.js
import User from '../models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No Users Found!' });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error('Error while fetching users:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getSingleUser = async (req, res) => {
  const userId = req.userId; // Use the user's ID from the request object

  try {
    const user = await User.findById(userId);

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
      // Add other user data fields as needed
    });
  } catch (err) {
    console.error('Error while fetching user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};