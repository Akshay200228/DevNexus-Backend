// webTemplateRoute.js
import express from 'express';
import { createWebTemplate, deleteWebTemplate, getAllWebTemplates, getPaginatedWebTemplates, getSingleWebTemplate, getWebTemplatesByIds, updateWebTemplate } from '../controllers/webTemplateController.js';
import {authenticate} from '../middlewares/authMiddleware.js'

const router = express.Router();

// Create a new web template
router.post('/', authenticate, createWebTemplate);

// Get all web templates
router.get('/', getAllWebTemplates);

router.get('/paginated-web-templates', getPaginatedWebTemplates);


// Get a single web template by ID
router.get('/:id', getSingleWebTemplate);

// Fetch detailed data for web templates by IDs
router.get('/details/:webTemplateIds', getWebTemplatesByIds);

// Update a web template by ID
router.put('/update/:webTempId', authenticate, updateWebTemplate);

// Delete a web template by ID
router.delete('/delete/:webTempId', authenticate, deleteWebTemplate);

export default router;
