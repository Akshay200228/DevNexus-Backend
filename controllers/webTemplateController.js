// webTemplateController.js
import User from '../models/User.js';
import webTemplate from '../models/webTemplate.js'

// Create a new web template
// export const createWebTemplate = async (req, res) => {
//     try {
//         const { title, description, githubLink, deployLink, templateImage } = req.body;

//         // Check if a web template with the same githubLink or deployLink already exists
//         const existingWebTemplate = await webTemplate.findOne({ $or: [{ githubLink }, { deployLink }] });

//         if (existingWebTemplate) {
//             return res.status(400).json({ error: 'Web template with the same GitHub or deploy link already exists' });
//         }

//         const newWebTemplate = new webTemplate({ title, description, githubLink, deployLink, templateImage });

//         await newWebTemplate.save();

//         res.status(201).json(newWebTemplate);
//     } catch (error) {
//         res.status(500).json({ error: 'Server Error' });
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
// webTemplate

// Get all web templates
export const getAllWebTemplates = async (req, res) => {
    try {
        const webTemplates = await webTemplate.find();
        res.status(200).json(webTemplates);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
