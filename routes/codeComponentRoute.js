// routes/codeComponentRoute.js
import express from 'express';
import {
    createCodeComponent,
    getAllCodeComponents,
    getCodeComponentsByCategory,
    getCodeComponentsByIds,
    getSingleCodeComponent,
} from '../controllers/codeComponentController.js';

import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router();

// Create a new code component
router.post('/', authenticate, createCodeComponent);

// Get all code components
router.get('/', getAllCodeComponents);

// Get code components by category
router.get('/category/:category', getCodeComponentsByCategory);

// Get a single code component by ID
router.get('/:id', getSingleCodeComponent);

// Fetch multiple code components by IDs (Note the change in the route parameter definition)
router.get('/ids/:codeComponentIds*', getCodeComponentsByIds);

export default router;
