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
    },

    deployLink: {
        type: String,
        required: true,
    },
    templateImage: {
        type: String, // Assuming the image is stored as a URL
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
    },
}, { timestamps: true });


const WebTemplate = mongoose.model('WebTemplate', webTemplateSchema);

export default WebTemplate;
