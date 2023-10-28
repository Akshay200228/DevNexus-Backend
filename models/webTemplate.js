// webTemplate Schema

import mongoose from "mongoose";

const webTemplateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    githubLink: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Regular expression to match a valid GitHub repository URL
                const githubRepoRegex = /^(https:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+(\/)?(#.*)?$/;

                // Check if the value matches the GitHub repository URL pattern
                return githubRepoRegex.test(value);
            },
            message: 'Invalid GitHub repository URL',
        },
    },

    deployLink: {
        type: String,
        required: true,
    },
    templateImage: {
        type: String, // Assuming the image is stored as a URL
        required: true,
    },
})


const WebTemplate = mongoose.model('WebTemplate', webTemplateSchema);

export default WebTemplate;
