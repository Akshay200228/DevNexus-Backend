// routes/codeComponentRoute.js
import express from 'express';
import {
    createCodeComponent,
    deleteCodeComponentById,
    getAllCodeComponents,
    getCodeComponentById,
    updateCodeComponentById,
} from '../controllers/codeComponentController.js';

import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router();

// Create a new code component
router.post('/', authenticate, createCodeComponent);

// Get all code components
router.get('/', getAllCodeComponents);

// Get a code component by ID
router.get('/:id', getCodeComponentById);

// Update a code component by ID
router.put('/:id', authenticate, updateCodeComponentById);

// Delete a code component by ID
router.delete('/:id', authenticate, deleteCodeComponentById);

export default router;
