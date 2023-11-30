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


// Update a code component by ID
export const updateCodeComponentById = async (req, res) => {
    try {
        const { title, description, category, code } = req.body;

        // Check if the user is authorized to update this code component
        const codeComponent = await CodeComponent.findById(req.params.id);
        if (!codeComponent || codeComponent.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to update this code component' });
        }

        // Update the code component
        codeComponent.title = title;
        codeComponent.description = description;
        codeComponent.category = category;
        codeComponent.code = code;

        await codeComponent.save();

        res.status(200).json(codeComponent);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete a code component by ID
export const deleteCodeComponentById = async (req, res) => {
    try {
        // Check if the user is authorized to delete this code component
        const codeComponent = await CodeComponent.findById(req.params.id);
        if (!codeComponent || codeComponent.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this code component' });
        }

        await CodeComponent.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
