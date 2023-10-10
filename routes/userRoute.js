import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { loginUser, createUser } from '../controllers/authController.js';

const router = express.Router();

// Create a new user
router.post('/signup', createUser);
router.post('/login', loginUser);

// Get all users (protected route)
router.get('/users', authenticate, getAllUsers);

export default router;
