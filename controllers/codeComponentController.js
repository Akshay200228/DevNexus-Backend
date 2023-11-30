// controllers/codeComponentController.js

import CodeComponent from '../models/CodeComponent.js';
import User from '../models/User.js';

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
        // Update the user's codeComponents array with the new code component ID
        await User.findByIdAndUpdate(createdBy, { $push: { codeComponents: newCodeComponent._id } });
        // Return a success response with the created code component
        res.status(201).json(newCodeComponent);
    } catch (error) {
        // Handle server error and return an error response
        console.error(error);
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

// Get code components by category
export const getCodeComponentsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const codeComponents = await CodeComponent.find({ category });
        res.status(200).json(codeComponents);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};


