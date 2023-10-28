// webTemplateRoute.js
import express from 'express';
import { createWebTemplate, getAllWebTemplates } from '../controllers/webTemplateController.js';

const router = express.Router();

// Create a new web template
router.post('/', createWebTemplate);

// Get all web templates
router.get('/', getAllWebTemplates);

export default router;
