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

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  try {
    // Assuming you're using the user ID from the request parameters
    const userId = req.params.id;

    // Fetch user details based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error while fetching user:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
};