// controllers/codeComponentController.js
import CodeComponent from '../models/CodeComponent.js';

// Create a new code component
export const createCodeComponent = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { title, description, code } = req.body;
        const createdBy = req.userId; // Assuming you set the user's ID in the request object during authentication
        const newCodeComponent = new CodeComponent({ title, description, code, createdBy });
        await newCodeComponent.save();
        res.status(201).json(newCodeComponent);
    } catch (error) {
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
