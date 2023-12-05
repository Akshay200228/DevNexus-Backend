// webTemplateController.js
import User from '../models/User.js';
import webTemplate from '../models/webTemplate.js'

export const createWebTemplate = async (req, res) => {
    try {
        const createdBy = req.userId;

        // Check if the request is unauthorized
        if (!createdBy) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { title, description, githubLink, deployLink, templateImage } = req.body;
        const newWebTemplate = new webTemplate({
            title,
            description,
            githubLink,
            deployLink,
            templateImage,
            createdBy,
        });

        await newWebTemplate.save();

        // Update the user's webTemplates array
        await User.findByIdAndUpdate(createdBy, { $push: { webTemplates: newWebTemplate._id } });

        res.status(201).json(newWebTemplate);

    } catch (error) {
        console.log("object", error)
        // Handle server error and return an error response
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get all web templates
export const getAllWebTemplates = async (req, res) => {
    try {
        const webTemplates = await webTemplate.find();
        res.status(200).json(webTemplates);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};


// Get a single web template by ID
export const getSingleWebTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const webTemplateData = await webTemplate.findById(id);

        if (!webTemplateData) {
            return res.status(404).json({ error: 'Web template not found' });
        }

        res.status(200).json(webTemplateData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Fetch detailed data for web templates by IDs
export const getWebTemplatesByIds = async (req, res) => {
    try {
        const { webTemplateIds } = req.params;

        // Split the comma-separated string of IDs into an array
        const idsArray = webTemplateIds.split(',');

        // Use the $in operator to find web templates with matching IDs
        const webTemplates = await webTemplate.find({ _id: { $in: idsArray } });

        // Check if any web templates are found
        if (!webTemplates || webTemplates.length === 0) {
            return res.status(404).json({ error: 'Web templates not found' });
        }

        // Return the found web templates as a JSON response
        res.status(200).json(webTemplates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};