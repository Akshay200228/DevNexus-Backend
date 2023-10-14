import express from 'express';
import { getAllUsers, getSingleUser } from '../controllers/userController.js';
import { loginUser, createUser } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users (protected route)
router.get('/', getAllUsers);

//GET
router.get("/:id", authenticate, getSingleUser);

// Create a new user
router.post('/signup', createUser);
router.post('/login', loginUser);


export default router;
