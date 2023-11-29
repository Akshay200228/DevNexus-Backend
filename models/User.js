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
    required: true,
    minlength: 6,
  },

  avatar: {
    type: String,
  },

  // Add any other user-specific fields here
  codeComponents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodeComponent', 
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;