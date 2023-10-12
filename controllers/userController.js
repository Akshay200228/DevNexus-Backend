// controllers/userController.js
import User from '../models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No Users Found!" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error while fetching users:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
