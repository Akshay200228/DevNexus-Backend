// routes/users.js
import express from 'express';
import { createUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();


// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

export default router;
