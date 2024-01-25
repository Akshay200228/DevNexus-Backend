import express from 'express';
import { deleteAvatar, followUser, getAllUsers, getAuthenticatedUser, getSingleUser, getSingleUserByUsername, unfollowUser, updateAuthenticatedUser, uploadAvatar } from '../controllers/userController.js';
import { loginUser, createUser, resendOTP, verifyOTP } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users (protected route)
router.get('/', getAllUsers);

//GET
router.get("/authUser", authenticate, getAuthenticatedUser);

// Get a single user by ID
router.get('/:userId', getSingleUser);
router.get('/:username', getSingleUserByUsername);

// Create a new user
router.post('/signup', createUser);
router.post('/login', loginUser);

// Upload avatar route
router.post('/upload-avatar', authenticate, uploadAvatar);

router.delete('/delete-avatar', authenticate, deleteAvatar);

// Update authenticated user details
router.put('/update', authenticate, updateAuthenticatedUser);

// Resend OTP route
router.post('/resend-otp', resendOTP);

router.post('/verify-otp', verifyOTP);

// Follow user route
router.post('/follow', authenticate, followUser);

// Unfollow user route
router.post('/unfollow', authenticate, unfollowUser);

export default router;
