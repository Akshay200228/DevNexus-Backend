// routes/codeComponentRoute.js
import express from 'express';
import {
    createCodeComponent,
    deleteCodeComponent,
    getAllCodeComponents,
    getCodeComponentsByCategory,
    getCodeComponentsByIds,
    getSingleCodeComponent,
    updateCodeComponent,
} from '../controllers/codeComponentController.js';

import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router();

// Create a new code component
router.post('/', authenticate, createCodeComponent);

// Get a single code component by ID
router.get('/:codeComponentId', getSingleCodeComponent);

// Get all code components
router.get('/', getAllCodeComponents);

// Get code components by category
router.get('/:category', getCodeComponentsByCategory);

// Fetch multiple code components by IDs (Note the change in the route parameter definition)
router.get('/ids/:codeComponentIds*', getCodeComponentsByIds);

// Update a code component by ID
router.put('/update/:codeComponentId', authenticate, updateCodeComponent);

// Delete a code component by ID
router.delete('/delete/:codeComponentId', authenticate, deleteCodeComponent);


export default router;
