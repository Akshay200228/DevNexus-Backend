// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { generateUsername } from '../custome-func/generateUsername.js';
import { generateRandomPassword } from '../custome-func/generateRandomPassword.js';

dotenv.config();
const jwtTokenUser = process.env.JWT_SECRET;
// const jwtTokenUser = "2e60dd7b5e7a86585a8a5e40bf7218e6c3e5c940294b7be982a4ec408a2e41347";

// Function to generate a random OTP with expiration time (10 minutes)
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 2); // Set expiration time to 2 minutes from now
  return { otp, expirationTime };
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP via email
const sendOTPEmail = async (to, otp) => {
  const logoImageUrl = "https://dev-nexus.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdevLogo.8d21b413.png&w=640&q=75";

  const mailOptions = {
    from: 'akshayrs096@gmail.com',
    to,
    subject: 'OTP for Login',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; background-color: #f4f4f4; border-radius: 10px;">
        <img src="${logoImageUrl}" alt="Dev Nexus Logo" style="width: 150px; height: 150px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />
        <h1 style="color: #007BFF; margin-bottom: 20px;">Welcome to Dev Nexus</h1>
        <p style="font-size: 18px; color: #4CAF50;">Your OTP for Login:</p>
        <div style="background-color: #007BFF; color: white; font-size: 36px; padding: 15px; border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">${otp}</div>
        <p style="color: #868686; font-size: 14px;">This OTP is valid for the next 10 minutes.</p>
        <p style="color: #868686; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};


export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { otp, expirationTime } = generateOTP();
    user.otp = otp;
    user.otpExpiration = expirationTime;

    // Send OTP via email
    sendOTPEmail(user.email, otp);
    // Update user document in the database with the new OTP
    await user.save();

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otp !== otp || user.otpExpiration < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Set the user as verified
    user.verified = true;

    // Clear the OTP after successful verification
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    // Generate and send an authentication token (e.g., JWT) to the client
    const token = jwt.sign(
      {
        userId: user._id
      },
      jwtTokenUser,
      {
        expiresIn: '7d', // Token expiration time
      }
    );
    console.log("Save Token: ", token)

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Signup
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

    const newUser = new User({
      name,
      email,
      username,
      codeComponents: [],
      webTemplates: []
    });

    // Hash the password
    newUser.password = await bcrypt.hash(password, 10);

    const { otp, expirationTime } = generateOTP();
    newUser.otp = otp;
    newUser.otpExpiration = expirationTime;

    // Save the user to get the _id
    await newUser.save();

    // Send OTP via email
    sendOTPEmail(newUser.email, otp);

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
    console.log("Error Error Error Error ")
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
      jwtTokenUser,
      {
        expiresIn: '7d', // Token expiration time
      }
    );

    await user.save();

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
    console.log("Error Error Error Error ")
    res.status(500).json({ error: 'Server Error' });
  }
};


export const loginWithGoogle = async (req, res) => {
  try {
    console.log("Start Google authentication");
    const { idToken } = req.body;

    // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google client ID
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    // Verify idToken with Google
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new user with a random username based on email
    if (!user) {
      // Generate a random username based on the user's name and email
      const username = generateUsername(name, email);
      // Generate a random password that fulfills the criteria
      const password = generateRandomPassword();

      user = new User({
        name: name,
        email: email,
        password: password,
        username: username,
        googleId: googleId
      });
      await user.save();
    }

    // Generate JWT token with only userId in the payload
    const token = jwt.sign(
      {
        userId: user._id
      },
      jwtTokenUser,
      {
        expiresIn: '7d',
      }
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Google Login successful',
      token
    });

    console.log("user google: ", user._id)
    console.log("Done login google")
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// export const loginWithGoogle = async (req, res) => {
//   try {
//     console.log("Start Google authentication");
//     const { email } = req.body;
//     console.log("Received email:", email);

//     // Here you can continue with your Google authentication logic or any other processing you need to perform

//     res.status(200).json({ message: "Email received successfully" });
//   } catch (error) {
//     console.error("Error during Google authentication:", error);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };



// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { otp, expirationTime } = generateOTP();
    user.otp = otp;
    user.otpExpiration = expirationTime;

    // Send OTP via email
    sendOTPEmail(user.email, otp);

    // Update user document in the database with the new OTP
    await user.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Reset Password - Verify OTP and Update Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otp !== otp || user.otpExpiration < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear the OTP after successful password reset
    user.otp = undefined;
    user.otpExpiration = undefined;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
