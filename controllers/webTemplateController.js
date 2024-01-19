// webTemplateController.js
import User from '../models/User.js';
import webTemplate from '../models/webTemplate.js';
// import cloudinary from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.TEMP_CLOUD_NAME,
//     api_key: process.env.TEMP_API_KEY,
//     api_secret: process.env.TEMP_API_SECRET,
// });

// export const uploadTemplateImg = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const templateImage = req.body.tempImageUrl;
//         await webTemplate.updateMany({
//             templateImage: templateImage,
//             createdBy: userId,
//         });

//         res.status(201).json({
//             templateImage: templateImage.templateImage,
//         });
//     } catch (error) {
//         console.error('Error uploading template image:', error);
//         return res.status(500).json({ error: 'Server Error' });
//     }
// };


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
        const webTemplates = await webTemplate.find().sort({ createdAt: -1 });
        res.status(200).json(webTemplates);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get paginated web templates
export const getPaginatedWebTemplates = async (req, res) => {
    try {
        const { page = 1, perPage = 12 } = req.query;

        // Convert page and perPage to integers
        const currentPage = parseInt(page, 10);
        const itemsPerPage = parseInt(perPage, 10);

        // Calculate the number of documents to skip based on the current page
        const skip = (currentPage - 1) * itemsPerPage;

        // Fetch paginated web templates using Mongoose's skip and limit
        const webTemplates = await webTemplate.find().sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage);

        // Calculate the total number of web templates
        const totalCount = await webTemplate.countDocuments();

        // Return the paginated results as an array
        res.status(200).json(webTemplates);
    } catch (error) {
        console.error(error);
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

        if (!webTemplateIds) {
            return res.status(400).json({ error: 'Web template IDs are missing' });
        }

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

// Update a web template by ID
export const updateWebTemplate = async (req, res) => {
    try {
        const { webTempId } = req.params;
        const { title, description, githubLink, deployLink, templateImage } = req.body;

        // Update the web template using findByIdAndUpdate
        const updatedWebTemplate = await webTemplate.findByIdAndUpdate(
            webTempId,
            {
                title,
                description,
                githubLink,
                deployLink,
                templateImage,
            },
            { new: true, runValidators: true }
        );

        // Check if the web template was not found
        if (!updatedWebTemplate) {
            return res.status(404).json({ error: 'Web template not found' });
        }

        // Check if the authenticated user owns the web template
        if (updatedWebTemplate.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to update this web template' });
        }

        res.status(200).json(updatedWebTemplate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete a web template by ID
export const deleteWebTemplate = async (req, res) => {
    try {
        const { webTempId } = req.params;

        const existingWebTemplate = await webTemplate.findById(webTempId);

        if (!existingWebTemplate) {
            return res.status(404).json({ error: 'Web template not found' });
        }

        // Check if the authenticated user owns the web template
        if (existingWebTemplate.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this web template' });
        }

        // Remove the web template from the user's webTemplates array
        await User.findByIdAndUpdate(req.userId, { $pull: { webTemplates: webTempId } });

        // Delete the web template from the database
        await webTemplate.findByIdAndDelete(webTempId);

        res.status(200).json({ message: 'Web template deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};