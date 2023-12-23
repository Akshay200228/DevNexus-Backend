import express from 'express';
import { deleteAvatar, getAllUsers, getAuthenticatedUser, getSingleUser, uploadAvatar } from '../controllers/userController.js';
import { loginUser, createUser } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Get all users (protected route)
router.get('/', getAllUsers);

//GET
router.get("/authUser", authenticate, getAuthenticatedUser);

// Get a single user by ID
router.get('/:userId', getSingleUser);

// Create a new user
router.post('/signup', createUser);
router.post('/login', loginUser);

const uploader = multer({
    storage: multer.memoryStorage({}),
    limits: { fileSize: 1000000 }
});
// Upload avatar route
router.post('/upload-avatar', authenticate,  uploadAvatar);

router.delete('/delete-avatar', authenticate,  deleteAvatar);

export default router;
