// controllers/userController.js
import User from '../models/User.js';


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
