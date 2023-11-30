// routes/codeComponentRoute.js
import express from 'express';
import {
    createCodeComponent,
    getAllCodeComponents,
    getCodeComponentsByCategory,
} from '../controllers/codeComponentController.js';

import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router();

// Create a new code component
router.post('/', authenticate, createCodeComponent);

// Get all code components
router.get('/', getAllCodeComponents);

// Get a code component by ID
router.get('/category/:category', getCodeComponentsByCategory);


export default router;
