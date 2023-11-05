// controllers/codeComponentController.js

import CodeComponent from '../models/CodeComponent.js';

// Create a new code component
export const createCodeComponent = async (req, res) => {
    try {
        // Check if the request is unauthorized
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Extract data from the request body
        const { title, description, category, code } = req.body;
        // Get the user ID of the creator from the request
        const createdBy = req.userId;
        // Create a new CodeComponent instance
        const newCodeComponent = new CodeComponent({ title, description, code, category, createdBy });
        // Save the new code component to the database
        await newCodeComponent.save();
        // Return a success response with the created code component
        res.status(201).json(newCodeComponent);
    } catch (error) {
        // Handle server error and return an error response
        res.status(500).json({ error: 'Server Error' });
    }
};


// Get all code components
export const getAllCodeComponents = async (req, res) => {
    try {
        const codeComponents = await CodeComponent.find();
        res.status(200).json(codeComponents);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get a single code component by ID
export const getCodeComponentById = async (req, res) => {
    try {
        const codeComponent = await CodeComponent.findById(req.params.id);
        if (!codeComponent) {
            return res.status(404).json({ error: 'Code component not found' });
        }
        res.status(200).json(codeComponent);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
