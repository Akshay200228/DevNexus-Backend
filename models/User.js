// User schema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: 'Invalid email format',
    },
  },

  otp: {
    type: String,
  },

  otpExpiration: {
    type: Date,
  },

  verified: {
    type: Boolean,
    default: false, // Set to false by default, indicating the user is not verified
  },

  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      'Username invalid, it should contain 8-20 alphanumeric letters and be unique!',
    ],
  },

  password: {
    type: String,
    required: [true, 'Password is required!'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d).{8,}$/,
      'Password should be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 digit.',
    ],
  },

  avatar: {
    type: String,
  },

  // Add any user-specific fields here
  codeComponents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodeComponent',
    },
  ],

  webTemplates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WebTemplate',
    },
  ],

  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodeComponent',
    },
  ],

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;