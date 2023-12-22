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
            createdBy: userId,
            creatorAvatar: userAvatar,
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

// Get code components for a specific page with sorting
export const getAllCodeComponents = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 9; // Number of items per page
        const skip = (page - 1) * limit;

        const codeComponents = await CodeComponent.find()
            .sort({ createdAt: -1 }) // Sorting in descending order based on createdAt
            .skip(skip)
            .limit(limit);
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


// Update a code component by ID
export const updateCodeComponent = async (req, res) => {
    try {
        const { codeComponentId } = req.params;
        const { title, description, code, category } = req.body;

        // Update the code component using findByIdAndUpdate
        const updatedCodeComponent = await CodeComponent.findByIdAndUpdate(
            codeComponentId,
            {
                title,
                description,
                code,
                category,
            },
            { new: true, runValidators: true }
        );

        // Check if the code component was not found
        if (!updatedCodeComponent) {
            return res.status(404).json({ error: 'Code component not found' });
        }

        // Check if the authenticated user owns the code component
        if (updatedCodeComponent.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to update this code component' });
        }

        res.status(200).json(updatedCodeComponent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};


// Delete a code component by ID
export const deleteCodeComponent = async (req, res) => {
    try {
        const { codeComponentId } = req.params;

        const existingCodeComponent = await CodeComponent.findById(codeComponentId);

        if (!existingCodeComponent) {
            return res.status(404).json({ error: 'Code component not found' });
        }

        // Check if the authenticated user owns the code component
        if (existingCodeComponent.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this code component' });
        }

        // Remove the code component from the user's codeComponents array
        await User.findByIdAndUpdate(req.userId, { $pull: { codeComponents: codeComponentId } });

        // Delete the code component from the database
        await CodeComponent.findByIdAndDelete(codeComponentId);

        res.status(200).json({ message: 'Code component deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

