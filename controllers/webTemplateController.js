// webTemplateController.js
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
        // Check if the request is unauthorized
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { title, description, githubLink, deployLink, templateImage } = req.body;

        // Check if a web template with the same githubLink or deployLink already exists
        const existingWebTemplate = await webTemplate.findOne({ $or: [{ githubLink }, { deployLink }] });

        if (existingWebTemplate) {
            return res.status(400).json({ error: 'Web template with the same GitHub or deploy link already exists' });
        }

        // Create a new web template instance
        const newWebTemplate = new webTemplate({
            title,
            description,
            githubLink,
            deployLink,
            templateImage,
            createdBy: req.userId,
        });
        console.log('User ID:', req.userId); // Log user ID
        console.log('Request Body:', req.body); 
        // Save the new web template to the database
        await newWebTemplate.save();

        // Return a success response with the created web template
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
