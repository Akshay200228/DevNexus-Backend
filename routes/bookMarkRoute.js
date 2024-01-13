import express from 'express';
import { bookmarkCodeComponent, getAllUsersWithBookmarks, removeBookmark } from '../controllers/bookmarkController.js';
import { authenticate } from '../middlewares/authMiddleware.js';


const router = express.Router();

// ... (existing routes)

// Add bookmark route
router.post('/add-bookmark/:codeComponentId', authenticate, bookmarkCodeComponent);

// Remove bookmark route
router.delete('/remove-bookmark', authenticate, removeBookmark);

// Get bookmark route
router.get('/get-bookmark', authenticate, getAllUsersWithBookmarks);

export default router;
