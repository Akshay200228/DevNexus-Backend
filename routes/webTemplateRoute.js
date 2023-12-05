// webTemplateRoute.js
import express from 'express';
import { createWebTemplate, getAllWebTemplates, getSingleWebTemplate, getWebTemplatesByIds } from '../controllers/webTemplateController.js';
import {authenticate} from '../middlewares/authMiddleware.js'

const router = express.Router();

// Create a new web template
router.post('/', authenticate, createWebTemplate);

// Get all web templates
router.get('/', getAllWebTemplates);

// Get a single web template by ID
router.get('/:id', getSingleWebTemplate);

// Fetch detailed data for web templates by IDs
router.get('/details/:webTemplateIds', getWebTemplatesByIds);

export default router;
