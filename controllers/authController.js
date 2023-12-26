// controllers/authController.js

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirm password do not match' });
    }

    const newUser = new User({ name, email, username, codeComponents: [], webTemplates: [] });

    // Hash the password
    newUser.password = await bcrypt.hash(password, 10);

    // Save the user to get the _id
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        codeComponents: newUser.codeComponents,
        webTemplates: newUser.webTemplates,
      },
    });
  } catch (error) {
    console.error(error);
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
        username: user.username,
        avatar: user.avatar || null,
        codeComponents: user.codeComponents,
        webTemplates: user.webTemplates,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

