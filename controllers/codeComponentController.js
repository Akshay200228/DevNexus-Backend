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
        // Get the user ID and avatar of the creator from the request
        const { userId, userAvatar } = req;

        // Ensure userAvatar is not undefined
        if (userAvatar === undefined) {
            return res.status(500).json({ error: 'User avatar is undefined' });
        }

        // Create a new CodeComponent instance
        const newCodeComponent = new CodeComponent({
            title,
            description,
            code,
            category,
            createdBy: userId, // Fix the variable name here
            creatorAvatar: userAvatar
        });
        // Save the new code component to the database
        await newCodeComponent.save();
        // Update the user's codeComponents array with the new code component ID
        await User.findByIdAndUpdate(userId, { $push: { codeComponents: newCodeComponent._id } });
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


// Get a single code component by ID
export const getSingleCodeComponent = async (req, res) => {
    try {
        const { codeComponentId } = req.params;
        const codeComponent = await CodeComponent.findById(codeComponentId);

        if (!codeComponent) {
            return res.status(404).json({ error: 'Code component not found' });
        }

        res.status(200).json(codeComponent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Fetch detailed data for Code Components by IDs
export const getCodeComponentsByIds = async (req, res) => {
    try {
        const { codeComponentIds } = req.params;

        // Split the comma-separated string of IDs into an array
        const idsArray = codeComponentIds.split(',');

        // Use the $in operator to find code components with matching IDs
        const codeComponents = await CodeComponent.find({ _id: { $in: idsArray } });

        // Check if any code components are found
        if (!codeComponents || codeComponents.length === 0) {
            return res.status(404).json({ error: 'Code components not found' });
        }

        // Return the found code components as a JSON response
        res.status(200).json(codeComponents);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
