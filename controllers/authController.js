// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// SignUp User
export const createUser = async (req, res) => {
  try {
    const { name, email, username, password, avatar } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const newUser = new User({ name, email, username });

    if (avatar) {
      if (avatar.startsWith('https://') || avatar.startsWith('http://')) {
        // Image URL provided, save the URL to the avatar field
        newUser.avatar = avatar;
      } else {
        return res.status(400).json({ error: 'Invalid image URL' });
      }
    }

    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar || null,
        // Add other user data fields as needed
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and send an authentication token (e.g., JWT) to the client
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d', // Token expiration time
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
